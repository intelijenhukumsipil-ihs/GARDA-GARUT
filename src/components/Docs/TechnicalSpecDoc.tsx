import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Layers, 
  Workflow, 
  Layout, 
  Rocket, 
  Printer, 
  Copy, 
  Check
} from 'lucide-react';

export const TechnicalSpecDoc: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'spec' | 'workflow' | 'code' | 'ui' | 'roadmap'>('spec');
  const [copiedCode, setCopiedCode] = useState(false);

  const sampleGatewayCode = `// [GARDA GARUT] Gateway Server Express - Gateway Cerdas SPBE
import express from 'express';

const app = express();
app.use(express.json());

// Endpoint Penerjemah Skema GARDA -> SIMBG v3.0
app.post('/api/gateway/translate-simbg', (req, res) => {
  const { caseData } = req.body;
  
  // Transformasi otomatis tanpa mengubah isi substansi rekomendasi
  const simbgSchema = {
    header: {
      gateway_id: 'GW-GRT-PUPR-001',
      sistem_asal: 'GARDA_BANGUNAN_GARUT',
      target: 'KEMENPUPR_SIMBG_CENTRAL',
      timestamp: new Date().toISOString()
    },
    payload: {
      nomor_registrasi_simbg_v3: caseData.simbgReferenceNo,
      nomor_koordinasi_garda: caseData.id,
      jenis_dokumen: caseData.applicationType,
      pemohon: {
        nama: caseData.applicantName,
        nik: caseData.applicantNik
      },
      rekomendasi_terpadu_opd: caseData.opdAssessments
    }
  };

  res.json({ success: true, simbgSchema });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Gateway Server GARDA GARUT berjalan pada port 3000');
});`;

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(sampleGatewayCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-black tracking-tight uppercase italic text-white">Spesifikasi Teknis & Panduan Pengembangan GARDA GARUT</h1>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl font-medium">
            Dokumen resmi arsitektur sistem, spesifikasi gateway server, alur kerja, kerangka kode, dan rencana tahapan peluncuran resmi PUPR Kab. Garut.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest px-5 py-3 rounded-2xl shadow transition flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak PDF</span>
        </button>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 gap-2 overflow-x-auto shadow-sm">
        {[
          { id: 'spec', label: '1. Spesifikasi Teknis', icon: Layers },
          { id: 'workflow', label: '2. Alur Kerja Modul', icon: Workflow },
          { id: 'code', label: '3. Kerangka Kode', icon: Code },
          { id: 'ui', label: '4. Antarmuka UI', icon: Layout },
          { id: 'roadmap', label: '5. Rencana Peluncuran', icon: Rocket }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-emerald-400 shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: SPESIFIKASI TEKNIS */}
      {activeTab === 'spec' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-xs text-slate-600 leading-relaxed">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider italic">
              1. Spesifikasi Teknis & Identitas Resmi Inovasi
            </h2>
            <p className="text-slate-500 text-[11px] font-medium mt-0.5">
              Identitas Pemilik, Pengembang, dan Aturan Hukum SPBE / Satu Data Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-black tracking-wider block">Nama Aplikasi</span>
              <strong className="text-slate-900 text-sm font-black uppercase">GARDA GARUT</strong>
              <span className="text-emerald-700 block text-[11px] font-bold">Gerbang Administrasi, Rekomendasi, dan Data Terpadu</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-black tracking-wider block">Moto Inovasi</span>
              <strong className="text-amber-800 font-black italic">"Layanan Cerdas, Data Terjaga, Garut Lebih Maju"</strong>
              <span className="text-slate-500 block text-[11px] font-medium">Transformasi Pelayanan Publik Cepat & Transparan</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-black tracking-wider block">Penyelenggara Resmi</span>
              <strong className="text-slate-800 font-bold">Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Kabupaten Garut</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-black tracking-wider block">Pengembang & Pemilik Inovasi</span>
              <strong className="text-slate-900 font-black text-sm block">Ir. Risa Kristalia N., ST., MT.</strong>
              <span className="text-slate-500 block text-[11px] font-medium">Pemilik & Pengembang Utama Inovasi SPBE Kabupaten Garut</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">Aturan Utama Sistem & Batasan Hukum:</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-200 font-medium">
              <li><strong className="text-slate-900">BUKAN PENGGANTI SIMBG:</strong> GARDA GARUT tidak memindahkan atau merampas wewenang penerbitan izin PBG/SLF/SBKBG/RTB. SIMBG KemenPUPR/Kemendagri tetap menjadi satu-satunya sistem legal penerbit izin.</li>
              <li><strong className="text-slate-900">PUSAT KENDALI KOORDINASI:</strong> GARDA GARUT berfungsi menyatukan rekomendasi teknis antar-dinas (PUPR, Perkim, DLH, Satpol PP, Dishub), mengawasi aset infrastruktur, mencatat bukti lapangan, dan mempercepat SLA.</li>
              <li><strong className="text-slate-900">KEPATUHAN SPBE & SATU DATA:</strong> Memenuhi standar interoperabilitas Perda SPBE Kab. Garut, enkripsi TTE BSrE, dan GeoJSON WFS Satu Data Indonesia.</li>
            </ul>
          </div>
        </div>
      )}

      {/* SECTION 2: WORKFLOW */}
      {activeTab === 'workflow' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-xs text-slate-600">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider italic">
              2. Contoh Alur Kerja Setiap Modul
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-black text-slate-900 uppercase">Alur Kerja GARDA INFRA (Aset & Pemeliharaan):</h3>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700 font-medium">
                <li>Aset diinventarisir dan diberi Plat QR Code Fisik unik di lapangan.</li>
                <li>Warga/Petugas memindai QR Code di lokasi aset untuk mengirim laporan kerusakan + foto + koordinat GPS.</li>
                <li>Sistem menghitung <strong className="text-slate-900">Skor Prioritas Otomatis (1-100)</strong> berdasarkan potensi bahaya, dampak populasi, dan status jalur vital.</li>
                <li>Koordinator menerbitkan <strong className="text-slate-900">Surat Perintah Kerja (SPK)</strong> resmi ke Tim Reaksi Cepat Bina Marga/SDA.</li>
                <li>Tim Lapangan mengunggah foto sebelum, saat, dan sesudah pengerjaan sebagai bukti fisik permanen SPBE.</li>
              </ol>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-black text-slate-900 uppercase">Alur Kerja GARDA BANGUNAN (SIMBG & Rekomendasi):</h3>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700 font-medium">
                <li>Pemohon mendaftarkan kasus dengan memasukkan Nomor Registrasi Resmi SIMBG (<code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">SIMBG-PBG-GRT-2026-XXXX</code>).</li>
                <li>Pusat Kendali membagikan tugas penilaian secara <strong className="text-slate-900">paralel & bersamaan</strong> ke OPD terkait (PUPR, DLH, Dishub, Satpol PP) dengan timer SLA berwarna.</li>
                <li>Koreksi teknis dari seluruh OPD disatukan menjadi <strong className="text-slate-900">SATU daftar koreksi terpadu</strong> tanpa instruksi yang bertolak belakang.</li>
                <li>Inspeksi lapangan gabungan dijadwalkan secara cerdas, kemudian hasil rekomendasi terpadu diterbitkan lengkap QR Code & TTE BSrE.</li>
                <li>Gateway Server mengirimkan bukti persetujuan rekomendasi terpadu kembali ke sistem resmi SIMBG.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CODE FRAMEWORK */}
      {activeTab === 'code' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs text-slate-600">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider italic">
              3. Kerangka Kode Dasar (Node.js Express + React TypeScript)
            </h2>
            <button
              onClick={copyCodeToClipboard}
              className="bg-slate-900 hover:bg-slate-800 text-emerald-400 font-black px-4 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer text-xs uppercase tracking-wider shadow-sm"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Tersalin!' : 'Salin Backend'}</span>
            </button>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
            <pre>{sampleGatewayCode}</pre>
          </div>
        </div>
      )}

      {/* SECTION 4: UI SPEC */}
      {activeTab === 'ui' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs text-slate-600">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 italic">
            4. Spesifikasi Rancangan Tampilan Antarmuka
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black text-slate-900 uppercase block">Dasbor Gateway & Peta GIS</span>
              <p className="text-slate-600 font-medium">Header dengan indikator heartbeat online, peta interaktif Garut dengan layer pin aset & heatmap kerusakan, serta sakelar pergantian peran pengguna (Role Switcher).</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black text-slate-900 uppercase block">Formulir Rekomendasi Terpadu</span>
              <p className="text-slate-600 font-medium">Tampilan tabel perbandingan temuan teknis antar-dinas, countdown timer SLA berwarna, dan generator cetak Surat Rekomendasi dilengkapi QR Code terverifikasi.</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-xs text-slate-600">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 italic">
            5. Rencana Tahapan Pengembangan Hingga Peluncuran Resmi
          </h2>

          <div className="space-y-4 relative border-l-2 border-slate-300 pl-6 ml-2">
            
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-white"></span>
              <h3 className="font-black text-slate-900 text-xs uppercase">Tahap 1: Inisiasi, Desain Arsitektur & Sandbox (Bulan 1)</h3>
              <p className="text-slate-500 font-medium">Pengembangan kerangka UI/UX, simulasi Gateway Server, dan penyiapan database awal aset infrastruktur PUPR.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-white"></span>
              <h3 className="font-black text-slate-900 text-xs uppercase">Tahap 2: Integrasi Gateway SIMBG & TTE BSrE (Bulan 2)</h3>
              <p className="text-slate-500 font-medium">Uji coba penerjemah format skema JSON ke SIMBG v3 KemenPUPR dan penguncian enkripsi tanda tangan digital BSrE.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-white"></span>
              <h3 className="font-black text-slate-900 text-xs uppercase">Tahap 3: Pilot Project Tarogong Kidul & Garut Kota (Bulan 3)</h3>
              <p className="text-slate-500 font-medium">Penerapan langsung cetak Plat QR Code Aset di 2 kecamatan percontohan dan uji koordinasi rekomendasi terpadu 4 dinas.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-white"></span>
              <h3 className="font-black text-slate-900 text-xs uppercase">Tahap 4: Pelatihan Operator & Audit Keamanan SPBE (Bulan 4)</h3>
              <p className="text-slate-500 font-medium">Bimbingan teknis untuk Penelaah Dinas dan Tim Lapangan, pengetesan penetrasi keamanan cyber, serta optimasi database.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
              <h3 className="font-black text-emerald-800 text-xs uppercase">Tahap 5: Peluncuran Resmi Pemkab Garut & Rollout 42 Kecamatan (Bulan 5)</h3>
              <p className="text-slate-500 font-medium">Peresmian langsung oleh Bupati Garut & Kepala Dinas PUPR, pengoperasian penuh di seluruh Kabupaten Garut.</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

