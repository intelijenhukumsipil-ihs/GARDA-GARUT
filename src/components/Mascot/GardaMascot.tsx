import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  HardHat, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Building2,
  MapPin,
  FileCheck
} from 'lucide-react';

interface GardaMascotProps {
  onNavigateTab?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mascot';
  text: string;
  timestamp: string;
  isSimulated?: boolean;
}

export const GardaMascot: React.FC<GardaMascotProps> = ({ onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'mascot',
      text: 'Sampurasun! 👷‍♂️ Wilujeng sumping di GARDA GARUT. Saya "Si GARDA", Maskot Pintar Dinas PUPR Kab. Garut. Ada yang bisa Si GARDA bantu mengenai layanan infrastruktur, perizinan SIMBG/PBG, atau WhatsApp Gateway Server?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle TTS
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      
      const cleanText = text.replace(/[*_#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (questionText?: string) => {
    const q = questionText || inputQuestion;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/mascot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: q,
          chatHistory: messages.map(m => ({ role: m.sender, text: m.text }))
        })
      });

      const data = await res.json();
      const mascotMsg: ChatMessage = {
        id: `mascot-${Date.now()}`,
        sender: 'mascot',
        text: data.reply || 'Mohon maaf, Si GARDA sedang mengalami kendala jaringan. Silakan tanyakan kembali!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: data.isSimulated
      };

      setMessages(prev => [...prev, mascotMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `mascot-err-${Date.now()}`,
          sender: 'mascot',
          text: 'Sampurasun! Si GARDA merekomendasikan Anda untuk langsung berkonsultasi via WhatsApp Gateway Server kami di +62 813-1640-3160.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'PBG SIMBG', icon: Building2, text: 'Bagaimana prosedur permohonan Rekomendasi PBG SIMBG di GARDA GARUT?' },
    { label: 'Lapor Jalan Rusak', icon: HardHat, text: 'Bagaimana cara melaporkan jalan atau jembatan rusak di Garut?' },
    { label: 'WA Gateway Server', icon: MessageSquare, text: 'Berapa nomor resmi WhatsApp Gateway Server Dinas PUPR Garut?' },
    { label: 'Cari Pengawas Kecamatan', icon: MapPin, text: 'Siapa saja pengawas PUPR di 42 kecamatan Kabupaten Garut?' },
    { label: 'Inovasi & Pengembang', icon: ShieldCheck, text: 'Siapa pengembang dan pemilik inovasi SPBE GARDA GARUT?' },
    { label: 'Verifikasi QR BSrE', icon: FileCheck, text: 'Bagaimana cara verifikasi Kode QR unik pada dokumen rekomendasi?' }
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
          {/* Animated Hint Bubble */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl border border-slate-800 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Tanya Si GARDA (Maskot PUPR)</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3.5 sm:p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-emerald-400/30 flex items-center justify-center"
            aria-label="Buka Maskot Si GARDA"
          >
            {/* Mascot SVG Face Badge */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <HardHat className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950" />
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-slate-900 uppercase">
              AI
            </span>
          </button>
        </div>
      )}

      {/* Mascot Chat Window Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[620px] z-50 bg-white sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-3">
              {/* Mascot Avatar Box */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative">
                  <HardHat className="w-6 h-6 text-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute bottom-0 right-0 animate-pulse"></span>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-black text-sm uppercase tracking-tight text-white">SI GARDA</h3>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Maskot PUPR
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium">Asisten Tanya-Jawab Cerdas Real-Time</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {/* Voice Button */}
              <button
                onClick={() => messages.length > 0 && speakText(messages[messages.length - 1].text)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isSpeaking ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Dengarkan Suara Si GARDA"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                aria-label="Tutup Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader info */}
          <div className="bg-emerald-950/90 border-b border-emerald-900/50 px-4 py-2 flex items-center justify-between text-[10px] text-emerald-200">
            <span className="font-medium">Gateway Server WA: +62 813-1640-3160</span>
            <span className="font-bold text-amber-300 uppercase">Ir. Risa Kristalia N.</span>
          </div>

          {/* Chat Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg) => {
              const isMascot = msg.sender === 'mascot';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMascot ? '' : 'flex-row-reverse'}`}
                >
                  {isMascot && (
                    <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <HardHat className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-1 ${isMascot ? '' : 'items-end'}`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed shadow-sm text-slate-800 ${
                        isMascot
                          ? 'bg-white border border-slate-200 rounded-tl-none font-medium'
                          : 'bg-emerald-600 text-white rounded-tr-none font-bold'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className={`text-[9px] text-slate-400 font-mono px-1 flex items-center space-x-1 ${isMascot ? 'justify-start' : 'justify-end'}`}>
                      <span>{msg.timestamp}</span>
                      {msg.isSimulated && (
                        <span className="text-[8px] bg-slate-200 text-slate-600 px-1 rounded font-bold">Respon Cerdas</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold italic bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Si GARDA sedang berpikir...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Container */}
          <div className="p-2.5 bg-white border-t border-slate-200 space-y-1.5 shrink-0">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block px-1">
              Topik Pertanyaan Cepat:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickPrompts.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.text)}
                    className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] px-2.5 py-1.5 rounded-xl transition cursor-pointer shrink-0 border border-slate-200"
                  >
                    <Icon className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Form */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0">
            <input
              type="text"
              placeholder="Tanya Si GARDA seputar PUPR, SIMBG, jalan..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputQuestion.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 p-2.5 rounded-xl transition cursor-pointer font-bold shrink-0"
              aria-label="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
