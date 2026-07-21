import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  Share2, 
  QrCode, 
  ShieldCheck, 
  Printer,
  ChevronRight,
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { BuildingCase, OPDRating, UserProfile } from '../../types';
import { generateQrDataUrl, buildCaseQrPayload, consolidateOpdCorrections } from '../../utils/gardaEngine';

interface BangunanModuleProps {
  currentUser: UserProfile;
  buildingCases: BuildingCase[];
  onSaveBuildingCase: (buildingCase: BuildingCase) => void;
}

export const BangunanModule: React.FC<BangunanModuleProps> = ({
  currentUser,
  buildingCases,
  onSaveBuildingCase
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cases' | 'parallel' | 'corrections' | 'recommendations'>('cases');
  const [selectedCase, setSelectedCase] = useState<BuildingCase>(buildingCases[0]);

  // Case Registration Modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newSimbgRef, setNewSimbgRef] = useState('SIMBG-PBG-GRT-2026-9901');
  const [newApplicantName, setNewApplicantName] = useState('PT Garut Sentra Industri');
  const [newApplicantNik, setNewApplicantNik] = useState('3205011988010005');
  const [newApplicantPhone, setNewApplicantPhone] = useState('0813-9988-7766');
  const [newBuildingName, setNewBuildingName] = useState('Gedung Pabrik Pengolahan Kopi Garut');
  const [newBuildingFunction, setNewBuildingFunction] = useState<BuildingCase['buildingFunction']>('Usaha');
  const [newDistrict, setNewDistrict] = useState('Tarogong Kidul');
  const [newAddress, setNewAddress] = useState('Jl. Raya Samarang No. 45');
  const [newAppType, setNewAppType] = useState<BuildingCase['applicationType']>('PBG');
  const [newAreaSqm, setNewAreaSqm] = useState(1500);

  // Selected QR Recommendation Document Modal
  const [qrDocCase, setQrDocCase] = useState<BuildingCase | null>(null);
  const [qrDocDataUrl, setQrDocDataUrl] = useState('');

  // Handle Opening Printable Recommendation Document
  const handleOpenRecommendationDoc = async (c: BuildingCase) => {
    setQrDocCase(c);
    const payload = buildCaseQrPayload(c);
    const url = await generateQrDataUrl(payload);
    setQrDocDataUrl(url);
  };

  // Submit New Building Case Registration
  const handleRegisterCase = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-assign OPDs based on function and area
    const autoOpds: OPDRating[] = [
      {
        opdId: 'OPD-PUPR',
        opdName: 'Dinas PUPR - Tata Bangunan',
        requiredRationale: 'Wajib Verifikasi KDB, KLB, & Keselamatan Struktur Bangunan Gedung',
        status: 'pending',
        score: 0,
        notes: 'Dalam proses penelaahan dokumen arsitektur dan struktur.',
        technicalCorrections: [],
        slaHoursLeft: 48
      }
    ];

    if (newAreaSqm > 1000 || newBuildingFunction === 'Usaha') {
      autoOpds.push({
        opdId: 'OPD-DLH',
        opdName: 'Dinas Lingkungan Hidup (DLH)',
        requiredRationale: 'Luas > 1.000m² wajib rekomendasi kelayakan lingkungan (UKL-UPL/AMDAL)',
        status: 'pending',
        score: 0,
        notes: 'Menunggu dokumen mitigasi pengelolaan limbah cair B3.',
        technicalCorrections: [
          {
            requirement: 'Kapasitas Bak Pengendap Limbah',
            finding: 'Belum terinci pada layout dasar.',
            correctionNeeded: 'Sediakan gambar kerja bak IPAL sesuai baku mutu DLH Garut.'
          }
        ],
        slaHoursLeft: 24
      });
    }

    const newCase: BuildingCase = {
      id: `GRD-BGN-2026-${String(buildingCases.length + 143).padStart(4, '0')}`,
      simbgReferenceNo: newSimbgRef,
      applicantName: newApplicantName,
      applicantNik: newApplicantNik,
      applicantPhone: newApplicantPhone,
      buildingName: newBuildingName,
      buildingFunction: newBuildingFunction,
      district: newDistrict,
      address: newAddress,
      latitude: -7.2145,
      longitude: 107.8890,
      applicationType: newAppType,
      buildingAreaSqm: newAreaSqm,
      floorsCount: 2,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'penilaian_paralel',
      documents: [
        { docName: 'Gambar Arsitektur & Denah Struktur', fileUrl: 'https://example.com/arch.pdf', status: 'sesuai' }
      ],
      opdAssessments: autoOpds,
      unifiedCorrections: consolidateOpdCorrections(autoOpds)
    };

    onSaveBuildingCase(newCase);
    setSelectedCase(newCase);
    setIsRegisterOpen(false);
  };

  // Issue Integrated Recommendation Document
  const handleIssueDoc = (c: BuildingCase) => {
    const updated: BuildingCase = {
      ...c,
      status: 'rekomendasi_terbit',
      recommendationDoc: {
        docNo: `REK-PUPR-GRT-2026-${String(Math.floor(Math.random() * 800) + 100).padStart(3, '0')}`,
        issuedAt: new Date().toISOString().split('T')[0],
        validUntil: '2031-07-21',
        digitalSignatureHash: 'f4d3c2b1a09876543210fedcba9876543210abcdef1234567890abcdef123456',
        signedBy: 'Ir. Risa Kristalia N., ST., MT. (Kepala Dinas PUPR)',
        qrVerificationUrl: `https://garda.garutkab.go.id/verify/doc?caseId=${c.id}`,
        simbgSyncStatus: 'synced',
        simbgSyncedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
    };
    onSaveBuildingCase(updated);
    setSelectedCase(updated);

    // Trigger WhatsApp Notification to +62 813-1640-3160
    fetch('/api/gateway/whatsapp-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientPhone: '+62 813-1640-3160',
        messageType: 'RECOMMENDATION',
        data: {
          docNo: updated.recommendationDoc?.docNo,
          simbgReferenceNo: updated.simbgReferenceNo,
          applicantName: updated.applicantName,
          buildingName: updated.buildingName
        }
      })
    }).catch(console.error);
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-black tracking-tight uppercase italic text-white">GARDA BANGUNAN — Koordinasi Perizinan SIMBG</h1>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Pusat Rekomendasi Terpadu
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl font-medium">
            Menyelaraskan rekomendasi teknis antar-dinas (PUPR, Perkim, DLH, Satpol PP, Dishub) secara paralel tanpa menggeser wewenang resmi penerbitan izin SIMBG.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest px-5 py-3 rounded-2xl shadow transition flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Daftarkan Kasus SIMBG Baru</span>
        </button>
      </div>

      {/* Subtab Navigation */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 gap-2 overflow-x-auto shadow-sm">
        {[
          { id: 'cases', label: '1. Kasus SIMBG Terdaftar', icon: Building2, badge: buildingCases.length },
          { id: 'parallel', label: '2. Penilaian Paralel OPD & SLA', icon: Clock },
          { id: 'corrections', label: '3. Penyatuan Koreksi Terpadu', icon: Layers },
          { id: 'recommendations', label: '4. Dokumen Rekomendasi & Sync SIMBG', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-emerald-400 shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded-full font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: CASES LIST */}
      {activeSubTab === 'cases' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cases Column */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Daftar Permohonan Bangunan</h2>
            {buildingCases.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`p-5 rounded-3xl border transition cursor-pointer space-y-2 ${
                  selectedCase?.id === c.id
                    ? 'bg-slate-900 border-slate-800 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black font-mono ${selectedCase?.id === c.id ? 'text-emerald-400' : 'text-emerald-700'}`}>{c.simbgReferenceNo}</span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    {c.applicationType}
                  </span>
                </div>
                <h3 className="text-xs font-black uppercase tracking-tight">{c.buildingName}</h3>
                <p className={`text-[11px] font-medium ${selectedCase?.id === c.id ? 'text-slate-400' : 'text-slate-500'}`}>Pemohon: {c.applicantName} • Kec. {c.district}</p>
              </div>
            ))}
          </div>

          {/* Detailed Selected Case View */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            {selectedCase ? (
              <>
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-emerald-600 font-black">{selectedCase.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-mono text-slate-500 font-bold">{selectedCase.simbgReferenceNo}</span>
                    </div>
                    <h2 className="text-lg font-black text-slate-800 uppercase mt-1 italic">{selectedCase.buildingName}</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Fungsi: {selectedCase.buildingFunction} • Luas: {selectedCase.buildingAreaSqm} m² • {selectedCase.floorsCount} Lantai
                    </p>
                  </div>

                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    Status: {selectedCase.status.replace('_', ' ')}
                  </span>
                </div>

                {/* OPD Assessment Progress Grid */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Pembagian Tugas & Penilaian Paralel OPD:</h3>
                  <div className="space-y-3">
                    {selectedCase.opdAssessments.map((opd) => (
                      <div key={opd.opdId} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-800 uppercase">{opd.opdName}</span>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                            opd.status === 'disetujui' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {opd.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 font-bold italic">Alasan Wajib: {opd.requiredRationale}</p>
                        <p className="text-xs text-slate-600 font-medium">{opd.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Trigger for Issue Recommendation */}
                {selectedCase.status !== 'rekomendasi_terbit' && (
                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleIssueDoc(selectedCase)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow transition flex items-center space-x-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Terbitkan Surat Rekomendasi Terpadu & Sync SIMBG</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase">Pilih permohonan untuk melihat rincian</div>
            )}
          </div>

        </div>
      )}

      {/* SUBTAB 2: PARALLEL REVIEW & SLA */}
      {activeSubTab === 'parallel' && (
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-800 uppercase italic">Penilaian Paralel OPD dengan Indikator SLA Berwarna</h2>
          <p className="text-xs text-slate-500 font-medium">
            Semua dinas teknis bekerja secara simultan. Timer SLA memberikan peringatan visual jika terjadi kelambatan rekomendasi.
          </p>

          <div className="space-y-4">
            {buildingCases.map((c) => (
              <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase">{c.buildingName} ({c.simbgReferenceNo})</span>
                  <span className="text-xs text-emerald-700 font-black uppercase">Status: {c.status}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {c.opdAssessments.map((opd) => (
                    <div key={opd.opdId} className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 text-xs shadow-sm">
                      <div className="font-black text-slate-800 uppercase">{opd.opdName.split('-')[0]}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{opd.notes}</div>
                      <div className="pt-2 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold uppercase">Sisa SLA:</span>
                        <span className={`font-black px-2.5 py-0.5 rounded-full uppercase ${
                          opd.slaHoursLeft > 24 ? 'bg-emerald-100 text-emerald-800' :
                          opd.slaHoursLeft > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {opd.slaHoursLeft} Jam
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: CONSOLIDATED CORRECTIONS */}
      {activeSubTab === 'corrections' && (
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-800 uppercase italic">Daftar Koreksi Terpadu Pemohon</h2>
          <p className="text-xs text-slate-500 font-medium">
            Menyatukan catatan perbaikan dari seluruh OPD menjadi SATU daftar rapi. Catatan yang beririsan atau bertentangan diselesaikan oleh Koordinator.
          </p>

          {buildingCases.map((c) => (
            <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="font-black text-slate-800 uppercase">{c.buildingName} ({c.simbgReferenceNo})</div>
              {c.unifiedCorrections.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {c.unifiedCorrections.map((corr) => (
                    <div key={corr.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <div className="flex justify-between font-black text-slate-800 uppercase">
                        <span>[{corr.opdOrigin}] {corr.category}</span>
                        {corr.isConflictOrDuplicate && (
                          <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-black">
                            Disatukan oleh Koordinator
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 font-medium">{corr.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic py-2 font-medium">Tidak ada catatan perbaikan teknis yang diperlukan.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 4: RECOMMENDATION DOC & SIMBG SYNC */}
      {activeSubTab === 'recommendations' && (
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-800 uppercase italic">Dokumen Rekomendasi Terpadu & Bukti Sinkronisasi SIMBG</h2>

          {buildingCases.filter(c => c.recommendationDoc).map((c) => (
            <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-emerald-700 block">{c.recommendationDoc?.docNo}</span>
                  <span className="text-sm font-black text-slate-800 uppercase">{c.buildingName}</span>
                </div>
                <button
                  onClick={() => handleOpenRecommendationDoc(c)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Surat Rekomendasi + QR</span>
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1 shadow-sm">
                <div>Tandatangan Digital BSrE: {c.recommendationDoc?.digitalSignatureHash.substring(0, 32)}...</div>
                <div>Status Sync SIMBG: <span className="text-emerald-700 font-black">TERSYNC TERVERIFIKASI ({c.recommendationDoc?.simbgSyncedAt})</span></div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* REGISTER CASE MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-sm font-bold text-white">Formulir Pendaftaran Kasus SIMBG di GARDA</span>
              <button onClick={() => setIsRegisterOpen(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleRegisterCase} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Nomor Registrasi Resmi SIMBG (Wajib)</label>
                <input
                  type="text"
                  required
                  value={newSimbgRef}
                  onChange={(e) => setNewSimbgRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg font-mono text-amber-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Nama Pemohon</label>
                  <input
                    type="text"
                    required
                    value={newApplicantName}
                    onChange={(e) => setNewApplicantName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Jenis Permohonan</label>
                  <select
                    value={newAppType}
                    onChange={(e) => setNewAppType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                  >
                    <option value="PBG">PBG (Persetujuan Bangunan Gedung)</option>
                    <option value="SLF">SLF (Sertifikat Laik Fungsi)</option>
                    <option value="SBKBG">SBKBG</option>
                    <option value="RTB">RTB</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Nama Bangunan Gedung</label>
                <input
                  type="text"
                  required
                  value={newBuildingName}
                  onChange={(e) => setNewBuildingName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Kecamatan</label>
                  <input
                    type="text"
                    required
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Luas Lantai (m²)</label>
                  <input
                    type="number"
                    required
                    value={newAreaSqm}
                    onChange={(e) => setNewAreaSqm(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg cursor-pointer"
                >
                  Daftarkan & Bagi Tugas OPD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT RECOMMENDATION DOC MODAL */}
      {qrDocCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400">Dokumen Hasil Rekomendasi Terpadu GARDA</span>
              <button onClick={() => setQrDocCase(null)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕</button>
            </div>

            {qrDocDataUrl && (
              <img src={qrDocDataUrl} className="w-48 h-48 mx-auto rounded-xl bg-white p-2 shadow-lg" alt="QR Document" />
            )}

            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-white">{qrDocCase.buildingName}</h3>
              <p className="font-mono text-emerald-400">{qrDocCase.recommendationDoc?.docNo}</p>
              <p className="text-slate-400 text-[10px]">No SIMBG Ref: {qrDocCase.simbgReferenceNo}</p>
              <p className="text-slate-300 text-[10px]">Penandatangan Sah: {qrDocCase.recommendationDoc?.signedBy}</p>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Cetakan Resmi Dokumen</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
