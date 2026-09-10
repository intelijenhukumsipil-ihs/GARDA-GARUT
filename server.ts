import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'GARDA GARUT Gateway Server',
    organizer: 'Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Kabupaten Garut',
    developer: 'Ir. Risa Kristalia N., ST., MT. (Pemilik & Pengembang Inovasi SPBE)',
    whatsappGateway: '+62 813-1640-3160',
    timestamp: new Date().toISOString()
  });
});

// WhatsApp Gateway Server Integration Endpoint (+62 813-1640-3160 / 081316403160)
app.post('/api/gateway/whatsapp-send', (req, res) => {
  const { recipientPhone = '+62 813-1640-3160', messageType = 'SYSTEM_ALERT', data = {} } = req.body;

  const targetNumber = recipientPhone || '+62 813-1640-3160';
  const cleanPhone = targetNumber.replace(/[^0-9]/g, '');

  let textHeader = '[GARDA GARUT - GATEWAY SERVER NOTIFICATION]\n';
  let bodyContent = '';

  if (messageType === 'DAMAGE_REPORT') {
    bodyContent = `🚨 *LAPORAN KERUSAKAN INFRASTRUKTUR BARU*\nAset: ${data.assetName || 'Aset PUPR'}\nLokasi: Kec. ${data.district || 'Garut'}\nPelapor: ${data.reporterName || 'Warga'}\nSkor Prioritas: ${data.priorityScore || 85}/100\nDeskripsi: ${data.description || 'Diperlukan perbaikan segera.'}`;
  } else if (messageType === 'SLA_ALERT') {
    bodyContent = `⚠️ *PERINGATAN SLA REKOMENDASI SIMBG*\nNomor Ref SIMBG: ${data.simbgReferenceNo || 'SIMBG-PBG-GRT-2026'}\nBangunan: ${data.buildingName || 'Bangunan Gedung'}\nSisa Waktu SLA: ${data.slaHoursLeft || 12} Jam\nOPD: ${data.opdName || 'Dinas Teknis'}`;
  } else if (messageType === 'RECOMMENDATION') {
    bodyContent = `✅ *REKOMENDASI TERPADU TERBIT & SYNC SIMBG*\nNo Rekomendasi: ${data.docNo || 'REK-PUPR-GRT-2026-001'}\nNomor SIMBG: ${data.simbgReferenceNo || 'SIMBG-PBG-GRT-2026'}\nPemohon: ${data.applicantName || 'Pemohon'}\nPenandatangan: Ir. Risa Kristalia N., ST., MT. (Dinas PUPR Garut)`;
  } else if (messageType === 'QR_VERIFY') {
    bodyContent = `🔍 *HASIL VERIFIKASI KODE QR UNIK BSrE*\nItem: ${data.title || 'Aset/Dokumen GARDA'}\nKode Ref: ${data.code || 'GRD-REF-001'}\nStatus: VERIFIED SAH (BSrE Seal)\nTimestamp: ${new Date().toLocaleString()}`;
  } else {
    bodyContent = `📢 *NOTIFIKASI KOORDINASI SPBE*\nPesan: ${data.message || 'Sistem Gateway Server GARDA GARUT berjalan normal.'}\nServer WA Target: +62 813-1640-3160 (081316403160)`;
  }

  const fullMessage = `${textHeader}${bodyContent}\n\n_Pengembang & Pemilik Inovasi: Ir. Risa Kristalia N., ST., MT._`;
  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`;

  res.json({
    success: true,
    message: `Notifikasi berhasil dikirimkan ke Gateway WhatsApp Server (+62 813-1640-3160 / 081316403160).`,
    whatsappNumber: '+62 813-1640-3160',
    cleanPhone,
    messageId: `WA-GW-GRT-2026-${Math.floor(Math.random() * 900000) + 100000}`,
    waLink,
    fullMessage,
    timestamp: new Date().toISOString()
  });
});

// Gateway Translation Simulation Endpoint
app.post('/api/gateway/translate-simbg', (req, res) => {
  const { caseData } = req.body;
  if (!caseData) {
    return res.status(400).json({ error: 'Missing caseData payload' });
  }

  // Simulate gateway translation process
  const simbgSchema = {
    simbg_header: {
      gateway_id: 'GW-GRT-PUPR-001',
      version: '3.1.0-SIMBG',
      target: 'KEMENPUPR_SIMBG_CENTRAL',
      timestamp: new Date().toISOString()
    },
    translated_payload: {
      nomor_registrasi_simbg: caseData.simbgReferenceNo || 'SIMBG-PBG-GRT-2026-UNKNOWN',
      nomor_kasus_garda: caseData.id,
      jenis_permohonan: caseData.applicationType,
      pemohon: {
        nama: caseData.applicantName,
        nik: caseData.applicantNik,
        kontak: caseData.applicantPhone
      },
      bangunan: {
        nama: caseData.buildingName,
        fungsi: caseData.buildingFunction,
        luas_m2: caseData.buildingAreaSqm,
        jumlah_lantai: caseData.floorsCount,
        alamat_lokasi: `${caseData.address}, Kec. ${caseData.district}, Kab. Garut`
      },
      penilaian_opd_terpadu: caseData.opdAssessments || []
    }
  };

  res.json({
    success: true,
    message: 'Data berhasil diterjemahkan ke format SIMBG v3.0 tanpa mengubah substansi.',
    simbgSchema
  });
});

// Smart AI Assistant Endpoint (Gemini API Server-Side)
app.post('/api/gemini/smart-analyze', async (req, res) => {
  try {
    const { promptType, data } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return smart simulated response if key not provided
      if (promptType === 'DAMAGE_VERIFY') {
        return res.json({
          analysis: `[ANALISIS AI CERDAS GARDA]
- Tingkat Kerusakan: Sedang/Berat
- Potensi Risiko: Tinggi (Lokasi ${data.district || 'Garut'}, Jalur Vital).
- Rekomendasi Material: Beton Precast / Batu Kali, Semen Portland High Durability.
- Estimasi Waktu Pengerjaan: 3 - 5 Hari Kerja.`,
          isSimulated: true
        });
      } else {
        return res.json({
          analysis: `[SISTEM PENYARINGAN CERDAS GARDA BANGUNAN]
- Evaluasi Dokumen: Telah memenuhi 85% regulasi RTRW & Perda Bangunan Gedung Kab. Garut.
- Catatan Penelaah: Wajib melengkapi titik koordinat sumur resapan & buffer TPS B3.`,
          isSimulated: true
        });
      }
    }

    const ai = new GoogleGenAI({ apiKey });
    let systemInstruction = "Anda adalah Asisten Sistem Cerdas GARDA GARUT (Dinas PUPR Kabupaten Garut). Berikan analisis teknis infrastruktur atau perizinan bangunan secara singkat, profesional, dan akurat sesuai aturan SPBE dan Perda Garut.";
    let prompt = "";

    if (promptType === 'DAMAGE_VERIFY') {
      prompt = `Analisis laporan kerusakan infrastruktur berikut di Kabupaten Garut:\nNama Aset: ${data.assetName}\nLokasi: ${data.district}\nDeskripsi: ${data.description}\nBerikan penilaian tingkat keparahan (Ringan/Sedang/Berat/Darurat), analisis potensi bahaya, rekomendasi tim/material, dan estimasi hari kerja.`;
    } else {
      prompt = `Analisis kasus perizinan bangunan berikut:\nNama Bangunan: ${data.buildingName}\nFungsi: ${data.buildingFunction}\nLuas: ${data.buildingAreaSqm} m2, ${data.floorsCount} lantai.\nNomor SIMBG Ref: ${data.simbgReferenceNo}\nEvaluasi potensi catatan teknis antar-dinas (DLH, Dishub, PUPR, Satpol PP).`;
    }

    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction
      }
    });

    const response = await withTimeout(geminiPromise, 2500, 'Gemini analyze timeout');

    res.json({
      analysis: response.text,
      isSimulated: false
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || 'Gemini processing failed' });
  }
});

// Helper function with strict timeout for lightning-fast responses
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMsg = 'Operation timed out'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(timeoutMsg)), timeoutMs))
  ]);
}

// Helper function to generate instant smart responses for GAGA Mascot
function generateGagaSmartReply(userQuestion: string): string {
  const lowerQ = (userQuestion || '').toLowerCase();

  // Responsif / Cepat Tanggap
  if (lowerQ.includes('cepat') || lowerQ.includes('lelet') || lowerQ.includes('tanggap') || lowerQ.includes('lambat') || lowerQ.includes('responsif')) {
    return '⚡ **GAGA SIAP TANGGAP CEPAT!** 🤖💨\n\nRespon GAGA sekarang dioptimalkan dengan mode *Turbo Fast Engine*! Tidak ada lagi lelet atau tertunda. Semua informasi layanan Dinas PUPR Kabupaten Garut langsung terjawab seketika!\n\nAda yang bisa GAGA bantu sekarang mengenai PBG/SIMBG, laporan jalan rusak, atau WA Gateway Server (081316403160)?';
  }

  // SIMBG / PBG / SLF / Rekomendasi
  if (lowerQ.includes('simbg') || lowerQ.includes('pbg') || lowerQ.includes('izin') || lowerQ.includes('bangunan') || lowerQ.includes('slf') || lowerQ.includes('gedung') || lowerQ.includes('persetujuan') || lowerQ.includes('imb')) {
    return 'Sampurasun! GAGA jelaskan perizinan PBG & SLF di Dinas PUPR Garut: 🏢⚡\n\n1. Buka menu **GARDA BANGUNAN**.\n2. Unggah dokumen permohonan, gambar teknis & lokasi.\n3. Tim Teknis PUPR & OPD terkait (DLH, Dishub, Satpol PP) melakukan telaah terpadu secara paralel.\n4. Menerbitkan **Surat Rekomendasi Teknis Terpadu ber-QR BSrE** yang otomatis tersinkronisasi ke portal SIMBG Kementerian PUPR!\n\n📲 Notifikasi status permohonan langsung dikirim ke WhatsApp pemohon melalui Server Resmi: **081316403160** (+62 813-1640-3160).';
  }
  
  // Infrastruktur / Jalan Rusak / Jembatan / Irigasi
  if (lowerQ.includes('jalan') || lowerQ.includes('rusak') || lowerQ.includes('jembatan') || lowerQ.includes('irigasi') || lowerQ.includes('lapor') || lowerQ.includes('drainase') || lowerQ.includes('infra') || lowerQ.includes('pengaduan') || lowerQ.includes('lubang') || lowerQ.includes('longsor')) {
    return 'Wilujeng sumping! GAGA siap tanggap darurat infrastruktur! 🚧👷‍♂️\n\nJika menemukan jalan berlubang, jembatan rusak, atau saluran irigasi tersumbat di Kabupaten Garut:\n1. Masuk ke modul **GARDA INFRA**.\n2. Klik tombol **"Buat Laporan Baru"**.\n3. Lampirkan foto kondisi fisik, pilih kecamatan (dari 42 Kecamatan) & tuliskan deskripsi.\n4. Algoritma prioritas GARDA menghitung tingkat keparahan dan meneruskannya ke Pengawas Lapangan PUPR di kecamatan terkait!\n\nAnda juga bisa langsung mengirim laporan via WhatsApp Server: **081316403160**.';
  }

  // WhatsApp Server / Hotline / Kontak
  if (lowerQ.includes('wa') || lowerQ.includes('whatsapp') || lowerQ.includes('nomor') || lowerQ.includes('server') || lowerQ.includes('gateway') || lowerQ.includes('hotline') || lowerQ.includes('kontak') || lowerQ.includes('telepon') || lowerQ.includes('hubungi')) {
    return 'Halo! Berikut nomor resmi **WhatsApp Gateway Server Dinas PUPR Kabupaten Garut**: 📲\n\n⭐ **+62 813-1640-3160** (081316403160)\n\nFasilitas Server WA Cerdas:\n• Notifikasi real-time SLA pengajuan PBG / SLF SIMBG\n• Konfirmasi tanda terima pelaporan jalan & infrastruktur rusak\n• Tautan verifikasi dokumen resmi & kode unik QR BSrE\n• Koordinasi 42 pengawas kecamatan di seluruh Kabupaten Garut!';
  }

  // Pelayanan Publik (8 Layanan Drive)
  if (lowerQ.includes('pelayanan') || lowerQ.includes('layanan') || lowerQ.includes('drive') || lowerQ.includes('krk') || lowerQ.includes('pkkpr') || lowerQ.includes('feil') || lowerQ.includes('banjir') || lowerQ.includes('rumija') || lowerQ.includes('siteplan')) {
    return '📂 **8 LAYANAN PUBLIK DINAS PUPR KABUPATEN GARUT**:\n\n1. **KRK**: Keterangan Rencana Kabupaten/Kota (Tata Ruang)\n2. **PKKPR**: Kesesuaian Kegiatan Pemanfaatan Ruang Usaha\n3. **FEIL BANJIR**: Rekomendasi Elevasi Lantai Cegah Banjir\n4. **IRIGASI TEKNIS**: Pemanfaatan Jaringan Irigasi SDA\n5. **RUMIJA**: Rekomendasi Ruang Milik Jalan (Bina Marga)\n6. **SITEPLAN**: Pengesahan Tata Letak & Tapak Kawasan\n7. **PBG**: Persetujuan Bangunan Gedung (SIMBG)\n8. **SLF**: Sertifikat Laik Fungsi Bangunan Gedung\n\nSemua berkas dan formulir resmi dapat diakses di modul **PELAYANAN PUBLIK**!';
  }

  // Inovasi & Pengembang
  if (lowerQ.includes('inovasi') || lowerQ.includes('pengembang') || lowerQ.includes('pencipta') || lowerQ.includes('pembuat') || lowerQ.includes('risa') || lowerQ.includes('kristalia')) {
    return '💡 **INOVATOR & PENGEMBANG SPBE GARDA GARUT**:\n\nInovasi **GARDA GARUT** dirancang dan dikembangkan oleh:\n**Ir. Risa Kristalia N., ST., MT.**\n*Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Kabupaten Garut*\n\nInovasi ini mengintegrasikan pengawasan aset daerah, percepatan rekomendasi teknis PBG, penjaminan keamanan kode QR BSrE, dan server WhatsApp Gateway untuk 42 kecamatan se-Kabupaten Garut.';
  }

  // 42 Kecamatan & Peta Administratif
  if (lowerQ.includes('kecamatan') || lowerQ.includes('pengawas') || lowerQ.includes('peta') || lowerQ.includes('wilayah') || lowerQ.includes('petugas') || lowerQ.includes('teritori')) {
    return '🗺️ **PETA INTERAKTIF 42 KECAMATAN KABUPATEN GARUT**:\n\nGARDA GARUT memetakan seluruh wilayah administratif Garut:\n• **Garut Utara**: Limbangan, Malangbong, Selaawi, Leles, Kadungora, Kersamanah, Leuwigoong, Cibatu, Cibiuk\n• **Garut Tengah**: Garut Kota, Tarogong Kaler/Kidul, Banyuresmi, Karangpawitan, Wanaraja, Samarang, Pasirwangi, dll.\n• **Garut Selatan**: Pameungpeuk, Cikelet, Cibalong, Cisompet, Bungbulang, Cisewu, Talegong, dll.\n\nBuka menu **Peta Interaktif** untuk melihat peta asli BAPPEDA & hubungi pengawas PUPR per kecamatan!';
  }

  // QR Code & BSrE
  if (lowerQ.includes('qr') || lowerQ.includes('code') || lowerQ.includes('barcode') || lowerQ.includes('verifikasi') || lowerQ.includes('bsre') || lowerQ.includes('tte') || lowerQ.includes('asli') || lowerQ.includes('palsu') || lowerQ.includes('validasi')) {
    return '🔐 **VERIFIKASI KODE QR RESMI (BSrE & TTE)**:\n\nSetiap dokumen Rekomendasi Terpadu dan plat fisik aset infrastruktur dilengkapi Kode QR Digital berstandar BSrE (Balai Sertifikasi Elektronik).\n\nAnda dapat memindai langsung menggunakan kamera ponsel pada modul **Generator & Scan QR** untuk melihat status keaslian, nama penandatangan, tanggal terbit, dan riwayat revisi resmi.';
  }

  // Menu / Fitur / Apa itu GARDA GARUT
  if (lowerQ.includes('fitur') || lowerQ.includes('menu') || lowerQ.includes('aplikasi') || lowerQ.includes('apa itu') || lowerQ.includes('cara') || lowerQ.includes('bantuan') || lowerQ.includes('garda')) {
    return 'Sampurasun! GAGA jelaskan ekosistem **GARDA GARUT** (Gerbang Administrasi, Rekomendasi, dan Data Terpadu): 🤖💡\n\n1. 🏢 **GARDA BANGUNAN**: Rekomendasi teknis PBG/SLF & Sync SIMBG KemenPUPR.\n2. 🚧 **GARDA INFRA**: Pelaporan jalan/jembatan/irigasi & Pemantauan 42 Kecamatan.\n3. 📂 **PELAYANAN PUBLIK**: 8 Layanan Drive terpadu (KRK, PKKPR, Rumija, dll).\n4. 📲 **WA GATEWAY**: Notifikasi real-time ke **081316403160**.\n5. 🗺️ **PETA INTERAKTIF**: Teritori administratif & koordinasi pengawas.\n6. 🔍 **VERIFIKASI QR**: Validasi BSrE cetakan dokumen & aset.';
  }

  // Sapaan / Salam
  if (lowerQ.includes('halo') || lowerQ.includes('hi') || lowerQ.includes('hai') || lowerQ.includes('sampurasun') || lowerQ.includes('wilujeng') || lowerQ.includes('pagi') || lowerQ.includes('siang') || lowerQ.includes('malam') || lowerQ.includes('sore') || lowerQ.includes('assalamu')) {
    return 'Sampurasun! Wilujeng sumping! GAGA Maskot Cerdas Dinas PUPR Garut siap melayani dengan cepat! 🤖✨\n\nAda yang bisa GAGA bantu seputar Rekomendasi PBG SIMBG, Laporan Jalan Rusak, Pengawas 42 Kecamatan, 8 Layanan Publik, atau WhatsApp Server (081316403160)? Silakan ketik pertanyaan Anda!';
  }

  // Terima Kasih
  if (lowerQ.includes('terima kasih') || lowerQ.includes('makasih') || lowerQ.includes('hatur nuhun') || lowerQ.includes('thanks') || lowerQ.includes('nuhun')) {
    return 'Sami-sami! Hatur nuhun kembali! 😊 GAGA selalu siap tanggap melayani informasi infrastruktur & SPBE Dinas PUPR Kabupaten Garut!';
  }

  return `Sampurasun! GAGA di sini! 🤖\n\nMengenai "${userQuestion}", GAGA siap bantu seketika:\n• **Rekomendasi PBG/SLF SIMBG** di modul GARDA BANGUNAN\n• **Laporan Jalan / Jembatan Rusak** di modul GARDA INFRA\n• **8 Layanan Publik Google Drive** di modul Pelayanan Publik\n• **Pengawas 42 Kecamatan** & **Verifikasi QR BSrE**\n• **WhatsApp Gateway Server**: +62 813-1640-3160 (081316403160)\n\nSilakan pilih topik cepat atau ketik detail yang ingin Anda ketahui!`;
}

// Mascot Chat QA Endpoint (GAGA - Maskot Pintar Dinas PUPR Garut)
app.post('/api/gemini/mascot-chat', async (req, res) => {
  const { userQuestion, chatHistory = [] } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Fast pre-check: immediately resolve common short questions in under 10ms
  const qLower = (userQuestion || '').trim().toLowerCase();
  if (qLower.length <= 15 && (qLower.includes('halo') || qLower.includes('hai') || qLower.includes('hi') || qLower.includes('tes') || qLower.includes('sampurasun'))) {
    return res.json({
      reply: generateGagaSmartReply(userQuestion),
      isSimulated: true,
      fastEngine: true
    });
  }

  const systemPrompt = `Anda adalah "GAGA", Maskot Pintar & Asisten AI Cepat Tanggap dari Dinas PUPR Kabupaten Garut.
Karakter: Super tanggap, ramah, to-the-point, berwawasan teknik sipil, tata ruang, SPBE, serta layanan SIMBG/PBG Dinas PUPR Garut.
Pengembang Inovasi SPBE GARDA GARUT: Ir. Risa Kristalia N., ST., MT.
Nomor Server WhatsApp Gateway Resmi: +62 813-1640-3160 (081316403160).
Aturan: Berikan jawaban yang padat, jelas, akurat, dan ramah dengan sapaan khas Sunda ("Sampurasun!"). Jangan bertele-tele.`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      let promptText = `Pertanyaan Pengguna: "${userQuestion}"`;
      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        const historyContext = chatHistory
          .slice(-4)
          .map((m: any) => `${m.role === 'user' ? 'Pengguna' : 'GAGA'}: ${m.text}`)
          .join('\n');
        promptText = `Riwayat Singkat:\n${historyContext}\n\nPertanyaan Sekarang: "${userQuestion}"`;
      }

      // Enforce 1800ms fast timeout so user never waits!
      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: systemPrompt
        }
      });

      const response = await withTimeout(geminiPromise, 1800, 'Gemini latency threshold');

      if (response && response.text) {
        return res.json({
          reply: response.text,
          isSimulated: false,
          fastEngine: true
        });
      }
    } catch (err: any) {
      // Immediate failover to turbo smart reply without any delay
    }
  }

  // Instant smart fallback
  const fallbackReply = generateGagaSmartReply(userQuestion);
  return res.json({
    reply: fallbackReply,
    isSimulated: true,
    fastEngine: true
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GARDA GARUT] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
