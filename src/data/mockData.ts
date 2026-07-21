import { 
  InfraAsset, 
  DamageReport, 
  WorkOrder, 
  BuildingCase, 
  GatewayEndpointStatus, 
  GatewayQueueItem, 
  SecurityEventLog, 
  AuditLog, 
  UserProfile 
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'USR-001',
    name: 'Ir. Risa Kristalia N., ST., MT.',
    role: 'pimpinan',
    agency: 'Dinas PUPR Kabupaten Garut',
    email: 'risa.kristalia@garutkab.go.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isTwoFactorVerified: true
  },
  {
    id: 'USR-002',
    name: 'Dadan Ramdani, S.T.',
    role: 'admin_layanan',
    agency: 'Dinas PUPR - Admin Utama GARDA',
    email: 'dadan.admin@garutkab.go.id',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    isTwoFactorVerified: true
  },
  {
    id: 'USR-003',
    name: 'H. Asep Nurdin, S.T., M.Si.',
    role: 'koordinator',
    agency: 'Sekretariat Tim Ahli Bangunan Gedung (TABG) PUPR',
    email: 'asep.koordinator@garutkab.go.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isTwoFactorVerified: true
  },
  {
    id: 'USR-004',
    name: 'Dr. Yudi Hendra, M.Si.',
    role: 'penelaah_dinas',
    agency: 'Dinas Lingkungan Hidup (DLH) Garut',
    email: 'yudi.dlh@garutkab.go.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isTwoFactorVerified: true
  },
  {
    id: 'USR-005',
    name: 'Agus Kurnia, A.Md.T.',
    role: 'tim_lapangan',
    agency: 'UPL / Tim Reaksi Cepat Bina Marga PUPR',
    email: 'agus.lapangan@garutkab.go.id',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isTwoFactorVerified: true
  },
  {
    id: 'USR-006',
    name: 'Budi Santoso (PT Garut Makmur)',
    role: 'pemohon',
    agency: 'Pemohon PBG & SLF Gedung Komersial',
    email: 'budi.pemohon@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isTwoFactorVerified: true
  }
];

