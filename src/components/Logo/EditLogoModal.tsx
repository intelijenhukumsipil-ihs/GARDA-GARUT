import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  RotateCcw, 
  Check, 
  Image as ImageIcon, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../../types';
import { GARDA_LOGO_IMAGE } from '../../assets/imagesData';
import { saveAppLogo, resetAppLogo } from '../../services/storage';

interface EditLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string;
  currentUser: UserProfile;
  onLogoUpdated: (newLogo: string) => void;
  onSwitchToAdmin?: () => void;
}

export const EditLogoModal: React.FC<EditLogoModalProps> = ({
  isOpen,
  onClose,
  currentLogo,
  currentUser,
  onLogoUpdated,
  onSwitchToAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [previewLogo, setPreviewLogo] = useState<string>(currentLogo);
  const [urlInput, setUrlInput] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current user has admin rights
  const isAdmin = currentUser.role === 'admin_layanan' || currentUser.role === 'pimpinan';

  // Presets of official logos
  const logoPresets = [
    {
      id: 'default',
      name: 'GARDA GARUT Standar (Resmi)',
      description: 'Emblem Resmi Emas & Hijau Dinas PUPR',
      src: GARDA_LOGO_IMAGE,
      tag: 'Bawaan'
    },
    {
      id: 'formal',
      name: 'Logo Formal Dinas PUPR Garut',
      description: 'Lambang PUPR Klasik & Garut',
      src: '/garda-formal.jpg',
      tag: 'PUPR'
    },
    {
      id: 'spbe',
      name: 'Simbol Digital SPBE Terpadu',
      description: 'Lencana Modern Koordinasi SPBE',
      src: '/garda-spbe.jpg',
      tag: 'SPBE Digital'
    },
    {
      id: 'emblem',
      name: 'Lambang Pemkab Garut',
      description: 'Lambang Daerah Kabupaten Garut',
      src: '/garda-emblem.jpg',
      tag: 'Pemkab Garut'
    }
  ];

  if (!isOpen) return null;

  // Process file upload with optional canvas resize for localStorage efficiency
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap pilih file gambar yang valid (PNG, JPG, SVG, WebP).');
      return;
    }

    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      // If image is larger than 800KB, resize via canvas to save localStorage space
      if (file.size > 800 * 1024) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.88);
            setPreviewLogo(compressed);
          } else {
            setPreviewLogo(result);
          }
        };
        img.src = result;
      } else {
        setPreviewLogo(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput || urlInput.trim().length === 0) {
      setErrorMessage('Masukkan URL gambar terlebih dahulu.');
      return;
    }
    setErrorMessage(null);
    setPreviewLogo(urlInput.trim());
    setFileName('URL Eksternal');
    setFileSize('Web Link');
  };

  const handleSelectPreset = (src: string, name: string) => {
    setErrorMessage(null);
    setPreviewLogo(src);
    setFileName(name);
    setFileSize('Preset Resmi');
  };

  const handleSaveLogo = () => {
    if (!isAdmin) {
      setErrorMessage('Hanya Administrator atau Pimpinan yang dapat mengubah logo resmi.');
      return;
    }

    try {
      saveAppLogo(previewLogo, currentUser.name, currentUser.role);
      onLogoUpdated(previewLogo);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (e) {
      setErrorMessage('Terjadi kendala saat menyimpan logo ke penyimpanan sistem.');
    }
  };

  const handleResetDefault = () => {
    if (!isAdmin) {
      setErrorMessage('Hanya Administrator atau Pimpinan yang dapat mereset logo.');
      return;
    }

    try {
      resetAppLogo(currentUser.name, currentUser.role);
      setPreviewLogo(GARDA_LOGO_IMAGE);
      setFileName('Default Resmi');
      setFileSize('Bawaan');
      onLogoUpdated(GARDA_LOGO_IMAGE);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (e) {
      setErrorMessage('Gagal mereset logo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-4 sm:p-6 border-b border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight uppercase truncate">
                  Edit & Ubah Logo Sistem
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
                  Admin PUPR
                </span>
              </div>
              <p className="text-slate-300 text-xs truncate">
                Sesuaikan logo resmi GARDA GARUT pada Navbar, Sidebar, dan Dasbor Utama
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700/60 transition cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Authorization Status Bar */}
        <div className={`px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs border-b ${
          isAdmin ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'
        }`}>
          <div className="flex items-center space-x-2">
            {isAdmin ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Otoritas Terverifikasi: <strong>{currentUser.name}</strong> ({currentUser.agency})
                </span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Peran saat ini: <strong>{currentUser.name}</strong> ({currentUser.role}). Mode terbatas.
                </span>
              </>
            )}
          </div>

          {!isAdmin && onSwitchToAdmin && (
            <button
              onClick={() => {
                onSwitchToAdmin();
              }}
              className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1 rounded-xl text-xs transition cursor-pointer shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Beralih ke Akun Admin PUPR</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">

          {/* Success Banner */}
          {saveSuccess && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-3.5 rounded-2xl flex items-center space-x-3 text-xs sm:text-sm font-bold animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Logo sistem berhasil disimpan dan langsung diterapkan ke seluruh halaman!</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl flex items-center space-x-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Top Grid: Live Previews in Different Contexts */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pratinjau Langsung (Live Preview)</span>
              </span>
              {fileName && (
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                  {fileName} ({fileSize})
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* Context 1: Navbar Preview */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Tampilan di Navbar
                </span>
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200 w-full justify-center">
                  <div className="w-9 h-9 rounded-xl bg-white p-0.5 border border-slate-300 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={previewLogo}
                      alt="Preview Navbar"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left leading-tight">
                    <div className="text-[11px] font-black text-slate-800">GARDA GARUT</div>
                    <div className="text-[9px] text-slate-400 font-medium">Dinas PUPR Garut</div>
                  </div>
                </div>
              </div>

              {/* Context 2: Sidebar Preview */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm text-white">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Tampilan di Sidebar
                </span>
                <div className="flex items-center space-x-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700 w-full justify-center">
                  <div className="w-10 h-10 rounded-2xl bg-white p-1 shadow-md border border-slate-600 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={previewLogo}
                      alt="Preview Sidebar"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left leading-tight">
                    <div className="text-xs font-black text-emerald-400">GARDA GARUT</div>
                    <div className="text-[8px] text-slate-400">PUPR KAB. GARUT</div>
                  </div>
                </div>
              </div>

              {/* Context 3: Hero Banner Preview */}
              <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-800/40 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm text-white">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-2">
                  Tampilan Dasbor Banner
                </span>
                <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-emerald-400 shadow-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={previewLogo}
                    alt="Preview Banner"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Navigation Tabs for Selection Methods */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-2.5 px-4 font-black text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              1. Unggah File Gambar
            </button>
            <button
              onClick={() => setActiveTab('preset')}
              className={`pb-2.5 px-4 font-black text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'preset'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              2. Pilihan Logo Resmi
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`pb-2.5 px-4 font-black text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'url'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              3. Tautan URL Gambar
            </button>
          </div>

          {/* Tab 1: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition duration-200 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition shadow-sm">
                  <Upload className="w-7 h-7" />
                </div>
                <div className="font-black text-sm text-slate-800 mb-1">
                  Klik untuk Memilih File atau Tarik & Lepas (Drag & Drop) ke Sini
                </div>
                <p className="text-xs text-slate-500 max-w-md">
                  Mendukung format <strong>PNG (disarankan transparan), JPG, SVG, WebP</strong>. Sistem akan mengoptimalkan resolusi logo secara otomatis.
                </p>
                <div className="mt-4 inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-sm text-xs font-bold text-slate-700 group-hover:border-emerald-500">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pilih Gambar dari Komputer / HP</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Logo Presets */}
          {activeTab === 'preset' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                Pilih salah satu template logo resmi yang telah disediakan untuk dinas:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {logoPresets.map((preset) => {
                  const isSelected = previewLogo === preset.src;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.src, preset.name)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={preset.src}
                          alt={preset.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-black text-slate-900 truncate">
                            {preset.name}
                          </h4>
                          <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                            {preset.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Direct URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Tautan / Link URL Gambar Logo:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://garutkab.go.id/images/logo-pupr.png"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                  <button
                    onClick={handleApplyUrl}
                    className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer transition shadow"
                  >
                    Uji & Tampilkan
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Pastikan tautan dapat diakses secara publik dan mengarah langsung ke file gambar (berakhiran .png, .jpg, dll).
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <button
            onClick={handleResetDefault}
            disabled={!isAdmin}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Kembalikan ke logo default asli"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembalikan ke Logo Standar</span>
          </button>

          <div className="w-full sm:w-auto flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              onClick={handleSaveLogo}
              disabled={!isAdmin}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Logo Baru</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
