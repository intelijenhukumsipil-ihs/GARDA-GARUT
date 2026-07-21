import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  ShieldCheck
} from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditTrailViewProps {
  auditLogs: AuditLog[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  auditLogs
}) => {
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(search.toLowerCase()) || 
                          log.actorName.toLowerCase().includes(search.toLowerCase()) ||
                          log.targetRef.toLowerCase().includes(search.toLowerCase());
    const matchesMod = selectedModule === 'all' || log.module === selectedModule;
    return matchesSearch && matchesMod;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-black tracking-tight uppercase italic text-white">Log Audit Permanen & Keamanan SPBE</h1>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl font-medium">
            Seluruh transaksi, persetujuan rekomendasi, perubahan status aset, dan sinkronisasi SIMBG dicatat secara permanen tanpa dapat diubah/dihapus (Immutable Log).
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white/10 px-4 py-3 rounded-2xl border border-white/15 text-xs text-emerald-300 font-black uppercase tracking-wider shrink-0 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified BSrE Seal</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari aktor, nomor referensi, atau aksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 pl-10 pr-4 py-2.5 rounded-xl font-medium focus:outline-none focus:border-slate-800"
          />
        </div>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs text-slate-800 px-4 py-2.5 rounded-xl font-bold w-full md:w-auto"
        >
          <option value="all">Semua Modul System</option>
          <option value="GARDA_INFRA">GARDA INFRA</option>
          <option value="GARDA_BANGUNAN">GARDA BANGUNAN</option>
          <option value="GATEWAY">GATEWAY SERVER</option>
          <option value="SYSTEM">AKSES SYSTEM</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-5 hover:bg-slate-50 transition space-y-1.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-emerald-700 font-black">{log.id}</span>
                  <span className="font-mono text-slate-400 font-bold">{log.timestamp}</span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-emerald-400 uppercase">
                    {log.module}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 font-bold">IP: {log.ipAddress}</span>
              </div>

              <p className="text-slate-800 font-black uppercase text-xs">{log.details}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
                <span>
                  Aktor: <strong className="text-slate-900 font-black">{log.actorName}</strong> ({log.actorRole})
                </span>
                <span className="font-mono text-emerald-800 font-bold">Ref: {log.targetRef}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

