import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { CheckCircle2, X } from 'lucide-react';
import { Header } from './components/Header';
import { CaptureHub } from './components/CaptureHub';
import { CoachChat } from './components/CoachChat';
import { RiskCalculator } from './components/RiskCalculator';
import { TradingViewWidget } from './components/TradingViewWidget';
import { TradingViewLiveBoard } from './components/TradingViewLiveBoard';
import { SMCGuideModal } from './components/SMCGuideModal';
import { AuthPages } from './components/AuthPages';
import { AnimatedRobotLogo } from './components/AnimatedRobotLogo';
import { XauusdInteractiveStage } from './components/XauusdInteractiveStage';
import {
  GmailNotificationPanel,
  SentNotificationLog,
} from './components/GmailNotificationPanel';
import {
  GmailConfirmModal,
  PendingGmailNotification,
} from './components/GmailConfirmModal';
import { ALL_ASSETS } from './data/assets';
import {
  TradingMode,
  AssetInfo,
  ChatMessage,
  TradeSignal,
  LiveMarketQuote,
} from './types';
import { parseSignalFromText, parseCoachDebrief } from './utils/parser';
import {
  auth,
  googleSignIn,
  getAccessToken,
  clearCachedToken,
  logout,
} from './utils/gmailAuth';

export default function App() {
  const [selectedAsset, setSelectedAsset] = useState<AssetInfo>(ALL_ASSETS[0]); // US30 by default
  const [currentMode, setCurrentMode] = useState<TradingMode>('SCALPING');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>('image/png');
  const [liveQuotes, setLiveQuotes] = useState<Record<string, LiveMarketQuote>>({});
  const [feedStatus, setFeedStatus] = useState<'loading' | 'live' | 'error'>('loading');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [isRedNewsUpcoming, setIsRedNewsUpcoming] = useState<boolean>(false);
  const [isTradingViewEmbedOpen, setIsTradingViewEmbedOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // App user authentication state (Firebase Auth)
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  // Gmail OAuth & Notification state
  const [gmailUser, setGmailUser] = useState<User | null>(null);
  const [needsGmailAuth, setNeedsGmailAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [gmailAuthError, setGmailAuthError] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [promptOnSignal, setPromptOnSignal] = useState<boolean>(true);
  const [pendingEmail, setPendingEmail] = useState<PendingGmailNotification | null>(null);
  const [isSendingGmail, setIsSendingGmail] = useState<boolean>(false);
  const [gmailSendError, setGmailSendError] = useState<string | null>(null);
  const [sentLogs, setSentLogs] = useState<SentNotificationLog[]>([]);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setIsEmailVerified(Boolean(user?.emailVerified));
      setAuthReady(true);

      if (user) {
        if (user.email) {
          setRecipientEmail((prev) => prev || user.email || '');
        }
        if (getAccessToken()) {
          setGmailUser(user);
          setNeedsGmailAuth(false);
          setGmailAuthError(null);
        } else {
          setGmailUser(user);
          setNeedsGmailAuth(true);
        }
      } else {
        setGmailUser(null);
        setNeedsGmailAuth(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Poll live TradingView quotes every 1 second when authenticated & verified
  useEffect(() => {
    if (!authUser || !isEmailVerified) return;

    let cancelled = false;
    let inFlight = false;
    let failureCount = 0;

    const fetchQuotes = async () => {
      if (inFlight || cancelled) return;
      inFlight = true;
      try {
        const res = await fetch('/api/tradingview/prices');
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok || !data.success || !data.quotes || Object.keys(data.quotes).length === 0) {
          throw new Error(data?.error || 'Feed unavailable');
        }

        failureCount = 0;
        setLiveQuotes(data.quotes);
        setLastUpdatedAt(data.updatedAt || new Date().toISOString());
        setFeedStatus('live');
      } catch {
        if (cancelled) return;
        failureCount += 1;
        if (failureCount >= 2) {
          setFeedStatus('error');
          setLiveQuotes({});
        }
      } finally {
        inFlight = false;
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [authUser, isEmailVerified]);

  const activeLiveQuote = liveQuotes[selectedAsset.id] || null;
  const currentPrice = activeLiveQuote ? activeLiveQuote.formattedPrice : '';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'trademaster',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      text: `Salutations trader ! Je suis TRADEMASTER AI - ULTIMATE v5, le meilleur robot + coach de trading au monde.
Je maîtrise TOUS les indices de A à Z : US30, US100, NAS100, US500, SPX500, GER40, DE40, UK100, FRA40, EU50, JP225, AUS200, HK50, CHINA50...
ET JE TRADE AUSSI : XAUUSD (OR), EURUSD, GBPUSD, USDJPY, BTCUSD.

Mode SCALPING ou Mode SWING ?
Précise ton mode ou dépose ta capture d'écran. Si tu ne précises rien, j'analyse les 2 modes !

=== RÈGLES SPÉCIALES XAUUSD (OR) ===
🥇 Timeframes : H1 tendance, M15 structure, M5 entrée (JAMAIS M1 tout seul)
📐 Stratégie : BOS + Retest sur Order Block + FVG sur M15 • Piège Liquidity Sweep
🕒 Sessions : Londres 08h-11h GMT & New York 13h-17h GMT • SL : 150-300 pts (1.5$-3$) • TP : Min 1:2
🚫 Interdit pendant : NFP, CPI, FOMC, Discours de Powell → PAS DE TRADE

=== PROTOCOLE D'ANALYSE STRICT v5 ===
⚡ SCALPING (M5/M15) : 1 à 3 trades/session • TP 30-100 pts US30, 20-60 pts GER40/NAS100 • R:R min 1:2
🌊 SWING (H1/H4/D1) : 1 à 2 trades/semaine • TP1 = 1:2 (sécurise 50%), TP2 = 1:4, TP3 = Trailing Stop
🔍 6 VÉRIFICATIONS : Tendance H4/H1, Structure BOS/CHoCH, Zones OB/FVG, Indicateurs (EMA 50/200, RSI 14, MACD, VWAP, ATR, Volume), Sessions Londres/NY & News
🛡️ RÈGLE D'OR : Minimum 3 CONFLUENCES, sinon PAS DE TRADE
⚖️ GESTION DU RISQUE : 1% max par trade • 2 pertes = STOP journée • 3 gains = STOP journée • SL à BE après TP1.`,
    },
  ]);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => {
      setToastNotice((prev) => (prev === msg ? null : prev));
    }, 5000);
  };

  const handleGmailLogin = async (): Promise<string | null> => {
    setIsLoggingIn(true);
    setGmailAuthError(null);
    try {
      const result = await googleSignIn();
      setGmailUser(result.user);
      setNeedsGmailAuth(false);
      if (result.user.email && !recipientEmail) {
        setRecipientEmail(result.user.email);
      }
      showToast(`Compte Gmail connecté : ${result.user.email}`);
      return result.accessToken;
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setGmailAuthError(
        err?.message || "Échec de la connexion Google. Autorise la fenêtre pop-up et réessaie."
      );
      return null;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGmailLogout = async () => {
    clearCachedToken();
    setNeedsGmailAuth(true);
    showToast('Autorisation Gmail réinitialisée.');
  };

  const handleAppLogout = async () => {
    await logout();
    setAuthUser(null);
    setIsEmailVerified(false);
    setGmailUser(null);
    setNeedsGmailAuth(true);
    setPendingEmail(null);
    showToast('Tu as été déconnecté.');
  };

  const ensureGmailAuthThenPrepare = async (notification: PendingGmailNotification) => {
    setGmailSendError(null);
    let token = getAccessToken();
    if (!token || needsGmailAuth) {
      token = await handleGmailLogin();
      if (!token) {
        document.getElementById('gmail-notifications-panel')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    const targetEmail =
      notification.to || recipientEmail || gmailUser?.email || '';
    setPendingEmail({
      ...notification,
      to: targetEmail,
    });
  };

  const formatSignalEmailBody = (signal: TradeSignal): string => {
    return [
      `TRADEMASTER AI - Notification Signal de Trading`,
      `================================================`,
      `${signal.isGold ? 'PAIRE' : 'INDICE'} : ${signal.asset}`,
      `MODE : ${signal.mode}`,
      `DIRECTION : ${signal.direction}`,
      `ENTRÉE : ${signal.entry}`,
      `STOP LOSS : ${signal.sl}`,
      `TP1 : ${signal.tp1} (Sécurise 50% + SL à Break Even)`,
      signal.tp2 ? `TP2 : ${signal.tp2} (Sécurise le reste)` : '',
      signal.tp3 ? `TP3 : ${signal.tp3} (Laisser courir avec Trailing Stop)` : '',
      `RISK/REWARD : ${signal.riskReward}`,
      `CONFIANCE : ${signal.confidence}%`,
      signal.validUntil ? `VALABLE JUSQU'À : ${signal.validUntil}` : '',
      ``,
      `POURQUOI :`,
      signal.why || 'Analyse Smart Money Concepts validée.',
      ``,
      `Règle sacrée : 1% de risque maximum par trade.`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleRequestSignalGmail = (signal: TradeSignal) => {
    const target = recipientEmail || gmailUser?.email || '';
    const subject = `[TRADEMASTER AI] Signal ${signal.direction} sur ${signal.asset} (${signal.mode})`;
    const body = formatSignalEmailBody(signal);
    ensureGmailAuthThenPrepare({
      to: target,
      subject,
      body,
      sourceLabel: `Signal ${signal.asset} • ${signal.direction}`,
    });
  };

  const handleRequestTextGmail = (messageText: string) => {
    const target = recipientEmail || gmailUser?.email || '';
    const subject = `[TRADEMASTER AI] Alerte & Analyse ${selectedAsset.id} (${currentMode})`;
    ensureGmailAuthThenPrepare({
      to: target,
      subject,
      body: messageText,
      sourceLabel: `Analyse ${selectedAsset.id}`,
    });
  };

  const handleSendTestNotification = () => {
    const target = recipientEmail || gmailUser?.email || '';
    const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    ensureGmailAuthThenPrepare({
      to: target,
      subject: `[TRADEMASTER AI] Test Notification Gmail (${nowStr})`,
      body: `Bonjour !\n\nCeci est un message test envoyé depuis ton terminal TRADEMASTER AI.\nTes notifications Gmail pour les signaux (${selectedAsset.id}, XAUUSD, US30, NAS100...) sont maintenant opérationnelles.\n\nDiscipline & Gestion du Risque : 1% max par trade.`,
      sourceLabel: 'Test de notification Gmail',
    });
  };

  const handleConfirmSendGmail = async (finalEmail: PendingGmailNotification) => {
    setIsSendingGmail(true);
    setGmailSendError(null);
    try {
      let token = getAccessToken();
      if (!token) {
        token = await handleGmailLogin();
        if (!token) {
          throw new Error('Connexion Gmail requise pour envoyer le message.');
        }
      }

      const res = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: finalEmail.to,
          subject: finalEmail.subject,
          body: finalEmail.body,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.needsReauth || res.status === 401 || res.status === 403) {
          clearCachedToken();
          setNeedsGmailAuth(true);
        }
        throw new Error(data.error || "Erreur lors de l'envoi via Gmail.");
      }

      const timestamp = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setSentLogs((prev) => [
        {
          id: data.id || 'mail-' + Date.now(),
          to: finalEmail.to,
          subject: finalEmail.subject,
          timestamp,
          gmailMessageId: data.id,
        },
        ...prev,
      ]);

      setPendingEmail(null);
      showToast(`Notification Gmail envoyée à ${finalEmail.to} !`);
    } catch (err: any) {
      console.error('Gmail send failed:', err);
      setGmailSendError(err?.message || "Impossible d'envoyer l'e-mail Gmail.");
    } finally {
      setIsSendingGmail(false);
    }
  };

  const handleImageChange = (base64: string | null, mimeType?: string) => {
    setUploadedImage(base64);
    if (mimeType) {
      setUploadedMimeType(mimeType);
    }
  };

  const handleSelectAsset = (asset: AssetInfo) => {
    setSelectedAsset(asset);
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      text: text || "Analyse le marché selon le prix réel du Widget TradingView.",
      imagePreview: uploadedImage || undefined,
      priceUsed: currentPrice || undefined,
      assetUsed: selectedAsset.id,
      modeUsed: currentMode,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Strict gate: if live TradingView widget price is unavailable AND no capture was uploaded -> refuse signal!
    if (!currentPrice && !uploadedImage) {
      const blockedMsg: ChatMessage = {
        id: 'tm-' + Date.now(),
        sender: 'trademaster',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        text: `PRIX NON DISPONIBLE - Envoie une capture TradingView\n\nLe Widget TradingView n'affiche pas encore le prix réel de ${selectedAsset.id} et aucune capture d'écran n'a été envoyée. Je n'invente JAMAIS de prix et je ne donne PAS de signal sans prix réel.`,
      };
      setMessages((prev) => [...prev, blockedMsg]);
      return;
    }

    setIsLoading(true);

    try {
      const now = new Date();
      const sessionGmt = `${now.getUTCHours().toString().padStart(2, '0')}:${now
        .getUTCMinutes()
        .toString()
        .padStart(2, '0')} GMT`;

      const response = await fetch('/api/trademaster/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          imageBase64: uploadedImage,
          imageMimeType: uploadedMimeType,
          asset: selectedAsset.id,
          mode: currentMode,
          currentPrice: currentPrice,
          isRedNewsUpcoming,
          sessionGmt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Échec de l'analyse");
      }

      const responseText = data.text;
      const parsedSignal = data.priceUnavailable ? null : parseSignalFromText(responseText);
      const parsedDebrief = data.priceUnavailable ? null : parseCoachDebrief(responseText);

      const aiMsg: ChatMessage = {
        id: 'tm-' + Date.now(),
        sender: 'trademaster',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        parsedSignal: parsedSignal || undefined,
        parsedDebrief: parsedDebrief || undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If a valid signal is generated and Gmail is connected & promptOnSignal is enabled, open confirmation modal
      if (parsedSignal && promptOnSignal && !needsGmailAuth && getAccessToken()) {
        handleRequestSignalGmail(parsedSignal);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'trademaster',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        text: `⚠️ Erreur lors de l'analyse : ${err.message || 'Connexion interrompue'}.\nAssure-toi que le widget TradingView affiche le prix réel ou envoie une capture TradingView.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToGmailPanel = () => {
    const el = document.getElementById('gmail-notifications-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToCaptureZone = () => {
    const el = document.getElementById('capture-upload-zone');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const xauAsset = ALL_ASSETS.find((a) => a.id === 'XAUUSD') || ALL_ASSETS[0];
  const xauQuote = liveQuotes['XAUUSD'] || null;

  const handleQuickXauAnalysis = (direction: 'BUY' | 'SELL') => {
    setSelectedAsset(xauAsset);
    const liveXauPrice = xauQuote?.formattedPrice;
    if (!liveXauPrice) {
      showToast('PRIX NON DISPONIBLE - Envoie une capture TradingView');
      return;
    }
    handleSendMessage(
      `Analyse XAUUSD (OR) pour une intention ${direction} au prix réel TradingView ${liveXauPrice}. Respecte H1 tendance / M15 structure (BOS + Retest OB + FVG) / M5 entrée, SL 150-300 pts (1.5$-3$) et TP min 1:2.`
    );
  };

  if (!authReady) {
    return (
      <div className="min-h-screen luxury-bg text-slate-100 flex flex-col items-center justify-center p-6 gap-4">
        <AnimatedRobotLogo size="lg" />
        <p className="text-xs sm:text-sm font-mono text-[#FFD700] animate-pulse">
          Initialisation de TRADEMASTER AI...
        </p>
      </div>
    );
  }

  if (!authUser || !isEmailVerified) {
    return (
      <AuthPages
        unverifiedUser={authUser && !isEmailVerified ? authUser : null}
        onGoogleLogin={handleGmailLogin}
        isGoogleLoading={isLoggingIn}
        onVerificationSuccess={() => {
          setIsEmailVerified(true);
          showToast('Adresse e-mail validée ! Bienvenue sur TRADEMASTER AI.');
        }}
        onLogout={handleAppLogout}
      />
    );
  }

  return (
    <div className="min-h-screen luxury-bg text-slate-100 flex flex-col font-sans selection:bg-[#FFD700] selection:text-[#0A0A12]">
      {/* 1. Header with Animated Robot Logo, Siri Top Patrol, XAUUSD Ticker, Sessions, Modes & Gmail status */}
      <Header
        currentMode={currentMode}
        onModeChange={(m) => setCurrentMode(m)}
        isRedNewsUpcoming={isRedNewsUpcoming}
        onToggleRedNews={() => setIsRedNewsUpcoming(!isRedNewsUpcoming)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        isGmailConnected={!needsGmailAuth && Boolean(gmailUser)}
        onOpenGmailPanel={scrollToGmailPanel}
        userEmail={authUser.email}
        onAppLogout={handleAppLogout}
        xauQuote={xauQuote}
      />

      {/* Toast Notification */}
      {toastNotice && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-md z-50 bg-[#0A0A12]/95 border border-[#FFD700]/60 text-[#FFD700] px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.3)] flex items-center justify-between gap-2.5 text-xs font-semibold backdrop-blur-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-[#00FF88] flex-shrink-0" />
            <span className="break-words text-slate-100">{toastNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastNotice(null)}
            className="text-slate-400 hover:text-slate-200 ml-1 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-5">
        {/* Interactive XAUUSD Dark Stage with Fullscreen, Auto Support/Resistance, Siri Walker & BUY/SELL Animations */}
        <XauusdInteractiveStage
          xauQuote={xauQuote}
          feedStatus={feedStatus}
          onJumpToCapture={scrollToCaptureZone}
          onTriggerQuickAnalysis={handleQuickXauAnalysis}
        />

        {/* Official TradingView Live Board on Home Page (auto-updates every 1s) */}
        <TradingViewLiveBoard
          selectedAsset={selectedAsset}
          onSelectAsset={handleSelectAsset}
          liveQuotes={liveQuotes}
          feedStatus={feedStatus}
          lastUpdatedAt={lastUpdatedAt}
          onOpenChart={() => setIsTradingViewEmbedOpen(!isTradingViewEmbedOpen)}
          isChartOpen={isTradingViewEmbedOpen}
          onJumpToCapture={scrollToCaptureZone}
        />

        {/* Optional TradingView Interactive Chart Live Widget */}
        {isTradingViewEmbedOpen && (
          <TradingViewWidget
            symbolId={selectedAsset.id}
            onClose={() => setIsTradingViewEmbedOpen(false)}
          />
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Capture Hub, Gmail Notifications & Risk Management (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <CaptureHub
              selectedAsset={selectedAsset}
              onSelectAsset={handleSelectAsset}
              uploadedImage={uploadedImage}
              onImageChange={handleImageChange}
              liveQuote={activeLiveQuote}
              feedStatus={feedStatus}
              onToggleTradingViewEmbed={() => setIsTradingViewEmbedOpen(!isTradingViewEmbedOpen)}
              isTradingViewEmbedOpen={isTradingViewEmbedOpen}
            />

            <GmailNotificationPanel
              user={gmailUser}
              needsAuth={needsGmailAuth}
              isLoggingIn={isLoggingIn}
              authError={gmailAuthError}
              recipientEmail={recipientEmail}
              onRecipientEmailChange={setRecipientEmail}
              promptOnSignal={promptOnSignal}
              onTogglePromptOnSignal={() => setPromptOnSignal(!promptOnSignal)}
              onLogin={handleGmailLogin}
              onLogout={handleGmailLogout}
              onSendTestNotification={handleSendTestNotification}
              sentLogs={sentLogs}
            />

            <RiskCalculator selectedAsset={selectedAsset} />
          </div>

          {/* Right Column: TRADEMASTER AI Coach Chat & Signal Feed (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col">
            <CoachChat
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              selectedAsset={selectedAsset}
              currentMode={currentMode}
              onModeSelect={setCurrentMode}
              uploadedImage={uploadedImage}
              currentPrice={currentPrice}
              onSendSignalGmail={handleRequestSignalGmail}
              onSendTextGmail={handleRequestTextGmail}
            />
          </div>
        </div>
      </main>

      {/* Official SMC & Rules Guide Modal */}
      <SMCGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Explicit Confirmation Dialog before sending Gmail message */}
      <GmailConfirmModal
        pendingEmail={pendingEmail}
        isSending={isSendingGmail}
        error={gmailSendError}
        onConfirm={handleConfirmSendGmail}
        onCancel={() => {
          setPendingEmail(null);
          setGmailSendError(null);
        }}
      />
    </div>
  );
}
