import React, { useState, useRef, useEffect } from 'react';
import gagaMascot from '../../assets/gaga-mascot.jpg';
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
  FileCheck,
  Bell,
  Radio
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'mascot',
      text: 'Sampurasun! 🤖 Wilujeng sumping di GARDA GARUT! Nama saya "GAGA", Maskot Pintar & Cerdas Dinas PUPR Kab. Garut. Ada yang bisa GAGA bantu mengenai layanan infrastruktur, perizinan SIMBG/PBG, atau WhatsApp Gateway Server?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Web Audio Synthesizer for Chime & Sound Notifications
  const playAudioChime = (type: 'open' | 'send' | 'reply' | 'toggle') => {
    if (!soundEnabled && type !== 'toggle') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'open') {
        // Bright 3-note ascending chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.18, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.32);
        });
      } else if (type === 'reply') {
        // Cheerful double melody (G5 -> C6)
        const notes = [783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + idx * 0.1;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.22, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.38);
        });
      } else if (type === 'send') {
        // Soft pop/swish audio tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'toggle') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (err) {
      console.warn('Audio chime notice:', err);
    }
  };

  const handleOpenMascot = () => {
    setIsOpen(true);
    playAudioChime('open');
    triggerNotification('🔔 Suara Notifikasi GAGA Aktif! Ada yang bisa GAGA bantu?');
  };

  const triggerNotification = (text: string) => {
    setNotificationToast(text);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // Listen to custom global trigger for Tanya GAGA
  useEffect(() => {
    const handleCustomOpen = () => {
      handleOpenMascot();
    };
    window.addEventListener('open-gaga-mascot', handleCustomOpen);
    return () => window.removeEventListener('open-gaga-mascot', handleCustomOpen);
  }, [soundEnabled]);

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

    playAudioChime('send');

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
      const replyContent = data.reply || getGagaFallbackAnswer(q);
      const mascotMsg: ChatMessage = {
        id: `mascot-${Date.now()}`,
        sender: 'mascot',
        text: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: data.isSimulated
      };

      setMessages(prev => [...prev, mascotMsg]);
      playAudioChime('reply');
      triggerNotification('📢 GAGA Menjawab! Silakan cek balasan.');
    } catch (err) {
      console.error(err);
      const fallbackReply = getGagaFallbackAnswer(q);
      setMessages(prev => [
        ...prev,
        {
          id: `mascot-err-${Date.now()}`,
          sender: 'mascot',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playAudioChime('reply');
      triggerNotification('📢 GAGA Menjawab! (Respon fallback aktif)');
    } finally {
      setIsLoading(false);
    }
  };

  const getGagaFallbackAnswer = (userQ: string): string => {
    const lq = (userQ || '').toLowerCase();
    if (lq.includes('simbg') || lq.includes('pbg') || lq.includes('izin') || lq.includes('bangunan') || lq.includes('slf') || lq.includes('gedung')) {
      return 'Sampurasun! GAGA di sini! 🤖\n\nUntuk Rekomendasi PBG/SLF di Dinas PUPR Garut, silakan buka modul **GARDA BANGUNAN**. Tim Teknis akan memverifikasi kelaikan & otomatis sinkron ke SIMBG KemenPUPR! WhatsApp Server: 08212234446 (+62 821-2234-4446).';
    }
    if (lq.includes('jalan') || lq.includes('rusak') || lq.includes('jembatan') || lq.includes('lapor') || lq.includes('irigasi') || lq.includes('infra')) {
      return 'Wilujeng sumping! GAGA siap bantu! 🚧👷‍♂️\n\nLaporkan jalan berlubang atau jembatan rusak via modul **GARDA INFRA**. Sertakan foto & kecamatan, laporan langsung diprioritaskan ke Pengawas PUPR setempat!';
    }
    if (lq.includes('wa') || lq.includes('whatsapp') || lq.includes('server') || lq.includes('nomor') || lq.includes('gateway')) {
      return 'Halo! Nomor resmi WhatsApp Gateway Server Dinas PUPR Garut: 📲 **08212234446** (+62 821-2234-4446). Server mengirim konfirmasi SLA perizinan & laporan!';
    }
    if (lq.includes('kecamatan') || lq.includes('pengawas') || lq.includes('peta') || lq.includes('wilayah')) {
      return 'GARDA GARUT menjangkau **42 Wilayah Kecamatan** di Kab. Garut! 🗺️ Anda bisa cek Peta & kontak Pengawas Lapangan PUPR di menu Peta 42 Kecamatan.';
    }
    return `Sampurasun! GAGA di sini! 🤖 Mengenai "${userQ}", GAGA siap bantu informasi perizinan PBG/SIMBG, laporan jalan rusak, Pengawas 42 Kecamatan, dan WA Server (08212234446).`;
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
          <div 
            onClick={handleOpenMascot}
            className="hidden sm:flex items-center space-x-2 bg-slate-900/95 hover:bg-slate-800 backdrop-blur text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700/80 animate-bounce cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Tanya GAGA (Maskot PUPR) 🤖 🔊</span>
          </div>

          <button
            onClick={handleOpenMascot}
            className="group relative bg-slate-900 hover:bg-slate-800 text-white p-1.5 sm:p-2 rounded-2xl shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-emerald-400/40 flex items-center justify-center border border-slate-700"
            aria-label="Buka Maskot GAGA"
          >
            {/* GAGA Mascot Avatar Icon */}
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 bg-slate-950 p-0.5 rounded-xl flex items-center justify-center overflow-hidden border border-emerald-500/50">
              <img 
                src={gagaMascot} 
                onError={(e) => { e.currentTarget.src = '/gaga-mascot.jpg'; }}
                alt="Maskot GAGA PUPR" 
                className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition duration-300" 
                referrerPolicy="no-referrer"
              />
              <Sparkles className="w-4 h-4 text-amber-400 absolute -top-0.5 -right-0.5 animate-pulse drop-shadow" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full border border-slate-900 uppercase shadow">
              GAGA
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
              {/* GAGA Mascot Logo Avatar Box */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-400 p-0.5 shadow-md flex items-center justify-center shrink-0 border border-slate-700 overflow-hidden relative">
                <img 
                  src={gagaMascot} 
                  onError={(e) => { e.currentTarget.src = '/gaga-mascot.jpg'; }}
                  alt="Maskot GAGA PUPR" 
                  className="w-full h-full object-cover rounded-xl" 
                  referrerPolicy="no-referrer"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute bottom-0 right-0 animate-pulse"></span>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-black text-base uppercase tracking-tight text-white flex items-center gap-1">
                    GAGA <span className="text-amber-400 text-xs">🤖</span>
                  </h3>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Maskot PUPR Garut
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium">Asisten Pintar SPBE & Infrastruktur Cerdas</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Sound Toggle Button */}
              <button
                onClick={() => {
                  const newSound = !soundEnabled;
                  setSoundEnabled(newSound);
                  playAudioChime('toggle');
                  triggerNotification(newSound ? '🔊 Suara Notifikasi Diaktifkan' : '🔇 Suara Notifikasi Dimatikan');
                }}
                className={`px-2 py-1 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  soundEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}
                title={soundEnabled ? 'Suara Notifikasi Aktif (Klik untuk Matikan)' : 'Suara Notifikasi Mati (Klik untuk Aktifkan)'}
              >
                {soundEnabled ? <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="text-[9px] font-bold uppercase">{soundEnabled ? 'Suara ON' : 'OFF'}</span>
              </button>

              {/* Voice Button */}
              <button
                onClick={() => messages.length > 0 && speakText(messages[messages.length - 1].text)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isSpeaking ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Dengarkan Suara GAGA (TTS)"
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

          {/* Toast Notification Alert Banner */}
          {notificationToast && (
            <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-bold text-[10px] px-3.5 py-1.5 flex items-center justify-between shadow-inner animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center space-x-1.5">
                <Bell className="w-3.5 h-3.5 text-slate-950 animate-bounce shrink-0" />
                <span>{notificationToast}</span>
              </div>
              <button onClick={() => setNotificationToast(null)} className="text-slate-950 hover:opacity-75 p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Subheader info */}
          <div className="bg-emerald-950/90 border-b border-emerald-900/50 px-4 py-2 flex items-center justify-between text-[10px] text-emerald-200">
            <span className="font-medium">Gateway Server WA: 08212234446</span>
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
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <img 
                        src={gagaMascot} 
                        onError={(e) => { e.currentTarget.src = '/gaga-mascot.jpg'; }}
                        alt="GAGA" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
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
                <span>GAGA sedang berpikir...</span>
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
              placeholder="Tanya GAGA seputar PUPR, SIMBG, jalan..."
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
