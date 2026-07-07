import { db } from "../utils/prisma";

export const chatbotFileRepository = {
  async create(data: {
    filename: string;
    filePath: string;
    fileUrl: string;
    content: string;
  }) {
    return await db.chatbotFile.create({
      data,
    });
  },

  async getById(id: number) {
    return await db.chatbotFile.findUnique({
      where: { id },
    });
  },

  async getAll() {
    return await db.chatbotFile.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async delete(id: number) {
    return await db.chatbotFile.delete({
      where: { id },
    });
  },

  async getAllContent(): Promise<string> {
    const files = await db.chatbotFile.findMany({
      select: { filename: true, content: true },
    });

    if (files.length === 0) return "";

    return files
      .map((file) => `Document Name: ${file.filename}\nContent:\n${file.content}`)
      .join("\n\n=================================\n\n");
  },
};
export type ChatbotFileRepository = typeof chatbotFileRepository;
