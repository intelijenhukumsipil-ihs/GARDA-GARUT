import React from 'react';
import { 
  LayoutDashboard, 
  Server, 
  HardHat, 
  Building2, 
  MapPin, 
  QrCode, 
  BarChart3, 
  ShieldAlert, 
  BookOpen,
  Info
} from 'lucide-react';

export type TabType = 
  | 'dashboard'
  | 'gateway'
  | 'infra'
  | 'bangunan'
  | 'map'
  | 'qr'
  | 'reports'
  | 'audit'
  | 'spec';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  reportCount: number;
  caseCount: number;
  queueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  reportCount,
  caseCount,
  queueCount
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Command Center',
      sublabel: 'Dasbor Utama',
      icon: LayoutDashboard,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'gateway',
      label: 'Gateway Server',
      sublabel: 'Server Gateway Cerdas',
      icon: Server,
      badge: queueCount > 0 ? queueCount : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'infra',
      label: 'GARDA INFRA',
      sublabel: 'Aset & Pemeliharaan',
      icon: HardHat,
      badge: reportCount > 0 ? reportCount : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 'bangunan',
      label: 'GARDA BANGUNAN',
      sublabel: 'SIMBG & Rekomendasi',
      icon: Building2,
      badge: caseCount > 0 ? caseCount : null,
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 'map',
      label: 'Peta Interaktif',
      sublabel: 'GIS & Heatmap',
      icon: MapPin,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'qr',
      label: 'Generator & Scan QR',
      sublabel: 'Verifikasi Unik',
      icon: QrCode,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'reports',
      label: 'Laporan & Ekspor',
      sublabel: 'Analytics PUPR',
      icon: BarChart3,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'audit',
      label: 'Audit Log & SPBE',
      sublabel: 'Keamanan System',
      icon: ShieldAlert,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'spec',
      label: 'Spesifikasi Teknis',
      sublabel: 'Dokumen Inovasi',
      icon: BookOpen,
      badge: 'DOCS',
      badgeColor: 'bg-amber-400 text-slate-950 font-black'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-5rem)] select-none">
      
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="text-emerald-400 font-black text-3xl leading-none tracking-tighter mb-1">
            GARDA
          </div>
          <div className="text-white font-black text-3xl leading-none tracking-tighter">
            GARUT
          </div>
          <div className="text-slate-400 text-[10px] uppercase tracking-widest mt-3 font-bold">
            Layanan Cerdas & Terpadu PUPR
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          <div className="px-3 py-1.5 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Menu Utama
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-3 text-left min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <div className="text-xs font-bold tracking-wide truncate">{item.label}</div>
                    {item.sublabel && (
                      <div className="text-[10px] text-slate-500 font-normal truncate">
                        {item.sublabel}
                      </div>
                    )}
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-5 border-t border-slate-800 bg-slate-950/60">
        <div className="text-slate-500 text-[10px] mb-1 font-bold uppercase tracking-widest">
          Pengembang
        </div>
        <div className="text-white font-bold text-xs uppercase truncate">
          PT Cakrawala Dzikra Teknologi
        </div>
        <div className="text-slate-400 text-[10px] mt-1 italic">
          Pemilik: Ir. Risa Kristalia N., ST., MT.
        </div>
      </div>

    </aside>
  );
};

