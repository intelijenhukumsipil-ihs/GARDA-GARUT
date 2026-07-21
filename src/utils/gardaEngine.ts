import QRCode from 'qrcode';
import { DamageReport, BuildingCase, OPDRating, InfraAsset } from '../types';

/**
 * Priority Score Engine for GARDA INFRA
 * Calculates 1-100 priority based on:
 * - Potential danger score (1-10) -> 40% weight
 * - Impacted population (count) -> 30% weight
 * - Vital Route / Economic corridor -> 30% weight
 */
export function calculateInfraPriorityScore(
  potentialDanger: number,
  impactedCount: number,
  isVitalRoute: boolean
): { score: number; rationale: string } {
  const dangerWeight = (Math.min(Math.max(potentialDanger, 1), 10) / 10) * 40;
  
  let popScore = 0;
  if (impactedCount > 2000) popScore = 30;
  else if (impactedCount > 1000) popScore = 25;
  else if (impactedCount > 500) popScore = 20;
  else if (impactedCount > 100) popScore = 15;
  else popScore = 10;

  const routeScore = isVitalRoute ? 30 : 10;

  const score = Math.round(dangerWeight + popScore + routeScore);

  let rationale = `Skor Bahaya: ${potentialDanger}/10, Terdampak: ${impactedCount.toLocaleString('id-ID')} jiwa (${popScore} pt), Jalur Vital: ${isVitalRoute ? 'Ya' : 'Tidak'}.`;
  if (score >= 85) {
    rationale += ' DARURAT HIGH PRIORITY - Diperlukan SPK Penanganan Reaksi Cepat < 24 jam.';
  } else if (score >= 70) {
    rationale += ' PRIORITAS TINGGI - Penanganan dijadwalkan dalam minggu berjalan.';
  } else {
    rationale += ' PRIORITAS SEDANG/STANDAR - Penanganan masuk dalam jadwal pemeliharaan berkala.';
  }

  return { score, rationale };
}

/**
 * Generate QR Code Data URL
 */
export async function generateQrDataUrl(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 280,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('QR Generation Error', err);
    return '';
  }
}

/**
 * Encode GARDA INFRA Asset QR Payload
 */
export function buildAssetQrPayload(asset: InfraAsset): string {
  const payload = {
    v: '1.0',
    app: 'GARDA_GARUT_INFRA',
    kode_aset: asset.id,
    nama: asset.name,
    kategori: asset.category,
    kecamatan: asset.district,
    koordinat: `${asset.latitude},${asset.longitude}`,
    pengelola: asset.managingAgency,
    kondisi_terkini: asset.condition,
    tgl_update: asset.lastMaintenanceDate,
    url_lapor: `https://garda.garutkab.go.id/infra/report?assetId=${asset.id}`
  };
  return JSON.stringify(payload);
}

/**
 * Encode GARDA BANGUNAN Building Case QR Payload
 */
export function buildCaseQrPayload(buildingCase: BuildingCase): string {
  const payload = {
    v: '1.0',
    app: 'GARDA_GARUT_BANGUNAN',
    nomor_kasus_garda: buildingCase.id,
    nomor_referensi_simbg: buildingCase.simbgReferenceNo,
    pemohon: buildingCase.applicantName,
    bangunan: buildingCase.buildingName,
    jenis_permohonan: buildingCase.applicationType,
    status_proses: buildingCase.status,
    rekomendasi_no: buildingCase.recommendationDoc?.docNo || 'DALAM_PROSES',
    penandatangan: buildingCase.recommendationDoc?.signedBy || 'Dinas PUPR Garut',
    tte_hash: buildingCase.recommendationDoc?.digitalSignatureHash || 'PENDING_TTE',
    simbg_sync: buildingCase.recommendationDoc?.simbgSyncStatus || 'pending',
    verifikasi_url: `https://garda.garutkab.go.id/verify/doc?caseId=${buildingCase.id}`
  };
  return JSON.stringify(payload);
}

