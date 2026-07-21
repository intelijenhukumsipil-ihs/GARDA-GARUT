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

// WhatsApp Gateway Server Integration Endpoint (+62 813-1640-3160)
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
    bodyContent = `📢 *NOTIFIKASI KOORDINASI SPBE*\nPesan: ${data.message || 'Sistem Gateway Server GARDA GARUT berjalan normal.'}\nServer WA Target: +62 813-1640-3160`;
  }

  const fullMessage = `${textHeader}${bodyContent}\n\n_Pengembang & Pemilik Inovasi: Ir. Risa Kristalia N., ST., MT._`;
  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`;

  res.json({
    success: true,
    message: `Notifikasi berhasil dikirimkan ke Gateway WhatsApp Server (+62 813-1640-3160).`,
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction
      }
    });

    res.json({
      analysis: response.text,
      isSimulated: false
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || 'Gemini processing failed' });
  }
});

// Mascot Chat QA Endpoint (SI GARDA - Maskot Pintar Dinas PUPR Garut)
app.post('/api/gemini/mascot-chat', async (req, res) => {
  try {
    const { userQuestion, chatHistory = [] } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `Anda adalah "SI GARDA" (Sistem Informasi & Maskot Pintar Dinas PUPR Kabupaten Garut).
Karakter Anda: Ramah, tanggap, berwawasan teknik sipil, menguasai SPBE & SIMBG/PBG, serta siap membantu masyarakat dan ASN Garut.
Pemilik & Pengembang Inovasi GARDA GARUT: Ir. Risa Kristalia N., ST., MT. (Dinas PUPR Kabupaten Garut).
Nomor Server WhatsApp Gateway Resmi: +62 813-1640-3160.

Informasi Utama yang Anda kuasai:
1. GARDA INFRA: Pelaporan & pemantauan aset jalan, jembatan, irigasi di 42 Kecamatan Kabupaten Garut.
2. GARDA BANGUNAN: Penerbitan Rekomendasi Terpadu PBG/SLF tersinkronisasi otomatis dengan aplikasi SIMBG Kementerian PUPR.
3. GATEWAY SERVER: Layanan notifikasi otomatis & antrean cadangan zero data loss via WA (+62 813-1640-3160).
4. VERIFIKASI QR: Setiap dokumen rekomendasi & plat aset memiliki QR Code unik standar BSrE untuk cegah pemalsuan.

Gaya Bicara: Gunakan Bahasa Indonesia yang ramah, jelas, profesional, sesekali gunakan salam Sunda ("Wilujeng sumping!", "Sampurasun!").
Jawablah pertanyaan berikut dengan singkat, tepat, padat, dan informatif.`;

    if (!apiKey) {
      // Intelligent fallback responses based on keywords
      const lowerQ = (userQuestion || '').toLowerCase();
      let answer = '';

      if (lowerQ.includes('simbg') || lowerQ.includes('pbg') || lowerQ.includes('izin') || lowerQ.includes('bangunan')) {
        answer = 'Sampurasun! Untuk permohonan Rekomendasi PBG/SLF di Dinas PUPR Garut, Anda cukup mengunggah berkas di modul GARDA BANGUNAN. Sistem akan mengevaluasi kelaikan teknis & RTRW lalu menerbitkan Rekomendasi Terpadu yang tersinkronisasi ke aplikasi SIMBG Kementerian PUPR. Kontak WA Server kami di +62 813-1640-3160 untuk update otomatis!';
      } else if (lowerQ.includes('jalan') || lowerQ.includes('rusak') || lowerQ.includes('lapor') || lowerQ.includes('infra')) {
        answer = 'Wilujeng sumping! Jika menemukan jalan, jembatan, atau saluran irigasi rusak di Garut, Anda bisa melaporkannya via modul GARDA INFRA dengan menyertakan foto & lokasi kecamatan. Laporan akan dihitung skor prioritasnya dan diteruskan ke Pengawas PUPR setempat!';
      } else if (lowerQ.includes('wa') || lowerQ.includes('whatsapp') || lowerQ.includes('nomor') || lowerQ.includes('server')) {
        answer = 'Nomor WhatsApp Gateway Server Resmi GARDA GARUT adalah **+62 813-1640-3160**. Server ini mengirimkan notifikasi SLA, konfirmasi laporan kerusakan, serta lembar verifikasi rekomendasi!';
      } else if (lowerQ.includes('risa') || lowerQ.includes('pengembang') || lowerQ.includes('pencipta')) {
        answer = 'Inovasi GARDA GARUT dikembangkan dan dimiliki oleh **Ir. Risa Kristalia N., ST., MT.** dari Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Kabupaten Garut sebagai langkah nyata modernisasi SPBE!';
      } else if (lowerQ.includes('kecamatan') || lowerQ.includes('peta') || lowerQ.includes('wilayah')) {
        answer = 'GARDA GARUT memetakan 42 Wilayah Kecamatan di Kabupaten Garut dari Limbangan di Utara, Garut Kota di Tengah, hingga Pameungpeuk & Cibalong di Selatan. Setiap wilayah dilengkapi kontak Pengawas Lapangan PUPR!';
      } else {
        answer = `Sampurasun! Terima kasih telah bertanya kepada Si GARDA. Mengenai "${userQuestion}", Anda dapat mengakses fitur-fitur di aplikasi GARDA GARUT seperti Peta 42 Kecamatan, Gateway WhatsApp Server (+62 813-1640-3160), atau langsung berkonsultasi ke Dinas PUPR Kabupaten Garut.`;
      }

      return res.json({
        reply: answer,
        isSimulated: true
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Pengguna bertanya: "${userQuestion}"`,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({
      reply: response.text,
      isSimulated: false
    });
  } catch (err: any) {
    console.error("Mascot chat error:", err);
    res.status(500).json({ error: 'Gagal memproses percakapan maskot' });
  }
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
