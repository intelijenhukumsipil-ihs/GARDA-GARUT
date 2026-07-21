import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  Search,
  Menu
} from 'lucide-react';
import { UserProfile } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface NavbarProps {
  currentUser: UserProfile;
  onRoleChange: (user: UserProfile) => void;
  onOpenQuickSearch: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleChange,
  onOpenQuickSearch,
  onToggleMobileMenu
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Laporan Kerusakan Baru', time: '10m lalu', text: 'Drainase Jl. Cimanuk jebol dilaporkan oleh warga.', type: 'urgent' },
    { id: 2, title: 'SLA Warning DLH', time: '25m lalu', text: 'Kasus GRD-BGN-2026-0142 sisa SLA 12 jam.', type: 'warning' },
    { id: 3, title: 'Sinkronisasi SIMBG Sukses', time: '1h lalu', text: 'Dokumen Rekomendasi REK-PUPR-GRT-2026-091 terverifikasi KemenPUPR.', type: 'info' }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white border-b border-slate-200 text-slate-800 shadow-sm flex items-center justify-between px-3 sm:px-6 lg:px-8">
      
      {/* Left: Hamburger Menu Button + Title */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition border border-slate-200 cursor-pointer shrink-0"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5 text-slate-800" />
        </button>

        {/* Title & Subtitle with Logo */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-0.5 border border-slate-200 shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
            <img 
              src="/garda-logo.jpg" 
              alt="Logo GARDA GARUT" 
              className="w-full h-full object-contain" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-700 font-black text-sm sm:text-base lg:hidden uppercase tracking-tight">GARDA GARUT</span>
              <h1 className="hidden lg:block text-base xl:text-lg font-black text-slate-800 tracking-tight uppercase truncate">
                DASHBOARD KOORDINASI TERPADU SPBE
              </h1>
            </div>
            <p className="text-slate-500 text-[10px] sm:text-xs font-semibold truncate">
              Dinas PUPR Kabupaten Garut
            </p>
          </div>
        </div>
      </div>

      {/* Center: Quick Search Button (Desktop) */}
      <div className="hidden lg:flex items-center space-x-6">
        <button
          onClick={onOpenQuickSearch}
          className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-bold transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Cari Aset, Kasus SIMBG, atau QR...</span>
          <kbd className="text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-300 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Connection Indicator */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            SIMBG Server
          </span>
          <div className="flex items-center text-emerald-600 font-black text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div>
            ONLINE v3.0
          </div>
        </div>
      </div>

      {/* Right Controls & Role Switcher */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        
        {/* Mobile Search Button Icon */}
        <button
          onClick={onOpenQuickSearch}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Notif Popup */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Notifikasi SPBE</span>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">3 Baru</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2 px-1 hover:bg-slate-50 rounded transition">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{n.text}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 text-center">
                <button onClick={() => setIsNotifOpen(false)} className="text-[11px] text-emerald-600 font-black uppercase hover:underline">
                  Tutup Notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center space-x-2 sm:space-x-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-left px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div className="hidden sm:block text-left pr-1">
              <div className="text-xs font-black text-slate-800 truncate max-w-[120px] lg:max-w-[140px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase truncate max-w-[120px] lg:max-w-[140px]">
                {currentUser.agency}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Role Switcher Dropdown */}
          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-3 space-y-2">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simulasi Role SPBE:</p>
                <p className="text-xs font-black text-slate-800">Pilih Peran Pengguna</p>
              </div>
              <div className="py-1 space-y-1 max-h-64 overflow-y-auto">
                {INITIAL_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onRoleChange(user);
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      user.id === currentUser.id 
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <img src={user.avatar} className="w-6 h-6 rounded-full" alt="" />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.agency}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

