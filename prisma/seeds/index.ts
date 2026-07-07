import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database JMCNET...");

  // 1. Admin
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@jmcnet.id";
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "adminpassword123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrator JMCNET",
      password: hashedPassword,
    },
  });
  console.log("✅ Admin seeded");

  // 2. Packages (4 Paket dengan fitur & status ceklis/silang persis frontend)
  const packages = [
    {
      id: 1,
      name: "SGC HEMAT",
      tierLabel: "Pemula / Hemat",
      tierNumber: "Tier 1",
      description: "Pilihan ekonomis untuk browsing harian & sosial media.",
      speedMbps: 5,
      priceMonthly: 130000,
      activationFee: 150000,
      features: JSON.stringify([
        { text: "Lancarkan 1 hingga 2 perangkat bersamaan", included: true },
        { text: "Browsing, WhatsApp, & media sosial lancar", included: true },
        { text: "Streaming YouTube & hiburan harian", included: true },
        { text: "Tanpa bonus hotspot member", included: false },
      ]),
      isFeatured: false,
    },
    {
      id: 2,
      name: "SGC LITE",
      tierLabel: "Rumah Tangga",
      tierNumber: "Tier 2",
      description: "Ideal untuk kebutuhan internet dasar harian keluarga.",
      speedMbps: 16,
      priceMonthly: 166500,
      activationFee: 150000,
      features: JSON.stringify([
        { text: "Lancarkan 1 hingga 3 perangkat bersamaan", included: true },
        { text: "Browsing, WhatsApp, & media sosial lancar", included: true },
        { text: "Streaming YouTube HD & hiburan keluarga", included: true },
        { text: "Bonus: Free Hotspot Member (2 Device)", included: true },
      ]),
      isFeatured: false,
    },
    {
      id: 3,
      name: "SGC SOCIALLY",
      tierLabel: "Optimal & Cepat",
      tierNumber: "Tier 3",
      description: "Kecepatan favorit untuk streaming 4K, WFH, & keluarga aktif.",
      speedMbps: 26,
      priceMonthly: 222000,
      activationFee: 150000,
      features: JSON.stringify([
        { text: "Lancarkan 3 hingga 6 perangkat bersamaan", included: true },
        { text: "Streaming film 4K & Zoom meeting online mulus", included: true },
        { text: "Work From Home & download file besar cepat", included: true },
        { text: "Bonus: Free Hotspot Member (2 Device)", included: true },
      ]),
      isFeatured: true,
    },
    {
      id: 4,
      name: "SGC FAMILY",
      tierLabel: "Performa Tinggi",
      tierNumber: "Tier 4",
      description: "Performa maksimal untuk keluarga besar, gaming, & bisnis.",
      speedMbps: 56,
      priceMonthly: 333000,
      activationFee: 150000,
      features: JSON.stringify([
        { text: "Lancarkan 6 hingga 10+ perangkat intensif", included: true },
        { text: "Gaming kompetitif latensi rendah (ping stabil)", included: true },
        { text: "Ideal untuk operasional cafe, toko, atau kantor usaha", included: true },
        { text: "Bonus: Prioritas Bandwidth & 2 Hotspot Member", included: true },
      ]),
      isFeatured: false,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { id: pkg.id },
      update: pkg,
      create: pkg,
    });
  }
  console.log("✅ Packages seeded");

  // 3. Voucher Plans (2 Voucher)
  const voucherPlans = [
    {
      id: 1,
      name: "Voucher Eceran (8 Jam)",
      type: "retail",
      tagLabel: "Pengguna Langsung",
      price: 3000,
      priceUnit: "/ voucher",
      duration: "Masa aktif 8 jam sejak login",
      minPurchase: null,
      features: JSON.stringify([
        "Langsung login di seluruh titik area Hotspot SGC Network",
        "Tanpa syarat administrasi atau pemasangan alat di rumah",
      ]),
    },
    {
      id: 2,
      name: "Paket Reseller Voucher",
      type: "reseller",
      tagLabel: "Harga Grosir Mitra",
      price: 2000,
      priceUnit: "/ voucher",
      duration: "Masa aktif 8 jam per voucher",
      minPurchase: "Min. 25 Pcs (Modal Rp 50k)",
      features: JSON.stringify([
        "Keuntungan Rp 1.000/voucher (Harga jual eceran Rp 3.000)",
        "Voucher bebas disimpan, masa aktif 8 jam baru hitung saat digosok",
      ]),
    },
  ];

  for (const v of voucherPlans) {
    await prisma.voucherPlan.upsert({
      where: { id: v.id },
      update: v,
      create: v,
    });
  }
  console.log("✅ Voucher Plans seeded");

  // 4. FAQs (12 Item)
  const faqs = [
    { id: 1, question: "Apakah benar-benar 100% tanpa batas kuota (Unlimited Tanpa FUP)?", answer: "Ya, 100% Benar! Seluruh paket internet rumah tangga (SGC HEMAT, LITE, SOCIALLY, FAMILY) bersifat benar-benar Unlimited tanpa aturan batas pemakaian wajar (FUP). Kecepatan internet Anda tidak akan diturunkan meskipun Anda mendownload atau streaming beratus-ratus gigabyte setiap bulannya." },
    { id: 2, question: "Apakah biaya bulanan sudah termasuk biaya sewa modem?", answer: "Ya, biaya bulanan yang tertera di daftar paket sudah GRATIS peminjaman modem Optical Network Terminal (ONT) selama Anda berlangganan. Tidak ada biaya sewa modem tambahan tersembunyi di tagihan bulanan Anda." },
    { id: 3, question: "Berapa biaya pasang baru dan apa saja yang didapatkan?", answer: "Biaya instalasi pasang baru saat ini sedang promo yaitu Rp 150.000 (normal Rp 300.000). Biaya ini sudah mencakup penarikan kabel fiber optik ke rumah Anda, peminjaman modem WiFi ONT, instalasi teknisi, dan konfigurasi jaringan hingga internet siap digunakan." },
    { id: 4, question: "Bagaimana sistem pembayaran tagihan bulanan JMCNET?", answer: "Sistem pembayaran kami menggunakan skema prabayar (pay-in-advance) atau pascabayar tergantung kesepakatan awal. Tagihan akan keluar setiap tanggal siklus pemasangan. Pembayaran dapat dilakukan dengan mudah melalui Transfer Bank (BRI, BCA, Mandiri), E-Wallet (DANA, OVO, GoPay), maupun melalui minimarket (Alfamart/Indomaret) melalui virtual account." },
    { id: 5, question: "Apa perbedaan jaringan Fiber Optic murni dengan internet wireless (radio/parabola)?", answer: "Fiber Optic menggunakan kabel serat kaca yang menghantarkan data menggunakan cahaya, sehingga koneksinya sangat stabil, memiliki latensi (ping) yang sangat rendah, dan 100% kebal terhadap gangguan cuaca buruk seperti hujan lebat atau petir. Berbeda dengan internet radio/parabola yang mudah terganggu oleh cuaca dan penghalang fisik." },
    { id: 6, question: "Berapa lama proses pemasangan sejak pendaftaran dilakukan?", answer: "Setelah Anda mendaftar via WhatsApp dan lokasi Anda terkonfirmasi masuk dalam area cakupan (ODP tersedia), tim teknisi kami akan menjadwalkan pemasangan ke rumah Anda dalam waktu 1x24 jam hingga maksimal 2x24 jam." },
    { id: 7, question: "Apa yang dimaksud dengan bonus 'Free Hotspot Member'?", answer: "Sebagai nilai tambah eksklusif, setiap pelanggan bulanan JMCNET mendapatkan akun login gratis untuk terkoneksi ke jaringan WiFi Hotspot publik SGC Network yang tersebar di berbagai titik di wilayah Cirebon. Jumlah perangkat yang bisa login tergantung tier paket Anda (2 hingga 5 perangkat sekaligus)." },
    { id: 8, question: "Bagaimana jika terjadi kendala atau gangguan internet?", answer: "Tim Customer Service dan Technical Support kami siap membantu Anda. Anda dapat menghubungi CS melalui WhatsApp di nomor 0851-7999-7972 or 0851-7999-7975 pada jam operasional. Jika kendala memerlukan perbaikan fisik (seperti kabel putus), teknisi lapangan akan dikerahkan secepatnya." },
    { id: 9, question: "Apakah saya bisa upgrade atau downgrade paket internet di kemudian hari?", answer: "Tentu saja! Anda bisa mengajukan perubahan paket (upgrade atau downgrade) kapan saja dengan menghubungi Customer Service kami minimal 3 hari sebelum tanggal jatuh tempo tagihan bulanan berikutnya. Tidak ada biaya penalti untuk perubahan paket." },
    { id: 10, question: "Apakah jaringan JMCNET cocok untuk bermain game online kompetitif?", answer: "Sangat cocok! Karena menggunakan jaringan 100% Fiber Optic murni serta routing bandwidth yang dioptimalkan, JMCNET menawarkan latensi (ping) yang sangat rendah dan stabil ke berbagai server game online populer seperti Mobile Legends, PUBG, Valorant, Dota 2, dan Free Fire." },
    { id: 11, question: "Apakah ada kontrak berlangganan atau denda jika berhenti?", answer: "Kami berkomitmen pada kenyamanan pelanggan. Berlangganan di JMCNET bersifat fleksibel. Namun, untuk peminjaman perangkat modem ONT, apabila Anda memutuskan berhenti berlangganan, perangkat modem wajib dikembalikan dalam kondisi baik kepada tim teknisi kami." },
    { id: 12, question: "Bagaimana cara mendaftar atau mengecek apakah rumah saya tercover?", answer: "Caranya sangat mudah! Cukup klik tombol 'Daftar via WA' atau 'Cek Lokasi' yang ada di website ini. Anda akan langsung terhubung dengan admin Customer Service kami via WhatsApp. Kirimkan share location (titik koordinat) rumah Anda, dan tim kami akan mengecek ketersediaan jaringan di lokasi Anda saat itu juga." },
  ];

  for (const faq of faqs) {
    await prisma.faq.upsert({
      where: { id: faq.id },
      update: faq,
      create: faq,
    });
  }
  console.log("✅ FAQs seeded");

  // 5. Testimonials (4 Item persis frontend)
  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Pelanggan Rumah Tangga (Arjawinangun)",
      quote: "Instalasi di rumah sangat cepat dan rapi. Kecepatan internet stabil meskipun seluruh anggota keluarga menggunakannya bersamaan untuk streaming dan sekolah online.",
    },
    {
      id: 2,
      name: "Dewi Lestari",
      role: "Pemilik UMKM Toko Pakaian (Tegalgubug)",
      quote: "Sangat terbantu untuk operasional toko online kami. Jaringan internetnya murni tanpa FUP, membuat proses upload katalog dan membalas chat pelanggan tanpa hambatan.",
    },
    {
      id: 3,
      name: "Rian Wijaya",
      role: "Manajer Operasional Kantor (Arjawinangun)",
      quote: "Koneksi internet JMCNET luar biasa stabil. Tim support teknisnya sangat sigap membantu ketika kami membutuhkan konfigurasi jaringan kantor tambahan.",
    },
    {
      id: 4,
      name: "Andi Saputra",
      role: "Freelancer (Tegalgubug Lor)",
      quote: "Harga sangat terjangkau dengan kualitas kecepatan yang memuaskan. Saya bisa meeting online seharian tanpa gangguan putus-putus.",
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
  console.log("✅ Testimonials seeded");

  // 6. Site Settings (1 Row)
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: "PT Jaringan Multimedia Cirebon",
      brandName: "JMCNET",
      logo: "/logo-removebg.png",
      tagline: "100% Fiber Optic Cirebon",
      whatsappCs1: "6285179997972",
      whatsappCs2: "6285179997975",
      email: "info@jmcnet.id",
      address: "Arjawinangun, Cirebon, Jawa Barat",
      operationalHours: "Senin - Sabtu (09:00 - 18:00)",
      heroHeadline: "Dedikasi Menghubungkan Cirebon Tanpa Batas",
      heroSubtext: "Kami hadir untuk memberikan layanan internet serat optik (fiber optic) terbaik, tercepat, dan paling stabil untuk rumah tangga, bisnis, hingga pedesaan di wilayah Cirebon dan sekitarnya.",
      aboutTitle: "PT Jaringan Multimedia Cirebon (SGC Network)",
      aboutDescription: "Didirikan dengan visi untuk mengurangi kesenjangan digital di daerah, PT Jaringan Multimedia Cirebon telah berkembang menjadi salah satu penyedia layanan internet (ISP) lokal terpercaya. Kami berkomitmen memberikan konektivitas tanpa batas dengan teknologi fiber optik murni 100% yang tangguh terhadap cuaca dan memiliki latensi rendah.",
    },
  });
  console.log("✅ Site Settings seeded");

  // 7. Chatbot Context awal
  const defaultChatbotContext = `
Kamu adalah asisten virtual resmi JMCNET (PT Jaringan Multimedia Cirebon), penyedia layanan internet fiber optic terpercaya di wilayah Cirebon.
Gunakan informasi berikut untuk menjawab pertanyaan pelanggan:

- Perusahaan: PT Jaringan Multimedia Cirebon (JMCNET / SGC Network)
- Bidang Layanan: Penyedia Jasa Internet (ISP) Fiber Optic 100% Murni
- Alamat Kantor: Blok 04 Assa'idiyah RT.03 RW.03, Desa Tegalgubug Lor, Kecamatan Arjawinangun, Kabupaten Cirebon, Jawa Barat 45162
- Jam Operasional CS: Senin - Sabtu (09:00 - 18:00 WIB), Hari Minggu Libur.
- Nomor CS 1 (WhatsApp): +6285179997972 (0851-7999-7972)
- Nomor CS 2 (WhatsApp): +6285179997975 (0851-7999-7975)
- Email Kantor: info@jmcnet.id

Aturan Jawaban:
- Jawablah dengan sapaan hangat, sopan, ramah, dan panggil pelanggan dengan sebutan "Kakak".
- Informasikan dengan detail keunggulan paket internet bulanan (SGC HEMAT, SGC LITE, SGC SOCIALLY, SGC FAMILY) dan Voucher Hotspot (eceran/reseller).
- Tegaskan bahwa internet bulanan bersifat 100% Unlimited Tanpa Kuota & Tanpa FUP (tidak ada batas pemakaian wajar yang menurunkan kecepatan).
- Jika pelanggan menanyakan cara mendaftar pasang baru, arahkan langsung dengan memberikan link / tombol daftar via WhatsApp ke nomor CS JMCNET.
- Tulis jawaban dengan rapi menggunakan bullet points (daftar berpoin) atau tabel Markdown agar nyaman dibaca.
`.trim();

  await prisma.chatbotContext.upsert({
    where: { name: "Profil JMCNET" },
    update: {
      context: defaultChatbotContext,
    },
    create: {
      name: "Profil JMCNET",
      context: defaultChatbotContext,
    },
  });
  console.log("✅ Chatbot Context seeded");

  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
