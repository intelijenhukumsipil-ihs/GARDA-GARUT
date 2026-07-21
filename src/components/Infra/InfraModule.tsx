import React, { useState } from 'react';
import { 
  HardHat, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  QrCode, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Upload, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Eye,
  Send,
  Zap,
  Printer
} from 'lucide-react';
import { 
  InfraAsset, 
  DamageReport, 
  WorkOrder, 
  DamageSeverity, 
  UserProfile 
} from '../../types';
import { calculateInfraPriorityScore, generateQrDataUrl, buildAssetQrPayload } from '../../utils/gardaEngine';

interface InfraModuleProps {
  currentUser: UserProfile;
  assets: InfraAsset[];
  reports: DamageReport[];
  workOrders: WorkOrder[];
  onSaveReport: (report: DamageReport) => void;
  onSaveWorkOrder: (workOrder: WorkOrder) => void;
  onUpdateAssetCondition: (assetId: string, newCondition: InfraAsset['condition']) => void;
}

export const InfraModule: React.FC<InfraModuleProps> = ({
  currentUser,
  assets,
  reports,
  workOrders,
  onSaveReport,
  onSaveWorkOrder,
  onUpdateAssetCondition
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'reports' | 'work_orders' | 'evidence'>('inventory');
  
  // Inventory Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Selected Items for Modals
  const [selectedQrAsset, setSelectedQrAsset] = useState<InfraAsset | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // New Report Modal State
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [newReportAssetId, setNewReportAssetId] = useState(assets[0]?.id || '');
  const [newReportDesc, setNewReportDesc] = useState('');
  const [newReportDistrict, setNewReportDistrict] = useState('Tarogong Kidul');
  const [newReportReporterName, setNewReportReporterName] = useState(currentUser.name);
  const [newReportContact, setNewReportContact] = useState('0812-3456-7890');
  const [newReportDangerScore, setNewReportDangerScore] = useState<number>(7);
  const [newReportImpacted, setNewReportImpacted] = useState<number>(1000);
  const [newReportIsVital, setNewReportIsVital] = useState<boolean>(true);
  const [newReportPhotos, setNewReportPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80'
  ]);

  // New SPK Modal State
  const [selectedReportForSpk, setSelectedReportForSpk] = useState<DamageReport | null>(null);
  const [spkTitle, setSpkTitle] = useState('');
  const [spkTeam, setSpkTeam] = useState('Tim Reaksi Cepat UPL 1 Bina Marga');
  const [spkLeader, setSpkLeader] = useState('Agus Kurnia, A.Md.T.');
  const [spkTargetDays, setSpkTargetDays] = useState(3);

  // Handle Opening QR Modal
  const handleOpenQrModal = async (asset: InfraAsset) => {
    setSelectedQrAsset(asset);
    const payload = buildAssetQrPayload(asset);
    const url = await generateQrDataUrl(payload);
    setQrCodeDataUrl(url);
  };

  // Handle Submitting New Damage Report
  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find(a => a.id === newReportAssetId);
    if (!asset) return;

    const { score, rationale } = calculateInfraPriorityScore(newReportDangerScore, newReportImpacted, newReportIsVital);

    const newReport: DamageReport = {
      id: `LPR-2026-${String(reports.length + 42).padStart(4, '0')}`,
      assetId: asset.id,
      assetName: asset.name,
      reporterName: newReportReporterName,
      reporterContact: newReportContact,
      district: newReportDistrict,
      latitude: asset.latitude,
      longitude: asset.longitude,
      description: newReportDesc,
      photos: newReportPhotos,
      severity: score >= 85 ? 'darurat' : score >= 70 ? 'berat' : score >= 50 ? 'sedang' : 'ringan',
      riskAssessment: {
        potentialDangerScore: newReportDangerScore,
        impactedPeopleCount: newReportImpacted,
        isVitalRoute: newReportIsVital
      },
      priorityScore: score,
      priorityRationale: rationale,
      status: 'terverifikasi',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedCompletionDays: score >= 85 ? 1 : 3
    };

    onSaveReport(newReport);
    onUpdateAssetCondition(asset.id, score >= 85 ? 'darurat' : 'rusak_berat');

    // Trigger WhatsApp Notification to +62 812-2235-5822
    fetch('/api/gateway/whatsapp-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientPhone: '+62 812-2235-5822',
        messageType: 'DAMAGE_REPORT',
        data: {
          assetName: asset.name,
          district: newReportDistrict,
          reporterName: newReportReporterName,
          priorityScore: score,
          description: newReportDesc
        }
      })
    }).catch(console.error);

    setIsNewReportOpen(false);
    setNewReportDesc('');
  };

  // Handle Issuing New SPK
  const handleIssueSpk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportForSpk) return;

    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + spkTargetDays);

    const newSpk: WorkOrder = {
      id: `SPK-PUPR-2026-${String(workOrders.length + 89).padStart(3, '0')}`,
      reportId: selectedReportForSpk.id,
      assetId: selectedReportForSpk.assetId,
      title: spkTitle || `Penanganan Darurat ${selectedReportForSpk.assetName}`,
      assignedTeam: spkTeam,
      leaderName: spkLeader,
      startDate: today.toISOString().split('T')[0],
      targetEndDate: targetDate.toISOString().split('T')[0],
      requiredMaterials: [
        { materialName: 'Semen Portland', qty: 30, unit: 'sak' },
        { materialName: 'Pasir Pasang', qty: 5, unit: 'm3' },
        { materialName: 'Batu Kali', qty: 10, unit: 'm3' }
      ],
      safetyProtocols: [
        'Wajib Helm & Sepatu Boot Safety K3',
        'Pemasangan Barikade & Kerucut Lalu Lintas'
      ],
      status: 'dalam_pengerjaan',
      beforePhotos: selectedReportForSpk.photos,
      inProgressPhotos: [],
      afterPhotos: [],
      fieldNotes: 'Perintah kerja resmi diterbitkan oleh Koordinator PUPR.'
    };

    onSaveWorkOrder(newSpk);

    // Update Report Status
    const updatedReport = { ...selectedReportForSpk, status: 'proses_spk' as const, spkId: newSpk.id };
    onSaveReport(updatedReport);

    setSelectedReportForSpk(null);
  };

  // Filtered Assets
  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesDist = selectedDistrict === 'all' || a.district === selectedDistrict;
    return matchesSearch && matchesCat && matchesDist;
  });

  return (
    <div className="space-y-6">
      
      {/* Module Title Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <HardHat className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-black tracking-tight uppercase italic text-white">GARDA INFRA — Aset & Pemeliharaan Daerah</h1>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Infrastruktur Kabupaten Garut
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl font-medium">
            Sistem inventarisir aset, verifikasi laporan kerusakan berbasis QR Code, kalkulasi otomatis prioritas perbaikan, dan pemantauan bukti fisik pengerjaan.
          </p>
        </div>

        <button
          onClick={() => setIsNewReportOpen(true)}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest px-5 py-3 rounded-2xl shadow transition flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan Kerusakan</span>
        </button>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 gap-2 overflow-x-auto shadow-sm">
        {[
          { id: 'inventory', label: '1. Inventaris Aset Cerdas & QR', icon: HardHat },
          { id: 'reports', label: '2. Verifikasi Laporan & Skor Prioritas', icon: AlertTriangle, badge: reports.length },
          { id: 'work_orders', label: '3. Perintah Kerja (SPK)', icon: FileText, badge: workOrders.length },
          { id: 'evidence', label: '4. Bukti Lapangan & Histori', icon: CheckCircle2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-amber-400 shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>


      {/* SUBTAB 1: INVENTORY & QR */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari aset / kode QR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2.5 rounded-xl"
              >
                <option value="all">Semua Kategori</option>
                <option value="jalan">Jalan Raya</option>
                <option value="jembatan">Jembatan</option>
                <option value="drainase">Drainase / Saluran Air</option>
                <option value="gedung_daerah">Gedung Daerah</option>
                <option value="pju">Penerangan Jalan Umum</option>
                <option value="irigasi">Irigasi</option>
              </select>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2.5 rounded-xl"
              >
                <option value="all">Semua Kecamatan</option>
                <option value="Tarogong Kidul">Tarogong Kidul</option>
                <option value="Garut Kota">Garut Kota</option>
                <option value="Leles">Leles</option>
                <option value="Banyuresmi">Banyuresmi</option>
              </select>
            </div>
          </div>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-600 font-black block uppercase tracking-widest">{asset.id}</span>
                    <h3 className="text-sm font-black text-slate-800 line-clamp-1 uppercase">{asset.name}</h3>
                  </div>
                  <button
                    onClick={() => handleOpenQrModal(asset)}
                    className="p-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 rounded-xl transition border border-slate-200 cursor-pointer"
                    title="Cetak/Lihat Kartu Identitas QR Code Aset"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 font-medium space-y-1">
                  <div className="flex items-center text-slate-700 font-bold">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                    <span className="truncate">Kec. {asset.district} ({asset.locationAddress})</span>
                  </div>
                  <div>Pengelola: {asset.managingAgency}</div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    asset.condition === 'baik' ? 'bg-emerald-100 text-emerald-800' :
                    asset.condition === 'rusak_ringan' ? 'bg-blue-100 text-blue-800' :
                    asset.condition === 'rusak_sedang' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {asset.condition.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{asset.lastMaintenanceDate}</span>
                </div>
              </div>
            ))}
          </div>


        </div>
      )}

      {/* SUBTAB 2: REPORTS & PRIORITY CALCULATOR */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-black text-slate-800 uppercase italic mb-1">Daftar Laporan Kerusakan & Penilaian Prioritas</h2>
            <p className="text-xs text-slate-500 font-medium mb-6">
              Prioritas perbaikan diurutkan secara obyektif berdasarkan tingkat bahaya, perkiraan populasi terdampak, dan status jalur ekonomi vital.
            </p>

            <div className="space-y-4">
              {reports.map((rep) => (
                <div key={rep.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-emerald-600">{rep.id}</span>
                        <span className="text-xs font-black text-slate-800">• {rep.assetName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Pelapor: <strong>{rep.reporterName}</strong> ({rep.reporterContact}) • Kec. {rep.district}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        Skor Prioritas: {rep.priorityScore}/100
                      </span>
                      {rep.status === 'terverifikasi' && (
                        <button
                          onClick={() => {
                            setSelectedReportForSpk(rep);
                            setSpkTitle(`Penanganan Darurat ${rep.assetName}`);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          Terbitkan SPK
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 font-medium">
                    "{rep.description}"
                  </p>

                  <div className="text-[11px] text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 font-semibold">
                    ⚡ Rasionalisasi Sistem: {rep.priorityRationale}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: WORK ORDERS (SPK) */}
      {activeSubTab === 'work_orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {workOrders.map((wo) => (
              <div key={wo.id} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-black text-emerald-600 block">{wo.id}</span>
                    <h3 className="text-sm font-black text-slate-800 uppercase">{wo.title}</h3>
                  </div>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    Status: {wo.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Pelaksana Terkait</span>
                    <span className="font-bold text-slate-800">{wo.assignedTeam}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Ketua Tim Lapangan</span>
                    <span className="font-bold text-slate-800">{wo.leaderName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Target Selesai</span>
                    <span className="font-black text-amber-600">{wo.targetEndDate}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Material Utama Diterbitkan:</span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {wo.requiredMaterials.map((m, idx) => (
                      <span key={idx} className="bg-slate-100 px-3 py-1 rounded-xl text-slate-800 font-bold border border-slate-200">
                        {m.materialName}: {m.qty} {m.unit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: EVIDENCE LOG */}
      {activeSubTab === 'evidence' && (
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-800 uppercase italic">Pencatatan Bukti Fisik Lapangan & Verifikasi Atasan</h2>
          <p className="text-xs text-slate-500 font-medium">
            Foto fisik sebelum, saat pengerjaan, dan sesudah perbaikan wajib diunggah sebagai dokumen pertanggungjawaban permanen SPBE.
          </p>

          {workOrders.map((wo) => (
            <div key={wo.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 uppercase">{wo.title} ({wo.id})</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">Verified Log ID: #{wo.id.slice(-4)}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Foto Sebelum Perbaikan</span>
                  <img src={wo.beforePhotos[0]} className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-sm" alt="Sebelum" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Foto Saat Pengerjaan</span>
                  <img src={wo.inProgressPhotos[0] || wo.beforePhotos[0]} className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-sm" alt="Proses" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Catatan Progress Lapangan</span>
                  <div className="bg-white p-3 h-32 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium overflow-y-auto">
                    {wo.fieldNotes || 'Belum ada catatan lapangan.'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* QR MODAL */}
      {selectedQrAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400">Kartu QR Aset Resmi GARDA INFRA</span>
              <button onClick={() => setSelectedQrAsset(null)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕</button>
            </div>

            {qrCodeDataUrl && (
              <img src={qrCodeDataUrl} className="w-48 h-48 mx-auto rounded-xl bg-white p-2 shadow-lg" alt="QR Code" />
            )}

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white">{selectedQrAsset.name}</h3>
              <p className="text-[10px] font-mono text-amber-300">{selectedQrAsset.id}</p>
              <p className="text-[10px] text-slate-400">Kec. {selectedQrAsset.district} • {selectedQrAsset.managingAgency}</p>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu QR Aset</span>
            </button>
          </div>
        </div>
      )}

      {/* NEW REPORT MODAL */}
      {isNewReportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-sm font-bold text-white">Formulir Laporan Kerusakan Infrastruktur</span>
              <button onClick={() => setIsNewReportOpen(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmitNewReport} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Pilih Aset Terkait</label>
                <select
                  value={newReportAssetId}
                  onChange={(e) => setNewReportAssetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.district})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Deskripsi Kerusakan Lapangan</label>
                <textarea
                  rows={3}
                  required
                  value={newReportDesc}
                  onChange={(e) => setNewReportDesc(e.target.value)}
                  placeholder="Jelaskan jenis & keparahan kerusakan..."
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Skor Potensi Bahaya (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newReportDangerScore}
                    onChange={(e) => setNewReportDangerScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Estimasi Terdampak (Jiwa)</label>
                  <input
                    type="number"
                    value={newReportImpacted}
                    onChange={(e) => setNewReportImpacted(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="vitalRoute"
                  checked={newReportIsVital}
                  onChange={(e) => setNewReportIsVital(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-amber-500"
                />
                <label htmlFor="vitalRoute" className="text-slate-300 font-medium">
                  Merupakan Jalur Ekonomi / Transportasi Vital Garut
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewReportOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Kirim & Verifikasi Prioritas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW SPK MODAL */}
      {selectedReportForSpk && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-sm font-bold text-white">Terbitkan Surat Perintah Kerja (SPK)</span>
              <button onClick={() => setSelectedReportForSpk(null)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleIssueSpk} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Judul Perintah Kerja</label>
                <input
                  type="text"
                  required
                  value={spkTitle}
                  onChange={(e) => setSpkTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Tim Pelaksana Lapangan</label>
                <input
                  type="text"
                  required
                  value={spkTeam}
                  onChange={(e) => setSpkTeam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Target Durasi Pengerjaan (Hari)</label>
                <input
                  type="number"
                  required
                  value={spkTargetDays}
                  onChange={(e) => setSpkTargetDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedReportForSpk(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Terbitkan SPK Resmi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
