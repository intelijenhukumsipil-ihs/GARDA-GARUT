export type RoleType = 
  | 'admin_layanan'   // Admin PUPR
  | 'penelaah_dinas'  // Penelaah OPD (DLH, Perkim, Satpol PP, Dishub)
  | 'koordinator'     // Koordinator Perizinan Terpadu PUPR
  | 'tim_lapangan'    // Tim Surveyor / Eksekutor Lapangan
  | 'pimpinan'        // Kepala Dinas PUPR / Bupati Garut
  | 'pemohon';        // Pemohon PBG/SLF / Masyarakat Pelapor

export interface UserProfile {
  id: string;
  name: string;
  role: RoleType;
  agency: string;
  email: string;
  avatar: string;
  isTwoFactorVerified: boolean;
}

export type AssetCondition = 'baik' | 'rusak_ringan' | 'rusak_sedang' | 'rusak_berat' | 'darurat';
export type AssetCategory = 'jalan' | 'jembatan' | 'drainase' | 'gedung_daerah' | 'pju' | 'irigasi';

export interface InfraAsset {
  id: string; // Kode unik aset (e.g. AST-GRT-JLN-012)
  name: string;
  category: AssetCategory;
  district: string; // Kecamatan di Garut (Tarogong Kidul, Garut Kota, Wanaraja, dll)
  locationAddress: string;
  latitude: number;
  longitude: number;
  constructionYear: number;
  managingAgency: string; // e.g. Bidang Bina Marga PUPR Garut
  condition: AssetCondition;
  lastMaintenanceDate: string;
  technicalSpecs: {
    lengthMeters?: number;
    widthMeters?: number;
    surfaceType?: string;
    capacity?: string;
    buildingAreaSqm?: number;
  };
  qrCodeUrl?: string;
  maintenanceHistoryCount: number;
}

export type DamageSeverity = 'ringan' | 'sedang' | 'berat' | 'darurat';
export type ReportStatus = 'menunggu_verifikasi' | 'terverifikasi' | 'proses_spk' | 'dalam_perbaikan' | 'selesai' | 'ditolak';

export interface DamageReport {
  id: string; // e.g. LPR-2026-0041
  assetId: string;
  assetName: string;
  reporterName: string;
  reporterContact: string;
  district: string;
  latitude: number;
  longitude: number;
  description: string;
  photos: string[];
  severity: DamageSeverity;
  riskAssessment: {
    potentialDangerScore: number; // 1-10
    impactedPeopleCount: number;
    isVitalRoute: boolean;
  };
  priorityScore: number; // 1-100 calculated
  priorityRationale: string;
  status: ReportStatus;
  createdAt: string;
  estimatedCompletionDays?: number;
  spkId?: string;
}

export interface WorkOrder {
  id: string; // e.g. SPK-PUPR-2026-088
  reportId: string;
  assetId: string;
  title: string;
  assignedTeam: string;
  leaderName: string;
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  requiredMaterials: { materialName: string; qty: number; unit: string }[];
  safetyProtocols: string[];
  status: 'diterbitkan' | 'dalam_pengerjaan' | 'menunggu_inspeksi' | 'selesai_diverifikasi';
  beforePhotos: string[];
  inProgressPhotos: string[];
  afterPhotos: string[];
  fieldNotes?: string;
  verifiedBy?: string;
}

// GARDA BANGUNAN TYPES
export type ApplicationType = 'PBG' | 'SLF' | 'SBKBG' | 'RTB';
export type CaseStatus = 
  | 'pendaftaran'
  | 'penilaian_paralel'
  | 'koreksi_terpadu'
  | 'jadwal_inspeksi'
  | 'inspeksi_selesai'
  | 'rekomendasi_terbit'
  | 'sinkron_simbg';

export interface OPDRating {
  opdId: string;
  opdName: string; // e.g. Dinas Lingkungan Hidup
  requiredRationale: string; // Rationale why OPD assessment is required
  status: 'pending' | 'disetujui' | 'perlu_revisi' | 'ditolak';
  assessorName?: string;
  reviewedAt?: string;
  score: number; // 0-100
  notes: string;
  technicalCorrections: { requirement: string; finding: string; correctionNeeded: string }[];
  slaHoursLeft: number;
}

export interface BuildingCase {
  id: string; // Nomor Kasus GARDA: GRD-BGN-2026-0142
  simbgReferenceNo: string; // Nomor Referensi SIMBG Resmi: SIMBG-PBG-GRT-2026-8821
  applicantName: string;
  applicantNik: string;
  applicantPhone: string;
  buildingName: string;
  buildingFunction: 'Hunian' | 'Usaha' | 'Sosial_Budaya' | 'Khusus' | 'Ganda';
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  applicationType: ApplicationType;
  buildingAreaSqm: number;
  floorsCount: number;
  submittedAt: string;
  status: CaseStatus;
  documents: {
    docName: string;
    fileUrl: string;
    status: 'sesuai' | 'perlu_perbaikan' | 'belum_diperiksa';
    notes?: string;
  }[];
  opdAssessments: OPDRating[];
  unifiedCorrections: {
    id: string;
    opdOrigin: string;
    category: string;
    description: string;
    isConflictOrDuplicate: boolean;
    resolutionNotes?: string;
    isResolvedByApplicant: boolean;
  }[];
  inspectionSchedule?: {
    date: string;
    time: string;
    assignedAgencies: string[];
    inspectorNames: string[];
    bapNumber?: string;
    bapSummary?: string;
    fieldPhotos?: string[];
    isCompleted: boolean;
  };
  recommendationDoc?: {
    docNo: string; // REK-PUPR-GRT-2026-091
    issuedAt: string;
    validUntil: string;
    digitalSignatureHash: string;
    signedBy: string;
    qrVerificationUrl: string;
    simbgSyncStatus: 'synced' | 'pending' | 'failed';
    simbgSyncedAt?: string;
  };
}

// GATEWAY SERVER TYPES
export interface GatewayEndpointStatus {
  id: string;
  systemName: string;
  endpointUrl: string;
  protocol: 'REST_JSON' | 'SOAP_XML' | 'GRPC' | 'WEBSOCKET';
  status: 'online' | 'degraded' | 'offline';
  latencyMs: number;
  lastHeartbeat: string;
  pendingQueueCount: number;
  successRatePercent: number;
}

export interface GatewayQueueItem {
  id: string;
  targetSystem: string;
  action: 'SYNC_PBG_RECOMMENDATION' | 'FETCH_SIMBG_DATA' | 'BROADCAST_ASSET_ALERT' | 'DISPATCH_OPD_TASK';
  payloadSummary: string;
  status: 'queued' | 'processing' | 'completed' | 'failed_retrying';
  retryCount: number;
  createdAt: string;
  lastAttemptAt?: string;
  errorMessage?: string;
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  ipAddress: string;
  userEmail?: string;
  eventType: 'AUTHENTICATION_2FA' | 'SIMBG_SYNC_DISPATCH' | 'FORMAT_TRANSLATION' | 'UNAUTHORIZED_ACCESS_BLOCKED' | 'AUDIT_TRAIL_APPEND';
  severity: 'info' | 'warning' | 'critical';
  details: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  module: 'GARDA_INFRA' | 'GARDA_BANGUNAN' | 'GATEWAY' | 'SYSTEM';
  action: string;
  targetRef: string;
  details: string;
  ipAddress: string;
}
