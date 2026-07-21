import React, { useState } from 'react';
import { 
  Server, 
  Activity, 
  RefreshCw, 
  Database, 
  FileCode, 
  Lock, 
  Play,
  Send,
  MessageSquare,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { GatewayEndpointStatus, GatewayQueueItem, SecurityEventLog } from '../../types';
import { translateGardaToSimbgSchema } from '../../utils/gardaEngine';
import { INITIAL_BUILDING_CASES } from '../../data/mockData';

interface GatewayDashboardProps {
  endpoints: GatewayEndpointStatus[];
  queue: GatewayQueueItem[];
  securityLogs: SecurityEventLog[];
  onRetryQueueItem: (id: string) => void;
}

export const GatewayDashboard: React.FC<GatewayDashboardProps> = ({
  endpoints,
  queue,
  securityLogs,
  onRetryQueueItem
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'whatsapp' | 'translator' | 'queue' | 'security'>('status');
  const [translationSample, setTranslationSample] = useState(
    JSON.stringify(translateGardaToSimbgSchema(INITIAL_BUILDING_CASES[0]), null, 2)
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [waSending, setWaSending] = useState(false);
  const [waResponse, setWaResponse] = useState<any>(null);

  const handleRunTranslatorDemo = async () => {
    setIsTranslating(true);
    try {
      const res = await fetch('/api/gateway/translate-simbg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData: INITIAL_BUILDING_CASES[0] })
      });
      const data = await res.json();
      if (data.simbgSchema) {
        setTranslationSample(JSON.stringify(data.simbgSchema, null, 2));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTestWhatsAppGateway = async () => {
    setWaSending(true);
    try {
      const res = await fetch('/api/gateway/whatsapp-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: '+62 812-2235-5822',
          messageType: 'SYSTEM_ALERT',
          data: {
            message: 'Uji Koneksi Gateway Server WhatsApp GARDA GARUT Berhasil Aktif.'
          }
        })
      });
      const data = await res.json();
      setWaResponse(data);
    } catch (e) {
      console.error(e);
    } finally {
      setWaSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Server className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-black tracking-tight uppercase italic text-white">Gateway Server Cerdas GARDA</h1>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Lapisan SPBE
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl font-medium">
            Arsitektur penghubung antara perangkat lapangan/pengguna, Pusat Data Garut, Gateway WhatsApp (+62 812-2235-5822), dan sistem resmi KemenPUPR (SIMBG). Pemilik & Pengembang Inovasi: <strong>Ir. Risa Kristalia N., ST., MT.</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs shrink-0">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Gateway WhatsApp Server</div>
            <div className="font-black text-emerald-400 text-sm">+62 812-2235-5822 (ONLINE)</div>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 gap-2 overflow-x-auto shadow-sm">
        {[
          { id: 'status', label: 'Status Server & Endpoint', icon: Server },
          { id: 'whatsapp', label: 'WhatsApp Gateway Server (+62 812-2235-5822)', icon: MessageSquare },
          { id: 'translator', label: 'Penerjemah Skema SIMBG v3', icon: FileCode },
          { id: 'queue', label: 'Antrean Cadangan (Zero Data Loss)', icon: Database },
          { id: 'security', label: 'Keamanan Cyber & Log Akses', icon: Lock }
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

      {/* TAB 1: ENDPOINT STATUS */}
      {activeTab === 'status' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {endpoints.map((ep) => (
            <div key={ep.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-black text-slate-800 block uppercase tracking-tight">{ep.systemName}</span>
                  <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[280px]">
                    {ep.endpointUrl}
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  {ep.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Protokol</span>
                  <span className="font-black text-slate-800">{ep.protocol}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Latensi</span>
                  <span className="font-black text-emerald-600">{ep.latencyMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Sukses Rate</span>
                  <span className="font-black text-blue-600">{ep.successRatePercent}%</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-bold uppercase flex justify-between pt-1">
                <span>Heartbeat: {ep.lastHeartbeat}</span>
                <span>Pending Queue: {ep.pendingQueueCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 1.5: WHATSAPP GATEWAY SERVER */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-3 py-1 rounded-full mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Terhubung ke Server WhatsApp +62 812-2235-5822</span>
              </div>
              <h2 className="text-lg font-black text-slate-800 uppercase italic">
                Pusat Kendali Gateway WhatsApp GARDA GARUT
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Notifikasi otomatis laporan kerusakan infrastruktur, peringatan SLA, dan bukti terbit rekomendasi perizinan SIMBG dikirimkan melalui server WhatsApp ini.
              </p>
            </div>

            <button
              onClick={handleTestWhatsAppGateway}
              disabled={waSending}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow transition flex items-center space-x-2 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>{waSending ? 'Mengirim Sinyal...' : 'Uji Kirim Notifikasi WA (+62 812-2235-5822)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest block">Nomor Gateway Utama</span>
              <div className="text-lg font-black text-slate-900 font-mono">+62 812-2235-5822</div>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                Status: ACTIVE RUNNING
              </span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest block">Format Pesan Auto-Bot</span>
              <div className="text-sm font-black text-slate-800">[GARDA GARUT - NOTIFIKASI SPBE]</div>
              <p className="text-[11px] text-slate-500">Kirim otomatis via API Endpoint /api/gateway/whatsapp-send</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest block">Inovator & Pengembang</span>
              <div className="text-xs font-black text-slate-900">Ir. Risa Kristalia N., ST., MT.</div>
              <p className="text-[10px] text-slate-500 font-bold">Dinas PUPR Kabupaten Garut</p>
            </div>

          </div>

          {/* Test Result Display */}
          {waResponse && (
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-black uppercase">Hasil Pengujian Connection Test:</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                  ID: {waResponse.messageId}
                </span>
              </div>
              <p className="text-slate-300">{waResponse.message}</p>
              <div className="bg-black/50 p-3 rounded-xl text-[11px] text-slate-300 whitespace-pre-wrap border border-slate-800">
                {waResponse.fullMessage}
              </div>
              <div className="pt-1">
                <a
                  href={waResponse.waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-xl hover:bg-emerald-400 transition"
                >
                  <span>Buka Chat Langsung di WhatsApp (+62 812-2235-5822)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: FORMAT TRANSLATOR */}
      {activeTab === 'translator' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-800 uppercase italic">Simulator Penerjemah Format SIMBG v3.0</h2>
              <p className="text-xs text-slate-500 font-medium">
                Penerjemah format data otomatis menyatukan rekomendasi internal GARDA dan mengirimkan payload siap-pakai ke SIMBG tanpa mengubah substansi.
              </p>
            </div>
            <button
              onClick={handleRunTranslatorDemo}
              disabled={isTranslating}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-widest px-5 py-3 rounded-2xl shadow transition flex items-center space-x-2 cursor-pointer shrink-0"
            >
              {isTranslating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span>Jalankan Uji Penerjemahan</span>
            </button>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400 max-h-96">
            <pre>{translationSample}</pre>
          </div>
        </div>
      )}

      {/* TAB 3: QUEUE BUFFER */}
      {activeTab === 'queue' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-800 uppercase italic">Penyimpanan Sementara & Resilient Auto-Retry</h2>
            <p className="text-xs text-slate-500 font-medium">
              Data disimpan dalam buffer terenkripsi secara otomatis jika koneksi SIMBG atau dinas terputus, dan dikirimkan ulang begitu sistem kembali online.
            </p>
          </div>

          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-800">{item.id}</span>
                    <span className="text-xs font-black text-emerald-600">→ {item.targetSystem}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-black uppercase">
                      {item.action}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{item.payloadSummary}</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Dibuat: {item.createdAt}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                    item.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                  {item.status === 'failed_retrying' && (
                    <button
                      onClick={() => onRetryQueueItem(item.id)}
                      className="bg-slate-800 hover:bg-black text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      Kirim Ulang
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & CYBER */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-black text-slate-800 uppercase italic">Log Pengaman Cyber & Pemblokiran Terstruktur</h2>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
            {securityLogs.map((sec) => (
              <div key={sec.id} className="p-4 flex items-start justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-800 font-black">{sec.timestamp}</span>
                    <span className="font-mono text-slate-500">IP: {sec.ipAddress}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                      sec.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      sec.severity === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {sec.eventType}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">{sec.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

