import React, { useRef, useEffect, useState } from 'react';
import {
  Send,
  Loader2,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Mail,
} from 'lucide-react';
import { ChatMessage, TradingMode, AssetInfo, TradeSignal } from '../types';
import { SignalCard } from './SignalCard';
import { CoachDebriefCard } from './CoachDebriefCard';
import { CoachVoice } from '../utils/speech';

interface CoachChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  selectedAsset: AssetInfo;
  currentMode: TradingMode;
  onModeSelect: (mode: TradingMode) => void;
  uploadedImage: string | null;
  currentPrice: string;
  onSendSignalGmail: (signal: TradeSignal) => void;
  onSendTextGmail: (messageText: string) => void;
}

export const CoachChat: React.FC<CoachChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  selectedAsset,
  currentMode,
  onModeSelect,
  uploadedImage,
  currentPrice,
  onSendSignalGmail,
  onSendTextGmail,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!uploadedImage && !currentPrice && !inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleVoicePlay = (msg: ChatMessage) => {
    if (speakingMessageId === msg.id) {
      CoachVoice.stop();
      setSpeakingMessageId(null);
    } else {
      CoachVoice.speak(msg.text);
      setSpeakingMessageId(msg.id);
      setTimeout(() => {
        if (speakingMessageId === msg.id) {
          setSpeakingMessageId(null);
        }
      }, 30000);
    }
  };

  return (
    <div className="luxury-card rounded-2xl flex flex-col h-[540px] sm:h-[680px] max-h-[82vh] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[#0A0A12]/90 px-3 sm:px-4 py-3 border-b border-[#FFD700]/25 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFAA00] text-[#0A0A12] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(255,215,0,0.4)]">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                TRADEMASTER AI Terminal v6
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Actif ciblé : <span className="font-mono text-cyan-300 font-bold">{selectedAsset.id}</span> • Mode : <span className="font-mono text-amber-300 font-bold">{currentMode}</span>
            </p>
          </div>
        </div>

        {/* Status of Screenshot / Price */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] font-mono flex-wrap">
          {uploadedImage ? (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
              📷 Capture Prête
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              ⚠️ Aucune Capture
            </span>
          )}

          {currentPrice ? (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold tabular-nums">
              TV LIVE: {currentPrice}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              PRIX NON DISPONIBLE
            </span>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`flex items-start gap-2 max-w-[95%] sm:max-w-[88%] ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-cyan-600 text-white'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble & Content */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div
                    className={`rounded-2xl p-3.5 sm:p-4 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-cyan-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                    }`}
                  >
                    {/* User attached image thumbnail if present */}
                    {msg.imagePreview && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-slate-700/80 max-w-xs">
                        <img
                          src={msg.imagePreview}
                          alt="Capture envoyée"
                          className="w-full object-cover max-h-36"
                        />
                      </div>
                    )}

                    {/* Text content with formatting */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {/* Render Formatted Signal Card if parsed */}
                    {msg.parsedSignal && (
                      <SignalCard
                        signal={msg.parsedSignal}
                        onSendGmail={onSendSignalGmail}
                      />
                    )}

                    {/* Render Coach Debrief Card if parsed */}
                    {msg.parsedDebrief && (
                      <CoachDebriefCard debrief={msg.parsedDebrief} fullTextToSpeak={msg.text} />
                    )}

                    {/* Footer of message */}
                    <div
                      className={`flex flex-wrap items-center justify-between gap-2 mt-2 pt-1.5 border-t text-[10px] font-mono ${
                        isUser
                          ? 'border-cyan-500/40 text-cyan-200'
                          : 'border-slate-800 text-slate-500'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <div className="flex items-center gap-3 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onSendTextGmail(msg.text)}
                            className="flex items-center gap-1 hover:text-rose-300 transition text-[11px]"
                            title="Envoyer cette analyse par notification Gmail"
                          >
                            <Mail className="w-3 h-3 text-rose-400" /> Notifier Gmail
                          </button>

                          <button
                            onClick={() => handleVoicePlay(msg)}
                            className="flex items-center gap-1 hover:text-slate-300 transition text-[11px]"
                            title="Écouter la réponse du coach"
                          >
                            {speakingMessageId === msg.id ? (
                              <>
                                <VolumeX className="w-3 h-3 text-amber-400" /> Stop Voix
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-cyan-400" /> Voix Coach
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-300 shadow-xl space-y-2 max-w-md">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>TRADEMASTER AI v6 analyse le marché...</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 font-mono">
                <li>• Examen de la capture TradingView & lecture du prix exact</li>
                <li>• Détection de la tendance H1/M15, Order Block & Fair Value Gap</li>
                <li>• Vérification stricte des 3 confluences & gestion du risque (1%)</li>
              </ul>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Action Chips */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
          Actions rapides :
        </span>

        <button
          onClick={() => {
            onSendMessage('Analyse ma capture d\'écran selon le protocole en 5 étapes : 1. Tendance et preuves, 2. Les 3 zones clés à tracer, 3. Statut du setup, 4. Correction de mes erreurs, 5. 1 leçon + 1 exercice.');
          }}
          className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 whitespace-nowrap text-[11px] font-semibold transition border border-indigo-500/40"
        >
          📸 Protocole Capture 5 Étapes (v5)
        </button>

        <button
          onClick={() => {
            onModeSelect('SCALPING');
            onSendMessage('Mode SCALPING. Analyse ma capture TradingView avec l\'approche M5/M15 (BOS + Retest Order Block, TP 30-100 pts).');
          }}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 whitespace-nowrap text-[11px] font-semibold transition border border-slate-700"
        >
          ⚡ Scalping M5/M15
        </button>

        <button
          onClick={() => {
            onModeSelect('SWING');
            onSendMessage('Mode SWING. Analyse pour une position de fond H1/H4 (Tendance, Pullback, TP1 1:2, TP2 1:4, TP3 Trailing Stop).');
          }}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 whitespace-nowrap text-[11px] font-semibold transition border border-slate-700"
        >
          🌊 Swing H1/H4 (TP1, TP2, TP3)
        </button>

        <button
          onClick={() => {
            onSendMessage('Vérifie les 6 indicateurs obligatoires : EMA 50/200, RSI 14, MACD, VWAP, ATR et Volume. Y a-t-il minimum 3 confluences ?');
          }}
          className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 whitespace-nowrap text-[11px] font-semibold transition border border-cyan-800/50"
        >
          📊 6 Indicateurs & Confluences
        </button>

        <button
          onClick={() => {
            onModeSelect('LES_DEUX');
            onSendMessage('Analyse les 2 modes à la fois (Mode SCALPING et Mode SWING) sur ce graphique.');
          }}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 whitespace-nowrap text-[11px] font-semibold transition border border-slate-700"
        >
          ⚡🌊 Analyser les 2 Modes
        </button>

        {selectedAsset.isGold && (
          <button
            onClick={() => {
              onSendMessage('Pour XAUUSD (OR) : Analyse H1 tendance / M15 structure (BOS + Retest OB + FVG) / M5 entrée. Y a-t-il un Liquidity Sweep ? Respecte SL 150-300 pts (1.5$-3$) et TP min 1:2.');
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 whitespace-nowrap text-[11px] font-semibold transition border border-amber-500/40"
          >
            🥇 Protocole OR (Sweep & OB/FVG M15)
          </button>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#0A0A12]/95 border-t border-[#FFD700]/25 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            uploadedImage
              ? "Pose une question sur ta capture ou demande l'analyse..."
              : currentPrice
              ? `Prix réel TradingView (${currentPrice}) prêt — lance l'analyse ou pose ta question...`
              : "PRIX NON DISPONIBLE - Envoie une capture TradingView..."
          }
          className="flex-1 bg-[#0A0A12] border border-[#FFD700]/30 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] rounded-full px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none transition"
        />

        <button
          type="submit"
          disabled={isLoading || (!uploadedImage && !currentPrice)}
          className={`btn-glow-gold px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${
            isLoading || (!uploadedImage && !currentPrice)
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#0A0A12] active:scale-95'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Analyser</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