export const INITIAL_ASSETS: InfraAsset[] = [
  {
    id: 'AST-GRT-JLN-001',
    name: 'Ruas Jalan Raya Samarang (Km 4 - Km 8)',
    category: 'jalan',
    district: 'Tarogong Kidul',
    locationAddress: 'Jl. Raya Samarang, Kec. Tarogong Kidul, Kabupaten Garut',
    latitude: -7.2145,
    longitude: 107.8890,
    constructionYear: 2021,
    managingAgency: 'Bidang Bina Marga Dinas PUPR Garut',
    condition: 'rusak_sedang',
    lastMaintenanceDate: '2025-11-12',
    technicalSpecs: {
      lengthMeters: 4200,
      widthMeters: 7,
      surfaceType: 'Hotmix Asphalt'
    },
    maintenanceHistoryCount: 5
  },
  {
    id: 'AST-GRT-JMB-008',
    name: 'Jembatan Cimanuk Munjul',
    category: 'jembatan',
    district: 'Garut Kota',
    locationAddress: 'Jl. Ahmad Yani, Munjul, Garut Kota',
    latitude: -7.2082,
    longitude: 107.9021,
    constructionYear: 2018,
    managingAgency: 'Bidang Bina Marga Dinas PUPR Garut',
    condition: 'baik',
    lastMaintenanceDate: '2026-02-10',
    technicalSpecs: {
      lengthMeters: 45,
      widthMeters: 9,
      surfaceType: 'Beton Gelagar Baja',
      capacity: '20 Ton'
    },
    maintenanceHistoryCount: 3
  },
  {
    id: 'AST-GRT-DRN-015',
    name: 'Saluran Drainase Utama Jalan Cimanuk',
    category: 'drainase',
    district: 'Tarogong Kidul',
    locationAddress: 'Jl. Cimanuk Barat No. 12-88, Tarogong Kidul',
    latitude: -7.2210,
    longitude: 107.8965,
    constructionYear: 2020,
    managingAgency: 'Bidang Sumber Daya Air Dinas PUPR Garut',
    condition: 'rusak_berat',
    lastMaintenanceDate: '2025-08-20',
    technicalSpecs: {
      lengthMeters: 1800,
      widthMeters: 1.5,
      surfaceType: 'U-Ditch Beton Precast'
    },
    maintenanceHistoryCount: 8
  },
  {
    id: 'AST-GRT-GDG-002',
    name: 'Gedung Pendopo Kabupaten Garut',
    category: 'gedung_daerah',
    district: 'Garut Kota',
    locationAddress: 'Jl. Kabupaten No. 1, Garut Kota',
    latitude: -7.2188,
    longitude: 107.9056,
    constructionYear: 2015,
    managingAgency: 'Bidang Tata Bangunan Dinas PUPR Garut',
    condition: 'baik',
    lastMaintenanceDate: '2026-04-15',
    technicalSpecs: {
      buildingAreaSqm: 2400,
      capacity: '500 Orang'
    },
    maintenanceHistoryCount: 12
  },
  {
    id: 'AST-GRT-PJU-044',
    name: 'PJU Smart Solar Ruas Tarogong - Leles',
    category: 'pju',
    district: 'Leles',
    locationAddress: 'Jalur Utama Tarogong-Leles Km 2',
    latitude: -7.1650,
    longitude: 107.8980,
    constructionYear: 2023,
    managingAgency: 'Dinas Perhubungan & Bidang PJU PUPR',
    condition: 'rusak_ringan',
    lastMaintenanceDate: '2026-01-05',
    technicalSpecs: {
      capacity: '120 Watt LED Solar'
    },
    maintenanceHistoryCount: 2
  },
  {
    id: 'AST-GRT-IRG-003',
    name: 'Bendung & Saluran Irigasi Copong',
    category: 'irigasi',
    district: 'Banyuresmi',
    locationAddress: 'Desa Sukasenang, Kec. Banyuresmi',
    latitude: -7.1890,
    longitude: 107.9210,
    constructionYear: 2017,
    managingAgency: 'Bidang Sumber Daya Air Dinas PUPR Garut',
    condition: 'baik',
    lastMaintenanceDate: '2026-03-01',
    technicalSpecs: {
      lengthMeters: 12500,
      capacity: 'Debit 4.5 m3/s'
    },
    maintenanceHistoryCount: 14
  }
];

