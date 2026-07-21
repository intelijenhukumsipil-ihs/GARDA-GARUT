import React, { useState } from 'react';
import { 
  MapPin, 
  HardHat, 
  Building2, 
  Flame, 
  Search, 
  Compass, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Navigation
} from 'lucide-react';
import { InfraAsset, BuildingCase, DamageReport } from '../../types';

interface InteractiveMapProps {
  assets: InfraAsset[];
  buildingCases: BuildingCase[];
  reports: DamageReport[];
}

interface GarutDistrict {
  id: string;
  name: string;
  region: 'Utara' | 'Tengah' | 'Selatan';
  x: number; // percentage on map canvas
  y: number;
  assetsCount: number;
  simbgCount: number;
  supervisor: string;
  phone: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  assets,
  buildingCases,
  reports
}) => {
  const [mapMode, setMapMode] = useState<'administrative' | 'gis' | 'heatmap'>('administrative');
  const [showAssets, setShowAssets] = useState(true);
  const [showCases, setShowCases] = useState(true);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<'Semua' | 'Utara' | 'Tengah' | 'Selatan'>('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedDistrict, setSelectedDistrict] = useState<GarutDistrict | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<InfraAsset | null>(assets[0] || null);

  // 42 Kecamatan di Kabupaten Garut berdasarkan Peta Wilayah Administratif BAPPEDA Kab. Garut
  const garutDistricts: GarutDistrict[] = [
    // Garut Utara
    { id: 'KEC-01', name: 'Balubur Limbangan', region: 'Utara', x: 72, y: 14, assetsCount: 4, simbgCount: 3, supervisor: 'Ahmad Sofyan, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-02', name: 'Selaawi', region: 'Utara', x: 80, y: 16, assetsCount: 3, simbgCount: 2, supervisor: 'Ahmad Sofyan, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-03', name: 'Malangbong', region: 'Utara', x: 90, y: 20, assetsCount: 5, simbgCount: 4, supervisor: 'Dedi Kurnia, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-04', name: 'Leles', region: 'Utara', x: 60, y: 28, assetsCount: 6, simbgCount: 5, supervisor: 'Heri Susanto, MT', phone: '+62 813-1640-3160' },
    { id: 'KEC-05', name: 'Kadungora', region: 'Utara', x: 66, y: 23, assetsCount: 5, simbgCount: 4, supervisor: 'Heri Susanto, MT', phone: '+62 813-1640-3160' },
    { id: 'KEC-06', name: 'Kersamanah', region: 'Utara', x: 82, y: 22, assetsCount: 2, simbgCount: 2, supervisor: 'Ahmad Sofyan, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-07', name: 'Leuwigoong', region: 'Utara', x: 74, y: 26, assetsCount: 4, simbgCount: 3, supervisor: 'Ahmad Sofyan, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-08', name: 'Cibatu', region: 'Utara', x: 80, y: 28, assetsCount: 5, simbgCount: 4, supervisor: 'Dedi Kurnia, ST', phone: '+62 813-1640-3160' },

    // Garut Tengah / Metropolitan
    { id: 'KEC-09', name: 'Garut Kota', region: 'Tengah', x: 73, y: 44, assetsCount: 12, simbgCount: 15, supervisor: 'Ir. Hendra Wijaya, MT', phone: '+62 813-1640-3160' },
    { id: 'KEC-10', name: 'Tarogong Kaler', region: 'Tengah', x: 63, y: 35, assetsCount: 9, simbgCount: 11, supervisor: 'Ir. Hendra Wijaya, MT', phone: '+62 813-1640-3160' },
    { id: 'KEC-11', name: 'Tarogong Kidul', region: 'Tengah', x: 66, y: 40, assetsCount: 14, simbgCount: 18, supervisor: 'Ir. Hendra Wijaya, MT', phone: '+62 813-1640-3160' },
    { id: 'KEC-12', name: 'Banyuresmi', region: 'Tengah', x: 72, y: 35, assetsCount: 7, simbgCount: 6, supervisor: 'Yudi Rahadian, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-13', name: 'Karangpawitan', region: 'Tengah', x: 74, y: 40, assetsCount: 8, simbgCount: 9, supervisor: 'Yudi Rahadian, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-14', name: 'Sukawening', region: 'Tengah', x: 82, y: 32, assetsCount: 4, simbgCount: 3, supervisor: 'Dedi Kurnia, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-15', name: 'Karangtengah', region: 'Tengah', x: 88, y: 34, assetsCount: 3, simbgCount: 2, supervisor: 'Dedi Kurnia, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-16', name: 'Pangatikan', region: 'Tengah', x: 83, y: 37, assetsCount: 3, simbgCount: 2, supervisor: 'Yudi Rahadian, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-17', name: 'Wanaraja', region: 'Tengah', x: 82, y: 40, assetsCount: 5, simbgCount: 4, supervisor: 'Yudi Rahadian, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-18', name: 'Sucinaraja', region: 'Tengah', x: 82, y: 43, assetsCount: 3, simbgCount: 2, supervisor: 'Yudi Rahadian, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-19', name: 'Samarang', region: 'Tengah', x: 52, y: 35, assetsCount: 6, simbgCount: 5, supervisor: 'Budi Santoso, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-20', name: 'Pasirwangi', region: 'Tengah', x: 50, y: 39, assetsCount: 5, simbgCount: 3, supervisor: 'Budi Santoso, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-21', name: 'Sukaresmi', region: 'Tengah', x: 48, y: 43, assetsCount: 4, simbgCount: 2, supervisor: 'Budi Santoso, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-22', name: 'Bayongbong', region: 'Tengah', x: 58, y: 46, assetsCount: 7, simbgCount: 6, supervisor: 'Budi Santoso, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-23', name: 'Cisurupan', region: 'Tengah', x: 52, y: 48, assetsCount: 6, simbgCount: 4, supervisor: 'Budi Santoso, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-24', name: 'Cigedug', region: 'Tengah', x: 57, y: 52, assetsCount: 3, simbgCount: 2, supervisor: 'Budi Santoso, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-25', name: 'Cilawu', region: 'Tengah', x: 66, y: 49, assetsCount: 8, simbgCount: 7, supervisor: 'Ir. Hendra Wijaya, MT', phone: '+62 813-1640-3160' },

    // Garut Selatan
    { id: 'KEC-26', name: 'Talegong', region: 'Selatan', x: 20, y: 46, assetsCount: 4, simbgCount: 2, supervisor: 'Rahmat Hidayat, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-27', name: 'Cisewu', region: 'Selatan', x: 20, y: 56, assetsCount: 5, simbgCount: 3, supervisor: 'Rahmat Hidayat, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-28', name: 'Caringin', region: 'Selatan', x: 14, y: 66, assetsCount: 4, simbgCount: 2, supervisor: 'Rahmat Hidayat, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-29', name: 'Pamulihan', region: 'Selatan', x: 40, y: 54, assetsCount: 3, simbgCount: 2, supervisor: 'Agus Setiawan, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-30', name: 'Bungbulang', region: 'Selatan', x: 28, y: 65, assetsCount: 7, simbgCount: 5, supervisor: 'Agus Setiawan, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-31', name: 'Mekarmukti', region: 'Selatan', x: 23, y: 74, assetsCount: 3, simbgCount: 1, supervisor: 'Agus Setiawan, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-32', name: 'Pakejeng', region: 'Selatan', x: 37, y: 67, assetsCount: 4, simbgCount: 2, supervisor: 'Agus Setiawan, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-33', name: 'Cikajang', region: 'Selatan', x: 53, y: 58, assetsCount: 8, simbgCount: 6, supervisor: 'Taufik Hidayat, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-34', name: 'Banjarwangi', region: 'Selatan', x: 63, y: 59, assetsCount: 5, simbgCount: 3, supervisor: 'Taufik Hidayat, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-35', name: 'Singajaya', region: 'Selatan', x: 68, y: 68, assetsCount: 4, simbgCount: 2, supervisor: 'Taufik Hidayat, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-36', name: 'Peundeuy', region: 'Selatan', x: 68, y: 75, assetsCount: 3, simbgCount: 1, supervisor: 'Taufik Hidayat, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-37', name: 'Cihurip', region: 'Selatan', x: 60, y: 70, assetsCount: 3, simbgCount: 1, supervisor: 'Taufik Hidayat, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-38', name: 'Cisompet', region: 'Selatan', x: 55, y: 77, assetsCount: 5, simbgCount: 3, supervisor: 'Iman Supriadi, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-39', name: 'Cikelet', region: 'Selatan', x: 39, y: 77, assetsCount: 5, simbgCount: 3, supervisor: 'Iman Supriadi, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-40', name: 'Pameungpeuk', region: 'Selatan', x: 44, y: 85, assetsCount: 9, simbgCount: 8, supervisor: 'Iman Supriadi, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-41', name: 'Cibalong', region: 'Selatan', x: 60, y: 88, assetsCount: 6, simbgCount: 4, supervisor: 'Iman Supriadi, ST', phone: '+62 813-1640-3160' },
    { id: 'KEC-42', name: 'Kadungora (Perbatasan)', region: 'Utara', x: 65, y: 19, assetsCount: 3, simbgCount: 2, supervisor: 'Heri Susanto, MT', phone: '+62 813-1640-3160' }
  ];

  // Filtered districts list
  const filteredDistricts = garutDistricts.filter(d => {
    const matchesRegion = selectedRegionFilter === 'Semua' || d.region === selectedRegionFilter;
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 lg:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
            <h1 className="text-base sm:text-xl font-black tracking-tight uppercase italic text-white">
              Peta Wilayah Administratif & GIS Kabupaten Garut
            </h1>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              42 Kecamatan
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl font-medium">
            Pemetaan Geospasial Resmi BAPPEDA & Dinas PUPR Kabupaten Garut. Menampilkan 42 Wilayah Kecamatan, Jaringan Jalan Provinsi, Rel Kereta Api, Aset PUPR, dan Sebaran Kasus SIMBG.
          </p>
        </div>

        {/* View Mode Switcher - Mobile Scrollable */}
        <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/15 shrink-0 gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setMapMode('administrative')}
            className={`text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 shrink-0 ${
              mapMode === 'administrative' ? 'bg-emerald-400 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Peta 42 Kecamatan</span>
          </button>

          <button
            onClick={() => setMapMode('gis')}
            className={`text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 shrink-0 ${
              mapMode === 'gis' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>GIS Plotter</span>
          </button>

          <button
            onClick={() => setMapMode('heatmap')}
            className={`text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 shrink-0 ${
              mapMode === 'heatmap' ? 'bg-red-500 text-white shadow animate-pulse' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Heatmap Kerusakan</span>
          </button>
        </div>
      </div>

      {/* Main Map Container & Right Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Canvas Frame */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-3 sm:p-5 relative min-h-[480px] sm:min-h-[580px] flex flex-col justify-between shadow-2xl overflow-hidden">
          
          {/* Top Canvas Bar & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10 bg-slate-900/90 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            <div className="space-y-0.5">
              <span className="font-black text-emerald-400 text-xs uppercase tracking-widest block flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>PETA WILAYAH ADMINISTRATIF GARUT</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">BAPPEDA & PUPR Garut • WGS 84</span>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 text-[10px] font-black uppercase overflow-x-auto">
              {(['Semua', 'Utara', 'Tengah', 'Selatan'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRegionFilter(r)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer shrink-0 ${
                    selectedRegionFilter === r ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* SVG & Vector Canvas Base representing Garut Administrative Map */}
          <div className="relative w-full h-[380px] sm:h-[480px] my-3 bg-[#0a121d] rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
            
            {/* Top Regional Borders Labels */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-black font-serif italic text-emerald-300/60 uppercase tracking-widest pointer-events-none z-10">
              KAB. SUMEDANG (UTARA)
            </div>
            <div className="absolute top-1/3 left-2 text-[10px] font-black font-serif italic text-emerald-300/60 uppercase tracking-widest pointer-events-none z-10 -rotate-90">
              KAB. BANDUNG & CIANJUR (BARAT)
            </div>
            <div className="absolute top-1/3 right-2 text-[10px] font-black font-serif italic text-emerald-300/60 uppercase tracking-widest pointer-events-none z-10 rotate-90">
              KAB. TASIKMALAYA (TIMUR)
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-black font-serif italic text-cyan-300/80 uppercase tracking-widest pointer-events-none z-10">
              🌊 SAMUDERA INDONESIA (Pesisir Pantai Selatan Garut)
            </div>

            {/* Grid & Map Texture Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-20"></div>

            {/* SVG Roads & Rivers Representation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Batas Kabupaten (Red dash-dot border line) */}
              <path d="M 120,40 Q 300,20 400,60 T 480,180 T 360,340 T 260,430 T 100,320 Z" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
              
              {/* Jalan Provinsi (Green lines) */}
              <path d="M 350,50 L 320,120 L 330,200 L 260,280 L 220,380 L 210,420" fill="none" stroke="#10b981" strokeWidth="3.5" opacity="0.8" />
              <path d="M 100,310 L 220,380 L 300,420" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.8" />

              {/* Rel Kereta Api (Dashed railway line) */}
              <path d="M 300,80 L 360,110 L 380,140 L 370,210" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" opacity="0.9" />

              {/* Sungai (Blue rivers) */}
              <path d="M 320,50 Q 280,180 240,260 T 210,430" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
              <path d="M 120,300 Q 180,330 220,420" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />
            </svg>

            {/* Heatmap Layer Overlay */}
            {mapMode === 'heatmap' && (
              <>
                <div className="absolute left-[50%] top-[40%] w-48 h-48 bg-red-500/35 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute left-[30%] top-[65%] w-36 h-36 bg-amber-500/30 rounded-full blur-2xl"></div>
                <div className="absolute left-[65%] top-[25%] w-32 h-32 bg-red-500/25 rounded-full blur-2xl"></div>
              </>
            )}

            {/* Render 42 Kecamatan Markers */}
            {filteredDistricts.map((dist) => {
              const isSelected = selectedDistrict?.id === dist.id;

              return (
                <button
                  key={dist.id}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer z-10 group ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                  style={{ left: `${dist.x}%`, top: `${dist.y}%` }}
                >
                  <div className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-md flex items-center space-x-1 ${
                    isSelected 
                      ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/30 font-black'
                      : dist.region === 'Utara'
                        ? 'bg-slate-900/90 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                        : dist.region === 'Tengah'
                          ? 'bg-slate-900/90 text-amber-300 border-amber-500/40 hover:bg-amber-900'
                          : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      dist.region === 'Utara' ? 'bg-emerald-400' : dist.region === 'Tengah' ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}></span>
                    <span>{dist.name}</span>
                  </div>
                </button>
              );
            })}

            {/* Render Infrastructure Assets Pins (GIS Mode) */}
            {(mapMode === 'gis' || showAssets) && assets.map((a, idx) => {
              const left = 20 + (idx * 9) % 65;
              const top = 25 + (idx * 11) % 55;

              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAsset(a)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  title={`Aset PUPR: ${a.name} (${a.condition})`}
                >
                  <div className={`p-1.5 rounded-full border shadow-lg ${
                    a.condition === 'baik' ? 'bg-emerald-500 text-slate-950 border-emerald-300' :
                    a.condition === 'rusak_ringan' ? 'bg-blue-500 text-white border-blue-300' :
                    'bg-red-500 text-white border-red-300 animate-bounce'
                  }`}>
                    <HardHat className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}

            {/* Render SIMBG Cases Pins (GIS Mode) */}
            {(mapMode === 'gis' || showCases) && buildingCases.map((c, idx) => {
              const left = 35 + (idx * 12) % 50;
              const top = 30 + (idx * 8) % 45;

              return (
                <div
                  key={c.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  title={`SIMBG: ${c.buildingName}`}
                >
                  <div className="p-1.5 rounded-full bg-blue-600 text-white border border-blue-300 shadow-md">
                    <Building2 className="w-3 h-3" />
                  </div>
                </div>
              );
            })}

          </div>

          {/* Bottom Map Legend Bar */}
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-300 backdrop-blur">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-black uppercase text-amber-400">LEGENDA PETA:</span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block"></span>
                <span>Jalan Provinsi</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-0.5 bg-amber-400 border-b border-dashed border-black inline-block"></span>
                <span>Rel Kereta Api</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-0.5 bg-sky-400 inline-block"></span>
                <span>Sungai Utama</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-0.5 bg-red-500 border-b border-dashed border-slate-900 inline-block"></span>
                <span>Batas Kabupaten</span>
              </span>
            </div>

            <div className="text-[10px] text-emerald-400 font-mono font-bold">
              Koor. Pusat Garut Kota: -7.2147°, 107.9036°
            </div>
          </div>

        </div>

        {/* Right Information & Selected District / Asset Panel */}
        <div className="space-y-6">
          
          {/* Search Box */}
          <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
              Cari 42 Kecamatan di Kabupaten Garut
            </span>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Ketik nama kecamatan (Limbangan, Pameungpeuk, Leles...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          {/* District Dossier Box */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Berkas Wilayah Kecamatan</span>
              </h2>
              {selectedDistrict && (
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {selectedDistrict.region}
                </span>
              )}
            </div>

            {selectedDistrict ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-emerald-600 font-black block">{selectedDistrict.id}</span>
                  <h3 className="text-lg font-black text-slate-900 uppercase italic">Kecamatan {selectedDistrict.name}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Kabupaten Garut, Jawa Barat</p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Aset Infrastruktur PUPR</span>
                    <span className="text-slate-900 font-black text-sm">{selectedDistrict.assetsCount} Lokasi</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Permohonan SIMBG</span>
                    <span className="text-emerald-700 font-black text-sm">{selectedDistrict.simbgCount} Kasus</span>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-emerald-900 font-black text-[10px] uppercase tracking-wider block">Pengawas Lapangan PUPR Wilayah:</span>
                  <div className="text-slate-900 font-black">{selectedDistrict.supervisor}</div>
                  <div className="text-emerald-700 font-mono text-[11px] font-bold">{selectedDistrict.phone}</div>
                </div>

                <div className="pt-1">
                  <a
                    href={`https://wa.me/6281316403160?text=${encodeURIComponent(`Halo Pengawas PUPR Kecamatan ${selectedDistrict.name}, mohon koordinasi data lapangan aset dan SIMBG.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 font-black text-xs uppercase tracking-wider py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Hubungi Pengawas via WA Server (+62 813-1640-3160)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-bold uppercase">
                  Klik salah satu nama kecamatan pada peta untuk membuka rincian wilayah
                </p>
              </div>
            )}
          </div>

          {/* Selected Asset GIS Box */}
          {selectedAsset && (
            <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-3 text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-amber-400 font-black uppercase tracking-wider text-[10px]">Aset Terpilih di Peta:</span>
                <span className="font-mono text-[10px] text-emerald-400">{selectedAsset.id}</span>
              </div>
              <h3 className="font-black text-sm uppercase italic text-slate-100">{selectedAsset.name}</h3>
              <p className="text-slate-300 text-[11px]">{selectedAsset.locationAddress} (Kec. {selectedAsset.district})</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[10px] text-slate-300">
                <div>Koordinat GIS: {selectedAsset.latitude}, {selectedAsset.longitude}</div>
                <div>Kondisi: {selectedAsset.condition.toUpperCase()}</div>
                <div>Pengelola: {selectedAsset.managingAgency}</div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
