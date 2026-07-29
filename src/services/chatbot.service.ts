import OpenAI from "openai";
import { env } from "../config/env";
import { chatbotContextRepository } from "../repositories/chatbotContext.repository";
import { chatbotFileRepository } from "../repositories/chatbotFile.repository";
import { knowledgeService } from "./knowledge.service";
import { saveUploadedFile } from "../utils/file";
import { parseFileContent } from "../utils/parser";
import { chatbotFileRepository as fileRepo } from "../repositories/chatbotFile.repository";
import { NotFoundException } from "../exceptions/NotFoundException";
import fs from "fs";

const client = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const defaultContextPrompt = `
Kamu adalah asisten virtual resmi JMCNET (PT Jaringan Multimedia Cirebon), penyedia layanan internet fiber optic terpercaya di wilayah Cirebon.

Tugas & Persona:
1. Jawablah pertanyaan pelanggan dengan ramah, santun, hangat (selalu panggil dengan sebutan 'kakak'), dan informatif.
2. Bantu pelanggan mendapatkan rincian lengkap mengenai paket internet fiber optic (Unlimited Tanpa FUP), voucher hotspot, harga pasang baru, cara pembayaran, dan cara mengecek cakupan area.
3. Selalu periksa data paket dan FAQ di database yang disediakan untuk memberikan rincian yang detail dan akurat.
4. Jika menjelaskan paket, sajikan rincian harga bulanan, biaya aktivasi, kecepatan Mbps, dan fasilitas (seperti bonus hotspot member atau tidak ada bonus) menggunakan daftar berpoin (bullet points) atau tabel Markdown yang rapi.
5. Bila pelanggan ingin mendaftar paket internet, arahkan mereka untuk menghubungi Customer Service via WhatsApp ke nomor CS yang tercantum di Site Settings.
`.trim();

export const chatbotService = {
  async getResponse(message: string) {
    if (!env.GROQ_API_KEY || env.GROQ_API_KEY === "dummy") {
      return {
        reasoning: "Groq API Key is not configured.",
        answer: "Halo kak! Maaf asisten virtual JMCNET sedang beristirahat sejenak. Silakan langsung hubungi admin kami melalui WhatsApp di nomor 0851-7999-7972 ya kak! Terima kasih.",
      };
    }

    try {
      const [chatbotContext, publicDatabaseSnapshot, chatbotFilesContent] = await Promise.all([
        chatbotContextRepository.getByName("Profil JMCNET"),
        chatbotContextRepository.getPublicDatabaseSnapshot(),
        chatbotFileRepository.getAllContent(),
      ]);

      const mainContext = chatbotContext?.context?.trim() || defaultContextPrompt;
      const databaseContext = publicDatabaseSnapshot.trim();
      const filesContext = chatbotFilesContent.trim();


      // --- System Message: persona, rules, and all context data ---
      const systemMessage = `
${mainContext}

=== DATA DARI DATABASE (WAJIB DIGUNAKAN SEBAGAI SUMBER UTAMA) ===
Data berikut adalah data RESMI dan TERKINI yang diambil langsung dari database perusahaan.
Ketika user bertanya tentang daftar paket, harga, voucher, FAQ, atau informasi perusahaan, kamu WAJIB merujuk SELURUH data di bawah ini.
JANGAN PERNAH melewatkan atau mengabaikan item apapun dari data ini. SEBUTKAN SEMUA item yang relevan.

${databaseContext}

${filesContext ? `=== KONTEKS TAMBAHAN DARI DOKUMEN ===\n${filesContext}` : ""}

=== ATURAN RESPON ===
1. WAJIB: Jika user bertanya daftar paket/voucher, SEBUTKAN SEMUA paket/voucher yang ada di data di atas tanpa terkecuali. Hitung jumlahnya dan pastikan cocok.
2. JANGAN menulis tanggapan dalam bentuk satu paragraf panjang (anti-wall-of-text).
3. Gunakan sapaan "kakak" yang hangat di awal dan akhir.
4. Gunakan bullet points, bold, atau tabel Markdown agar mudah dibaca.
5. Jawab HANYA menggunakan data yang tersedia di atas. Jangan mengarang data di luar konteks.
6. Jika user ingin mendaftar, arahkan ke WhatsApp CS.
`.trim();

      // --- User Message: just the question ---
      const userMessage = message;

      let response;
      let usedModel = "llama-3.3-70b-versatile";

      try {
        response = await client.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
          ],
          temperature: 0.4,
          max_tokens: 2048,
        });
      } catch (firstErr) {
        console.warn("Primary model llama-3.3-70b-versatile failed. Trying fallback model llama-3.1-8b-instant...", firstErr);
        usedModel = "llama-3.1-8b-instant";
        response = await client.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
          ],
          temperature: 0.4,
          max_tokens: 1536,
        });
      }

      const answer = response.choices[0]?.message?.content || "Halo kak! Maaf, silakan hubungi admin via WhatsApp untuk info lebih lanjut ya kak.";
      const reasoning = `Menganalisis pertanyaan pelanggan mengenai layanan JMCNET, memetakan data paket internet secara dinamis (RAG), serta merumuskan jawaban terbaik menggunakan model ${usedModel} di Groq API...`;

      return {
        reasoning,
        answer,
      };
    } catch (err: any) {
      console.error("Groq Chatbot Error:", err);
      return {
        reasoning: `Error encountered: ${err.message}`,
        answer: "Halo kak! Maaf terjadi gangguan koneksi pada sistem chatbot asisten kami. Kakak bisa langsung menanyakan hal ini ke WhatsApp admin ya kak!",
      };
    }
  },

  async getAllContexts() {
    return chatbotContextRepository.getAll();
  },

  async updateContext(id: number, context: string) {
    return chatbotContextRepository.update(id, context);
  },

  async uploadFile(file: Express.Multer.File) {
    // 1. Read file buffer
    const buffer = fs.readFileSync(file.path);

    // 2. Parse text content based on file type
    const parsedText = await parseFileContent(buffer, file.mimetype, file.originalname);

    // 3. Save file using saveUploadedFile helper
    const saved = await saveUploadedFile(file);

    // 4. Save to db
    return await fileRepo.create({
      filename: file.originalname,
      filePath: saved.path,
      fileUrl: saved.url,
      content: parsedText,
    });
  },

  async getAllFiles() {
    return chatbotFileRepository.getAll();
  },

  async deleteFile(id: number) {
    const file = await chatbotFileRepository.getById(id);
    if (!file) {
      throw new NotFoundException(`Chatbot file with ID ${id} not found`);
    }

    // Delete physically
    try {
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath);
      }
    } catch (err) {
      console.error("Failed to delete physical file:", err);
    }

    await chatbotFileRepository.delete(id);
    return null;
  },
};
export type ChatbotService = typeof chatbotService;