export const INITIAL_REPORTS: DamageReport[] = [
  {
    id: 'LPR-2026-0041',
    assetId: 'AST-GRT-DRN-015',
    assetName: 'Saluran Drainase Utama Jalan Cimanuk',
    reporterName: 'Sujono (Warga Tarogong)',
    reporterContact: '0812-9876-5432',
    district: 'Tarogong Kidul',
    latitude: -7.2210,
    longitude: 107.8965,
    description: 'Tembok penahan drainase jebol sepanjang 12 meter akibat luapan hujan deras. Genangan air meluap menutup setengah badan jalan utama.',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80'
    ],
    severity: 'berat',
    riskAssessment: {
      potentialDangerScore: 9,
      impactedPeopleCount: 1500,
      isVitalRoute: true
    },
    priorityScore: 92,
    priorityRationale: 'Risiko banjir luapan ke pemukiman padat & memutus jalan protokol Cimanuk (Skor Dampak: 92/100).',
    status: 'terverifikasi',
    createdAt: '2026-07-20 08:30',
    estimatedCompletionDays: 3
  },
  {
    id: 'LPR-2026-0039',
    assetId: 'AST-GRT-JLN-001',
    assetName: 'Ruas Jalan Raya Samarang (Km 4 - Km 8)',
    reporterName: 'Ahmad Supardi',
    reporterContact: '0857-1122-3344',
    district: 'Tarogong Kidul',
    latitude: -7.2145,
    longitude: 107.8890,
    description: 'Terdapat 4 lubang menganga berdiameter 60cm - 1m di dekat persimpangan Samarang. Membahayakan pengendara sepeda motor malam hari.',
    photos: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
    ],
    severity: 'sedang',
    riskAssessment: {
      potentialDangerScore: 7,
      impactedPeopleCount: 3000,
      isVitalRoute: true
    },
    priorityScore: 78,
    priorityRationale: 'Jalur pariwisata utama menuju Samarang/Kamojang. Potensi kecelakaan roda dua tinggi.',
    status: 'proses_spk',
    createdAt: '2026-07-19 14:15',
    estimatedCompletionDays: 2
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'SPK-PUPR-2026-088',
    reportId: 'LPR-2026-0041',
    assetId: 'AST-GRT-DRN-015',
    title: 'Penanganan Darurat Perbaikan Pasangan Batu Drainase Jalan Cimanuk',
    assignedTeam: 'Tim Reaksi Cepat UPL 1 Bina Marga & SDA',
    leaderName: 'Agus Kurnia, A.Md.T.',
    startDate: '2026-07-21',
    targetEndDate: '2026-07-24',
    requiredMaterials: [
      { materialName: 'Semen Portland', qty: 45, unit: 'sak' },
      { materialName: 'Pasir Pasang', qty: 8, unit: 'm3' },
      { materialName: 'Batu Kali', qty: 15, unit: 'm3' },
      { materialName: 'U-Ditch Heavy Duty 100x100', qty: 10, unit: 'unit' }
    ],
    safetyProtocols: [
      'Wajib Helm & Sepatu Boot Safety',
      'Pemasangan Barikade Kerucut Lalu Lintas',
      'Penyediaan Pompa Sedot Air Darurat'
    ],
    status: 'dalam_pengerjaan',
    beforePhotos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80'
    ],
    inProgressPhotos: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    afterPhotos: [],
    fieldNotes: 'Galian pondasi selesai 60%. Material U-Ditch telah tiba di lokasi. Pompa berjalan lancar.'
  }
];