/**
 * Gateway Schema Translator: GARDA -> SIMBG API v3 Schema
 */
export function translateGardaToSimbgSchema(buildingCase: BuildingCase): object {
  return {
    simbg_gateway_version: '3.1.0-GARUT-PUPR',
    header: {
      pengirim: 'PUSAT_KENDALI_GARDA_GARUT',
      sistem_asal: 'GARDA_BANGUNAN_PUPR',
      timestamp_pengiriman: new Date().toISOString(),
      instansi_pemroses: 'Dinas PUPR Kabupaten Garut'
    },
    data_permohonan: {
      nomor_registrasi_simbg_v3: buildingCase.simbgReferenceNo,
      nomor_koordinasi_garda: buildingCase.id,
      jenis_dokumen_dimohon: buildingCase.applicationType,
      identitas_pemohon: {
        nama_lengkap: buildingCase.applicantName,
        nik: buildingCase.applicantNik,
        telepon: buildingCase.applicantPhone
      },
      spesifikasi_bangunan: {
        nama_bangunan: buildingCase.buildingName,
        fungsi_utama: buildingCase.buildingFunction,
        luas_lantai_m2: buildingCase.buildingAreaSqm,
        jumlah_lantai: buildingCase.floorsCount,
        lokasi: {
          kecamatan: buildingCase.district,
          alamat_lengkap: buildingCase.address,
          latitude: buildingCase.latitude,
          longitude: buildingCase.longitude
        }
      }
    },
    ringkasan_rekomendasi_terpadu_opd: buildingCase.opdAssessments.map(opd => ({
      opd_penelaah: opd.opdName,
      alasan_wajib_rekomendasi: opd.requiredRationale,
      status_persetujuan: opd.status,
      penelaah: opd.assessorName,
      catatan_teknis: opd.notes,
      koreksi_wajib: opd.technicalCorrections
    })),
    hasil_inspeksi_lapangan: buildingCase.inspectionSchedule?.isCompleted ? {
      nomor_bap: buildingCase.inspectionSchedule.bapNumber,
      tanggal_inspeksi: buildingCase.inspectionSchedule.date,
      ringkasan_bap: buildingCase.inspectionSchedule.bapSummary,
      tim_pemeriksa: buildingCase.inspectionSchedule.inspectorNames
    } : null,
    dokumen_rekomendasi_terpadu: buildingCase.recommendationDoc ? {
      nomor_surat: buildingCase.recommendationDoc.docNo,
      tanggal_terbit: buildingCase.recommendationDoc.issuedAt,
      berlaku_sampai: buildingCase.recommendationDoc.validUntil,
      digital_signature_tte_bsre: buildingCase.recommendationDoc.digitalSignatureHash,
      penandatangan_sah: buildingCase.recommendationDoc.signedBy
    } : null
  };
}

/**
 * Conflict & Duplicate Tagger for Unified Corrections
 */
export function consolidateOpdCorrections(opdAssessments: OPDRating[]): BuildingCase['unifiedCorrections'] {
  const consolidated: BuildingCase['unifiedCorrections'] = [];
  let idCounter = 1;

  opdAssessments.forEach(opd => {
    opd.technicalCorrections.forEach(corr => {
      // Check if duplicate or conflicting
      const existing = consolidated.find(c => 
        c.description.toLowerCase().includes(corr.requirement.toLowerCase()) ||
        corr.requirement.toLowerCase().includes(c.category.toLowerCase())
      );

      consolidated.push({
        id: `CORR-${String(idCounter++).padStart(3, '0')}`,
        opdOrigin: opd.opdName,
        category: corr.requirement,
        description: `${corr.finding} -> Perbaikan: ${corr.correctionNeeded}`,
        isConflictOrDuplicate: !!existing,
        resolutionNotes: existing ? 'Catatan beririsan dengan rekomendasi OPD lain. Koordinator menyatukan menjadi 1 instruksi revisi terpadu.' : undefined,
        isResolvedByApplicant: false
      });
    });
  });

  return consolidated;
}
