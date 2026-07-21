import React from 'react';
import { 
  ShieldCheck, 
  HardHat, 
  Building2, 
  Server, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  Zap
} from 'lucide-react';
import { 
  InfraAsset, 
  DamageReport, 
  WorkOrder, 
  BuildingCase, 
  GatewayEndpointStatus, 
  UserProfile 
} from '../../types';
import { TabType } from '../Sidebar';

interface OverviewDashboardProps {
  currentUser: UserProfile;
  assets: InfraAsset[];
  reports: DamageReport[];
  workOrders: WorkOrder[];
  buildingCases: BuildingCase[];
  endpoints: GatewayEndpointStatus[];
  setActiveTab: (tab: TabType) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  currentUser,
  assets,
  reports,
  workOrders,
  buildingCases,
  endpoints,
  setActiveTab
}) => {
  const damagedAssetsCount = assets.filter(a => a.condition !== 'baik').length;
  const activeSpkCount = workOrders.filter(w => w.status === 'dalam_pengerjaan' || w.status === 'diterbitkan').length;
  const activeSimbgCases = buildingCases.filter(c => c.status !== 'sinkron_simbg').length;

  return (
    <div className="space-y-6">
      
      {/* Banner Welcome */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pusat Kendali Koordinasi Terpadu PUPR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase italic">
              Layanan Cerdas, Data Terjaga, Garut Lebih Maju
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Selamat datang, <strong>{currentUser.name}</strong> ({currentUser.agency}). GARDA GARUT menyatukan rekomendasi teknis antar-dinas, memantau aset daerah, dan mempercepat perizinan tanpa menggantikan wewenang SIMBG.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('infra')}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-widest px-5 py-3 rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              Kelola GARDA INFRA
            </button>
            <button
              onClick={() => setActiveTab('bangunan')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-2xl border border-slate-700 transition-all cursor-pointer"
            >
              Koordinasi SIMBG
            </button>
          </div>
        </div>

        {/* Decorative Grid Accent */}
        <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl text-emerald-400 pointer-events-none select-none">
          GG
        </div>
      </div>

      {/* Mandatory Regulatory Safeguard Notice */}
      <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl flex items-start space-x-3 text-xs text-amber-900 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="font-semibold">
          <span className="font-black text-amber-950 uppercase tracking-wider block mb-0.5">
            Aturan Utama SPBE & Legalitas SIMBG:
          </span>
          GARDA GARUT <strong>BUKAN PENGGANTI SISTEM RESMI SIMBG</strong>. SIMBG (KemenPUPR/Kemendagri) tetap satu-satunya sistem yang menerbitkan izin PBG/SLF/SBKBG/RTB secara sah. GARDA GARUT berfungsi sebagai pusat koordinasi, pemantau aset, dan pencatat bukti lapangan.
        </div>
      </div>

      {/* Core Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Aset (INFRA)</div>
          <div className="text-4xl font-black text-slate-800 my-2">{assets.length}</div>
          <div className="text-amber-600 text-xs font-bold">{damagedAssetsCount} Aset Perlu Maintenance</div>
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-800 select-none">A</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Kasus PBG Aktif</div>
          <div className="text-4xl font-black text-slate-800 my-2">{activeSimbgCases}</div>
          <div className="text-emerald-600 text-xs font-bold">Paralel Rekomendasi Terpadu</div>
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-800 select-none">B</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">SPK Pemeliharaan</div>
          <div className="text-4xl font-black text-slate-800 my-2">{activeSpkCount}</div>
          <div className="text-emerald-600 text-xs font-bold">Tim Reaksi Cepat Lapangan</div>
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-800 select-none">S</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Gateway Cerdas</div>
          <div className="text-4xl font-black text-emerald-600 my-2">100%</div>
          <div className="text-slate-500 text-xs font-bold">Terhubung ke SIMBG & BSrE</div>
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-emerald-600 select-none">%</div>
        </div>

      </div>

      {/* Main Grid: Recent Coordination & Gateway / QR Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section: Monitor Antar-Dinas & Priority Reports */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Recent SIMBG Parallel Cases Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-black text-slate-800 tracking-tight text-lg uppercase italic">
                Monitor Antar-Dinas (Paralel)
              </h2>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Live Updates
              </span>
            </div>

            <div className="overflow-x-auto px-6 py-2">
              <table className="w-full text-left">
                <thead className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3">Nomor Kasus / Bangunan</th>
                    <th className="py-3">Modul</th>
                    <th className="py-3">Status Penelaahan</th>
                    <th className="py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {buildingCases.slice(0, 4).map((c) => (
                    <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition">
                      <td className="py-4">
                        <div className="font-black text-slate-800">{c.buildingName}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-semibold">{c.simbgReferenceNo} • {c.applicantName}</div>
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase">
                          {c.applicationType}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {c.opdAssessments.map((opd) => (
                            <span 
                              key={opd.opdId} 
                              className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                                opd.status === 'disetujui' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {opd.opdName.split('-')[0]}: {opd.status}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => setActiveTab('bangunan')}
                          className="text-xs font-black text-emerald-600 hover:underline cursor-pointer uppercase"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Priority Infrastructure Damage Reports */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="font-black text-slate-800 tracking-tight text-lg uppercase italic">
                  Laporan Kerusakan Prioritas (GARDA INFRA)
                </h2>
              </div>
              <button 
                onClick={() => setActiveTab('infra')}
                className="text-xs font-black text-slate-600 hover:text-slate-900 uppercase tracking-wider cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {reports.slice(0, 3).map((rep) => (
                <div key={rep.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-800 text-sm">{rep.assetName}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Skor: {rep.priorityScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{rep.description}</p>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      Kec. {rep.district} • Pelapor: {rep.reporterName}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('infra')}
                    className="bg-slate-800 hover:bg-black text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition cursor-pointer self-start sm:self-center"
                  >
                    Buat SPK
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Section: Gateway & QR Widgets */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Gateway Server Widget */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 italic">
                Gateway Server Monitoring
              </h3>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
            </div>

            <div className="space-y-3">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest">
                  Antrean Transaksi Data SIMBG
                </div>
                <div className="text-2xl font-black">
                  0 <span className="text-xs font-bold text-emerald-400">Terbaca Sukses</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest">
                  Enkripsi BSrE & TTE
                </div>
                <div className="text-xs font-black text-emerald-400 uppercase">
                  100% Terenkripsi (AES-256)
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('gateway')}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest transition cursor-pointer"
            >
              Lihat Gateway Server
            </button>
          </div>

          {/* QR Verification Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center justify-between">
              Verifikasi QR Unik
              <span className="text-[9px] bg-slate-800 text-white px-2 py-0.5 rounded-full italic font-bold">
                Encrypted
              </span>
            </h3>

            <div className="flex flex-col items-center justify-center py-4 space-y-3 text-center">
              <div className="w-28 h-28 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-3">
                <div className="w-full h-full bg-slate-800 rounded opacity-20 grid grid-cols-4 grid-rows-4 gap-1">
                  <div className="bg-black"></div><div></div><div className="bg-black"></div><div className="bg-black"></div>
                  <div></div><div className="bg-black"></div><div></div><div></div>
                  <div className="bg-black"></div><div></div><div className="bg-black"></div><div className="bg-black"></div>
                </div>
              </div>
              <div>
                <div className="text-xs font-black text-slate-800 uppercase tracking-tight">KODE QR GARDA-INFRA-8821</div>
                <p className="text-[10px] text-slate-400 mt-0.5 italic">Pindai untuk verifikasi keaslian dokumen di lapangan.</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('qr')}
              className="w-full py-3 bg-slate-800 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition cursor-pointer"
            >
              Buka QR Manager
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