export const INITIAL_BUILDING_CASES: BuildingCase[] = [
  {
    id: 'GRD-BGN-2026-0142',
    simbgReferenceNo: 'SIMBG-PBG-GRT-2026-8821',
    applicantName: 'PT Garut Plaza Mandiri (u.p. Budi Santoso)',
    applicantNik: '3205121985040001',
    applicantPhone: '0811-2233-4455',
    buildingName: 'Pusat Perbelanjaan & Hotel Garut Grand City',
    buildingFunction: 'Usaha',
    district: 'Tarogong Kidul',
    address: 'Jl. Otista No. 142, Tarogong Kidul, Garut',
    latitude: -7.2160,
    longitude: 107.8920,
    applicationType: 'PBG',
    buildingAreaSqm: 3850,
    floorsCount: 4,
    submittedAt: '2026-07-15 10:00',
    status: 'penilaian_paralel',
    documents: [
      { docName: 'Gambar Arsitektur & Denah Struktur', fileUrl: 'https://example.com/doc1.pdf', status: 'sesuai' },
      { docName: 'Dokumen Kerangka AMDAL / UKL-UPL (DLH)', fileUrl: 'https://example.com/doc2.pdf', status: 'perlu_perbaikan', notes: 'Kurang peta buffer limbah cair.' },
      { docName: 'Analisis Dampak Lalu Lintas / ANDALALIN (Dishub)', fileUrl: 'https://example.com/doc3.pdf', status: 'sesuai' },
      { docName: 'Rekomendasi Proteksi Kebakaran (Satpol PP/Damkar)', fileUrl: 'https://example.com/doc4.pdf', status: 'sesuai' }
    ],
    opdAssessments: [
      {
        opdId: 'OPD-PUPR',
        opdName: 'Dinas PUPR - Bidang Tata Bangunan',
        requiredRationale: 'Wajib Verifikasi Koefisien Dasar Bangunan (KDB) & Garis Sempadan Bangunan (GSB)',
        status: 'disetujui',
        assessorName: 'H. Asep Nurdin, S.T.',
        reviewedAt: '2026-07-16 11:30',
        score: 95,
        notes: 'Perhitungan KDB 60% dan GSB 12 meter sesuai RTRW Kabupaten Garut.',
        technicalCorrections: [],
        slaHoursLeft: 48
      },
      {
        opdId: 'OPD-DLH',
        opdName: 'Dinas Lingkungan Hidup (DLH)',
        requiredRationale: 'Luas lantai > 3.000m² wajib evaluasi sistem pengelolaan air limbah B3 & TPS-3R',
        status: 'perlu_revisi',
        assessorName: 'Dr. Yudi Hendra, M.Si.',
        reviewedAt: '2026-07-17 14:00',
        score: 70,
        notes: 'Dibutuhkan revisi pada kapasitas Grease Trap restoran lantai 1 dan penambahan titik TPS B3.',
        technicalCorrections: [
          {
            requirement: 'Kapasitas Instalasi Pengolahan Air Limbah (IPAL) Basah',
            finding: 'Kapasitas bak pengendap hanya 10m3/hari.',
            correctionNeeded: 'Tambahkan bak aerasi sekunder minimum 18m3/hari agar sesuai ambang baku mutu Perda LH Garut.'
          }
        ],
        slaHoursLeft: 12
      },
      {
        opdId: 'OPD-DISHUB',
        opdName: 'Dinas Perhubungan (Dishub)',
        requiredRationale: 'Beban bangkitan lalu lintas > 500 kendaraan/hari pada jalan arteri Tarogong',
        status: 'disetujui',
        assessorName: 'Rahmat Hidayat, S.SIT.',
        reviewedAt: '2026-07-18 09:15',
        score: 90,
        notes: 'Rekomendasi Andalalin disetujui dengan catatan penyediaan pintu masuk/keluar terpisah.',
        technicalCorrections: [],
        slaHoursLeft: 36
      }
    ],
    unifiedCorrections: [
      {
        id: 'CORR-001',
        opdOrigin: 'Dinas Lingkungan Hidup (DLH)',
        category: 'Sanitasi & Lingkungan',
        description: 'Tingkatkan kapasitas bak aerasi IPAL menjadi 18m3/hari dan lampirkan layout TPS Limbah B3.',
        isConflictOrDuplicate: false,
        isResolvedByApplicant: false
      }
    ],
    inspectionSchedule: {
      date: '2026-07-23',
      time: '09:00 WIB',
      assignedAgencies: ['Dinas PUPR', 'DLH', 'Dishub', 'Satpol PP'],
      inspectorNames: ['Ir. H. Dede', 'Dr. Yudi Hendra', 'Rahmat Hidayat'],
      isCompleted: false
    }
  },
  {
    id: 'GRD-BGN-2026-0138',
    simbgReferenceNo: 'SIMBG-SLF-GRT-2026-3390',
    applicantName: 'Klinik Medika Pratama Garut',
    applicantNik: '3205011209780002',
    applicantPhone: '0812-3344-5566',
    buildingName: 'Gedung Klinik Rawat Inap 3 Lantai',
    buildingFunction: 'Sosial_Budaya',
    district: 'Garut Kota',
    address: 'Jl. Cimanuk No. 88, Garut Kota',
    latitude: -7.2180,
    longitude: 107.9010,
    applicationType: 'SLF',
    buildingAreaSqm: 850,
    floorsCount: 3,
    submittedAt: '2026-07-10 14:20',
    status: 'rekomendasi_terbit',
    documents: [
      { docName: 'As-Built Drawing & Sertifikat Keselamatan Strukturnya', fileUrl: 'https://example.com/doc_slf1.pdf', status: 'sesuai' }
    ],
    opdAssessments: [
      {
        opdId: 'OPD-PUPR',
        opdName: 'Dinas PUPR',
        requiredRationale: 'Pemeriksaan Kelaikan Keandalan Bangunan Gedung (SLF)',
        status: 'disetujui',
        score: 98,
        notes: 'Seluruh aspek keselamatan, kesehatan, kenyamanan, dan kemudahan telah memenuhi standar.',
        technicalCorrections: [],
        slaHoursLeft: 0
      }
    ],
    unifiedCorrections: [],
    inspectionSchedule: {
      date: '2026-07-14',
      time: '10:00 WIB',
      assignedAgencies: ['Dinas PUPR', 'Dinas Kesehatan'],
      inspectorNames: ['Agus Kurnia, A.Md.T.'],
      bapNumber: 'BAP-SLF-GRT-2026-044',
      bapSummary: 'Inspeksi lapangan mengonfirmasi sistem proteksi kebakaran aktif, jalur evakuasi bebas rintangan, dan ram disabilitas tersedia.',
      isCompleted: true
    },
    recommendationDoc: {
      docNo: 'REK-PUPR-GRT-2026-091',
      issuedAt: '2026-07-16',
      validUntil: '2031-07-16',
      digitalSignatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      signedBy: 'Ir. Risa Kristalia N., ST., MT. (Kepala Dinas PUPR)',
      qrVerificationUrl: 'https://garda.garutkab.go.id/verify/doc/REK-PUPR-GRT-2026-091',
      simbgSyncStatus: 'synced',
      simbgSyncedAt: '2026-07-16 16:45:12'
    }
  }
];

