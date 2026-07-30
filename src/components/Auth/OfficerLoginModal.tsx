import React, { useState } from 'react';
import { Lock, ShieldCheck, Eye, EyeOff, AlertCircle, X, CheckCircle2, UserCheck } from 'lucide-react';
import { UserProfile } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';

interface OfficerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: UserProfile;
  onSuccessLogin: (user: UserProfile) => void;
}

export const OfficerLoginModal: React.FC<OfficerLoginModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onSuccessLogin
}) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile>(
    targetUser || INITIAL_USERS[0]
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync selected user if targetUser prop changes
  React.useEffect(() => {
    if (targetUser) {
      setSelectedUser(targetUser);
    }
  }, [targetUser]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Default Officer Password validation (Secret Passcode: garda2026 or pupr2026 or admin123 or custom set)
    const customPassword = localStorage.getItem('garda_officer_password');
    const validPasswords = ['garda2026', 'pupr2026', 'admin123', 'puprgarut'];
    if (customPassword) {
      validPasswords.push(customPassword.trim().toLowerCase());
    }

    if (!password.trim()) {
      setErrorMsg('Masukkan kata sandi/password petugas!');
      return;
    }

    if (validPasswords.includes(password.trim().toLowerCase())) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccessLogin(selectedUser);
        setIsSuccess(false);
        setPassword('');
        setErrorMsg('');
        onClose();
      }, 700);
    } else {
      setErrorMsg('Password Petugas Salah! Hanya petugas berwenang yang dapat mengakses.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-400 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Autentikasi Petugas</span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white uppercase italic mt-1">
                Login Akses Petugas PUPR
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-2 font-medium">
            Area khusus Aparatur / Tim Teknis Dinas PUPR. Masukkan kata sandi rahasia petugas untuk melanjutkan.
          </p>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
          
          {/* Target User Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Pilih Akun Petugas:</span>
            </label>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {INITIAL_USERS.filter(u => u.role !== 'pemohon').map((u) => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition cursor-pointer text-left ${
                    selectedUser.id === u.id
                      ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-emerald-500/50'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs font-black truncate">{u.name}</p>
                      <p className={`text-[10px] truncate ${selectedUser.id === u.id ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                        {u.agency}
                      </p>
                    </div>
                  </div>
                  {selectedUser.id === u.id && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Masked Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-600" />
                <span>Kata Sandi / Password Petugas:</span>
              </label>
              <span className="text-[10px] text-slate-400 font-semibold italic">Disembunyikan 🔒</span>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-2xl px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono tracking-wider transition shadow-inner"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-2xl animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Autentikasi Berhasil! Mengalihkan ke akun petugas...</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-3 rounded-2xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Login Petugas</span>
            </button>
          </div>

          <div className="text-center pt-1 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-medium">
              🔒 Keamanan Terjaga: Kata sandi hanya dimiliki oleh Petugas PUPR Kabupaten Garut.
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};
