import React, { useState, useEffect } from 'react';
import { Search, X, HardHat, Building2, ArrowRight } from 'lucide-react';
import { InfraAsset, BuildingCase, WorkOrder } from '../../types';
import { TabType } from '../Sidebar';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: InfraAsset[];
  buildingCases: BuildingCase[];
  workOrders: WorkOrder[];
  onSelectTab: (tab: TabType) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  buildingCases,
  workOrders,
  onSelectTab
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedAssets = assets.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.id.toLowerCase().includes(query.toLowerCase()));
  const matchedCases = buildingCases.filter(c => c.buildingName.toLowerCase().includes(query.toLowerCase()) || c.simbgReferenceNo.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-emerald-600 absolute left-4" />
          <input
            type="text"
            autoFocus
            placeholder="Ketik kata kunci aset, nomor SIMBG, atau ID SPK..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 pl-11 pr-10 py-3 rounded-2xl focus:outline-none focus:border-slate-800"
          />
          <button onClick={onClose} className="absolute right-4 text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto space-y-3 text-xs">
          
          {/* Matched Assets */}
          {matchedAssets.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-1">
                Aset Infrastruktur ({matchedAssets.length})
              </span>
              {matchedAssets.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  onClick={() => {
                    onSelectTab('infra');
                    onClose();
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <HardHat className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-black text-slate-800 uppercase block">{a.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">{a.id} • Kec. {a.district}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {/* Matched Cases */}
          {matchedCases.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-1">
                Permohonan SIMBG ({matchedCases.length})
              </span>
              {matchedCases.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectTab('bangunan');
                    onClose();
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-black text-slate-800 uppercase block">{c.buildingName}</span>
                      <span className="text-[10px] text-emerald-800 font-mono font-bold">{c.simbgReferenceNo} • {c.applicantName}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {matchedAssets.length === 0 && matchedCases.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase">
              Tidak ada data yang cocok dengan kata kunci "{query}"
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