export const INITIAL_GATEWAY_ENDPOINTS: GatewayEndpointStatus[] = [
  {
    id: 'EP-001',
    systemName: 'SIMBG KemenPUPR / Kemendagri Central API',
    endpointUrl: 'https://simbg.pu.go.id/api/v3/garut-gateway',
    protocol: 'REST_JSON',
    status: 'online',
    latencyMs: 142,
    lastHeartbeat: '2026-07-21 12:50:00',
    pendingQueueCount: 0,
    successRatePercent: 99.8
  },
  {
    id: 'EP-002',
    systemName: 'Sistem Informasi Dinas LH Garut (AMDAL Online)',
    endpointUrl: 'https://dlh.garutkab.go.id/api/v1/rekomendasi',
    protocol: 'REST_JSON',
    status: 'online',
    latencyMs: 88,
    lastHeartbeat: '2026-07-21 12:51:10',
    pendingQueueCount: 0,
    successRatePercent: 98.5
  },
  {
    id: 'EP-003',
    systemName: 'Satu Data Garut / GIS Infrastruktur Bappeda',
    endpointUrl: 'https://satudata.garutkab.go.id/geoserver/wfs',
    protocol: 'REST_JSON',
    status: 'online',
    latencyMs: 210,
    lastHeartbeat: '2026-07-21 12:48:30',
    pendingQueueCount: 0,
    successRatePercent: 99.1
  },
  {
    id: 'EP-004',
    systemName: 'SIMPAD/BAPENDA Garut (Verifikasi PBB & Retribusi)',
    endpointUrl: 'https://bapenda.garutkab.go.id/api/tax-verify',
    protocol: 'REST_JSON',
    status: 'online',
    latencyMs: 115,
    lastHeartbeat: '2026-07-21 12:52:00',
    pendingQueueCount: 0,
    successRatePercent: 97.9
  }
];

