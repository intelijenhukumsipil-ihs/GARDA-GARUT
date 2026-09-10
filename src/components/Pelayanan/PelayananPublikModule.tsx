import React, { useState } from 'react';
import { 
  FileText, 
  ExternalLink, 
  FolderOpen, 
  Search, 
  Building2, 
  Compass, 
  Droplets, 
  Navigation, 
  ShieldCheck, 
  Layout, 
  Award, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

export interface PublicServiceItem {
  id: string;
  code: string;
  title: string;
  fullName: string;
  description: string;
  category: 'Tata Ruang' | 'Sumber Daya Air' | 'Bina Marga' | 'Bangunan Gedung';
  driveLink: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  requirements: string[];
}

export const PUBLIC_SERVICES_DATA: PublicServiceItem[] = [
  {
    id: 'krk',
    code: '01',
    title: 'KRK',
    fullName: 'KETERANGAN RENCANA KABUPATEN ATAU KOTA UNTUK RENCANA PEMANFAATAN RUANG',
    description: 'Surat Keterangan Rencana Kabupaten/Kota yang memuat informasi peruntukan tata ruang, KDB, KLB, GSB, dan arahan zonasi lahan rencana pembangunan di wilayah Kabupaten Garut.',
    category: 'Tata Ruang',
    driveLink: 'https://drive.google.com/drive/folders/19sY4lqJlQmGrNZaQVx37S6FSD2oXsDiw?usp=sharing',
    icon: Compass,
    color: 'from-blue-600 to-indigo-700',
    badge: 'TATA RUANG',
    requirements: ['Peta Lokasi & Koordinat GPS', 'KTP Pemohon / Akta Perusahaan', 'Bukti Kepemilikan Lahan (SHM/HGB)']
  },
  {
    id: 'pkkpr',
    code: '02',
    title: 'PKKPR',
    fullName: 'PERSETUJUAN KESESUAIAN KEGIATAN PEMANFAATAN RUANG UNTUK KEGIATAN USAHA',
    description: 'Persetujuan resmi yang menyatakan kesesuaian antara rencana kegiatan pemanfaatan ruang usaha dengan RTRW Kabupaten Garut.',
    category: 'Tata Ruang',
    driveLink: 'https://drive.google.com/drive/folders/1uIVYiumrZDVXEl2UfvlUSnKpOGCqxcsk?usp=sharing',
    icon: Building2,
    color: 'from-sky-600 to-blue-700',
    badge: 'PERIZINAN USAHA',
    requirements: ['NIB OSS RBA', 'Rencana Detail Kegiatan Usaha', 'Masterplan Lahan & Siteplan Awal']
  },
  {
    id: 'feil_banjir',
    code: '03',
    title: 'REKOMENDASI TEKNIS FEIL BANJIR',
    fullName: 'REKOMENDASI PENENTUAN ELEVASI BANGUNAN UNTUK MENGURANGI RESIKO BANJIR',
    description: 'Rekomendasi teknis penetapan peil/elevasi elevasi muka tanah & lantai bangunan untuk meminimalisir risiko genangan air dan banjir.',
    category: 'Sumber Daya Air',
    driveLink: 'https://drive.google.com/drive/folders/1kWOJXk7FJx7uoEX65KLnHaqX3RcRn0c-?usp=sharing',
    icon: Droplets,
    color: 'from-cyan-600 to-teal-700',
    badge: 'CEGAH BANJIR',
    requirements: ['Gambar Potongan Memanjang & Melintang', 'Data Topografi Lahan', 'Desain Drainase Kawasan']
  },
  {
    id: 'irigasi_teknis',
    code: '04',
    title: 'REKOMENDASI IRIGASI TEKNIS',
    fullName: 'PERIJINAN PEMANFAATAN JARINGAN IRIGASI TEKNIS',
    description: 'Izin dan rekomendasi teknis untuk pengambilan, penyaluran, atau pemanfaatan air pada jaringan irigasi kewenangan Dinas PUPR Garut.',
    category: 'Sumber Daya Air',
    driveLink: 'https://drive.google.com/drive/folders/1QWAdg7EV9NtLNtebfxnU09BGvQNoMNro?usp=sharing',
    icon: Droplets,
    color: 'from-teal-600 to-emerald-700',
    badge: 'SDA & IRIGASI',
    requirements: ['Skema Jaringan Air / Bangunan Intake', 'Perhitungan Kebutuhan Debit Air', 'Rencana Pengolahan Limbah']
  },
  {
    id: 'rumija',
    code: '05',
    title: 'RUMIJA',
    fullName: 'REKOMENDASI TEKNIS PEMANFAATAN RUANG MILIK JALAN',
    description: 'Izin dan rekomendasi teknis pemanfaatan ruang sempadan/ruang milik jalan kabupaten untuk jembatan/akses jalan masuk, papan reklame, utilitas kabel/pipa, dll.',
    category: 'Bina Marga',
    driveLink: 'https://drive.google.com/drive/folders/1vgk9W1ZMuhEBmu3prI6rozoe7GYpCGqv?usp=sharing',
    icon: Navigation,
    color: 'from-amber-600 to-orange-700',
    badge: 'BINA MARGA',
    requirements: ['Desain Konstruksi Akses / Reklame', 'Analisis Dampak Lalu Lintas (Andalalin)', 'Foto Kondisi Jalan']
  },
  {
    id: 'siteplan',
    code: '06',
    title: 'PENGESAHAN SITEPLAN',
    fullName: 'PENGESAHAN TATA LETAK DAN PERENCANAAN LAHAN SESUAI KETENTUAN TEKNIS',
    description: 'Verifikasi dan pengesahan rencana tapak/siteplan perumahan, kawasan komersial, atau industri sesuai standar teknis PUPR & Tata Ruang.',
    category: 'Tata Ruang',
    driveLink: 'https://drive.google.com/drive/folders/1XOQ4pHFvXAj6ueHI4fsWauf3x6rXca9L?usp=sharing',
    icon: Layout,
    color: 'from-indigo-600 to-purple-700',
    badge: 'SITEPLAN',
    requirements: ['Gambar Rencana Tapak (DWG & PDF)', 'Dokumen KRK Valid', 'Ruang Terbuka Hijau (RTH) 20%']
  },
  {
    id: 'pbg',
    code: '07',
    title: 'PBG',
    fullName: 'PERSETUJUAN BANGUNAN GEDUNG SESUAI STANDAR TEKNIS DAN KESELAMATAN',
    description: 'Persetujuan resmi yang diberikan kepada pemilik bangunan gedung untuk membangun baru, mengubah, memperluas, merawat, atau membongkar bangunan gedung sesuai standar teknis.',
    category: 'Bangunan Gedung',
    driveLink: 'https://drive.google.com/drive/folders/1FZfe0KjjgxesijC7rs3kNYc2nh1c5nzB?usp=sharing',
    icon: ShieldCheck,
    color: 'from-emerald-600 to-green-700',
    badge: 'SIMBG KEMENTERIAN',
    requirements: ['Dokumen Arsitektur & Struktur', 'Perhitungan Konstruksi DED', 'Pendaftaran SIMBG KemenPUPR']
  },
  {
    id: 'slf',
    code: '08',
    title: 'SLF',
    fullName: 'PENERBITAN SERTIFIKAT LAIK FUNGSI BANGUNAN GEDUNG',
    description: 'Sertifikat yang diterbitkan oleh Pemerintah Daerah untuk menyatakan kelaikan fungsi bangunan gedung sebelum dimanfaatkan secara aman dan teruji.',
    category: 'Bangunan Gedung',
    driveLink: 'https://drive.google.com/drive/folders/1zK9s_47mFqbApUPCmWfrMT0QmKLYqRTJ?usp=sharing',
    icon: Award,
    color: 'from-purple-600 to-pink-700',
    badge: 'KREDIATASI LAIK',
    requirements: ['As-Built Drawing Bangunan', 'Laporan Pengujian Kelayakan Struktur/MEP', 'Berita Acara Inspeksi Lapangan']
  }
];

export const PelayananPublikModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Tata Ruang', 'Sumber Daya Air', 'Bina Marga', 'Bangunan Gedung'];

  const filteredServices = PUBLIC_SERVICES_DATA.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = selectedCategory === 'Semua' || item.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portal Resmi Informasi & Template Persyaratan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              PELAYANAN PUBLIK PUPR GARUT
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Akses cepat berkas persyaratan, panduan teknis, contoh formulir, dan tautan Google Drive resmi untuk 8 jenis perizinan & rekomendasi teknis Dinas PUPR Kabupaten Garut.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl flex items-center space-x-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg">
                8
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Layanan Terpadu</div>
              <div className="text-sm font-black text-white">Lengkap dengan Drive Folder</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari layanan (e.g. KRK, PBG, SLF, Siteplan)..."
              className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
        {filteredServices.map((service) => {
          const IconComponent = service.icon;

          return (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow">
                      {service.code}
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 tracking-wider">
                      {service.badge}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    {service.category}
                  </span>
                </div>

                {/* Title & Full Name */}
                <div className="flex items-start space-x-3.5 mb-3">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-md shrink-0`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition">
                      {service.title}
                    </h3>
                    <div className="text-xs font-extrabold text-slate-600 leading-snug uppercase tracking-wide">
                      {service.fullName}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {service.description}
                </p>

                {/* Sample Requirements List */}
                <div className="mb-5">
                  <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Persyaratan Umum Berkas:</span>
                  </div>
                  <ul className="space-y-1.5">
                    {service.requirements.map((req, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button: Open Drive Link */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={service.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2.5 px-5 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition duration-200 shadow-md group-hover:shadow-lg"
                >
                  <FolderOpen className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                  <span>Buka Folder Google Drive ({service.title})</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Layanan Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">Coba kata kunci pencarian lain atau pilih kategori "Semua".</p>
        </div>
      )}

      {/* Info Notice Box */}
      <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white shrink-0 mt-0.5 sm:mt-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
              Butuh Penjelasan & Konsultasi Langsung?
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              Tanyakan langsung kepada <strong>Maskot GAGA AI PUPR Garut</strong> via tombol floating melayang atau hubungi WhatsApp Server Gateway PUPR di <strong>+62 813-1640-3160</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-gaga-mascot'))}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition shadow-sm cursor-pointer"
        >
          Tanya Maskot GAGA AI
        </button>
      </div>

    </div>
  );
};
