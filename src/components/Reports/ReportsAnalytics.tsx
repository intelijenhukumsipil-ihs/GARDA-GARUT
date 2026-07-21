import React from 'react';
import { 
  BarChart3, 
  Printer, 
  FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { InfraAsset, BuildingCase, DamageReport } from '../../types';

interface ReportsAnalyticsProps {
  assets: InfraAsset[];
  buildingCases: BuildingCase[];
  reports: DamageReport[];
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({
  assets,
  buildingCases,
  reports
}) => {
  // Chart Data: Assets by Condition
  const conditionData = [
    { name: 'Baik', count: assets.filter(a => a.condition === 'baik').length, color: '#10B981' },
    { name: 'Rusak Ringan', count: assets.filter(a => a.condition === 'rusak_ringan').length, color: '#3B82F6' },
    { name: 'Rusak Sedang', count: assets.filter(a => a.condition === 'rusak_sedang').length, color: '#F59E0B' },
    { name: 'Rusak Berat', count: assets.filter(a => a.condition === 'rusak_berat').length, color: '#EF4444' }
  ];

  // Chart Data: OPD SLA Performance
  const opdSlaData = [
    { opd: 'Dinas PUPR', tepatWaktu: 98, lewatWaktu: 2 },
    { opd: 'DLH Garut', tepatWaktu: 92, lewatWaktu: 8 },
    { opd: 'Dishub', tepatWaktu: 95, lewatWaktu: 5 },
    { opd: 'Satpol PP', tepatWaktu: 97, lewatWaktu: 3 }
  ];

  // Handle Export CSV
  const handleExportCsv = () => {
    const csvRows = [
      ['Kode Aset', 'Nama Aset', 'Kategori', 'Kecamatan', 'Kondisi', 'Pengelola'],
      ...assets.map(a => [a.id, a.name, a.category, a.district, a.condition, a.managingAgency])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GARDA_GARUT_ASSETS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-black tracking-tight uppercase italic text-white">Laporan Kinerja & Ekspor Data PUPR</h1>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl font-medium">
            Grafik pemantauan waktu penyelesaian perbaikan, kepatuhan SLA antar-dinas, dan pengunduhan laporan resmi format PDF/Excel.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleExportCsv}
            className="bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest px-4 py-3 rounded-2xl border border-white/15 transition flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Excel</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest px-5 py-3 rounded-2xl shadow transition flex items-center space-x-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Condition Breakdown */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Sebaran Kondisi Aset Infrastruktur Kabupaten Garut
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conditionData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.name}: ${entry.count}`}
                >
                  {conditionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: OPD SLA Performance */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Kepatuhan SLA Penelaahan Paralel Antar-Dinas (%)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opdSlaData}>
                <XAxis dataKey="opd" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="tepatWaktu" fill="#10B981" name="Sesuai SLA (%)" />
                <Bar dataKey="lewatWaktu" fill="#EF4444" name="Terlambat (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