export const INITIAL_GATEWAY_QUEUE: GatewayQueueItem[] = [
  {
    id: 'Q-9912',
    targetSystem: 'SIMBG KemenPUPR',
    action: 'SYNC_PBG_RECOMMENDATION',
    payloadSummary: 'Mengirim Berita Acara Rekomendasi Terpadu No: REK-PUPR-GRT-2026-091 untuk Kasus SIMBG-SLF-GRT-2026-3390',
    status: 'completed',
    retryCount: 0,
    createdAt: '2026-07-16 16:45:00',
    lastAttemptAt: '2026-07-16 16:45:12'
  },
  {
    id: 'Q-9915',
    targetSystem: 'Satu Data Garut / GIS',
    action: 'BROADCAST_ASSET_ALERT',
    payloadSummary: 'Sinkronisasi Pembaharuan Status Aset AST-GRT-DRN-015 (Kerusakan Berat -> Perbaikan)',
    status: 'completed',
    retryCount: 0,
    createdAt: '2026-07-20 09:00:00',
    lastAttemptAt: '2026-07-20 09:00:05'
  }
];

export const INITIAL_SECURITY_LOGS: SecurityEventLog[] = [
  {
    id: 'SEC-8801',
    timestamp: '2026-07-21 12:40:15',
    ipAddress: '103.140.22.18',
    userEmail: 'risa.kristalia@garutkab.go.id',
    eventType: 'AUTHENTICATION_2FA',
    severity: 'info',
    details: 'Login sukses dengan verifikasi 2FA TOTP BSrE.'
  },
  {
    id: 'SEC-8802',
    timestamp: '2026-07-21 11:15:30',
    ipAddress: '182.253.11.90',
    userEmail: 'system.gateway@garda.garutkab.go.id',
    eventType: 'SIMBG_SYNC_DISPATCH',
    severity: 'info',
    details: 'Penerjemah skema Gateway otomatis berhasil mengonversi format JSON GARDA ke Schema SIMBG v3.0.'
  },
  {
    id: 'SEC-8803',
    timestamp: '2026-07-20 23:12:04',
    ipAddress: '180.252.88.10',
    userEmail: 'unknown',
    eventType: 'UNAUTHORIZED_ACCESS_BLOCKED',
    severity: 'warning',
    details: 'Upaya pemanggilan API tanpa Token Bearer Valid pada endpoint /api/gateway/admin berhasil diblokir Firewall GARDA.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-501',
    timestamp: '2026-07-21 10:12:44',
    actorName: 'Dadan Ramdani, S.T.',
    actorRole: 'Admin Layanan PUPR',
    module: 'GARDA_BANGUNAN',
    action: 'PENDAFTARAN_KASUS_BARU',
    targetRef: 'GRD-BGN-2026-0142',
    details: 'Menghubungkan Nomor SIMBG SIMBG-PBG-GRT-2026-8821 dan menetapkan 3 OPD Penelaah paralel.',
    ipAddress: '103.140.22.18'
  },
  {
    id: 'AUD-502',
    timestamp: '2026-07-20 08:35:10',
    actorName: 'Sujono (Masyarakat)',
    actorRole: 'Pemohon / Pelapor',
    module: 'GARDA_INFRA',
    action: 'INPUT_LAPORAN_KERUSAKAN',
    targetRef: 'LPR-2026-0041',
    details: 'Input Laporan Kerusakan Drainase Jalan Cimanuk via Scan QR Aset AST-GRT-DRN-015.',
    ipAddress: '114.125.44.89'
  },
  {
    id: 'AUD-503',
    timestamp: '2026-07-19 16:00:22',
    actorName: 'Ir. Risa Kristalia N., ST., MT.',
    actorRole: 'Pimpinan PUPR',
    module: 'GARDA_INFRA',
    action: 'TERBIT_SPK_PEMELIHARAAN',
    targetRef: 'SPK-PUPR-2026-088',
    details: 'Persetujuan Surat Perintah Kerja Penanganan Darurat Drainase Cimanuk.',
    ipAddress: '103.140.22.18'
  }
];
