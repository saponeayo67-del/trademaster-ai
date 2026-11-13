import React from 'react';
import {
  Mail,
  Bell,
  CheckCircle2,
  LogOut,
  Send,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';

export interface SentNotificationLog {
  id: string;
  to: string;
  subject: string;
  timestamp: string;
  gmailMessageId?: string;
}

interface GmailNotificationPanelProps {
  user: User | null;
  needsAuth: boolean;
  isLoggingIn: boolean;
  authError: string | null;
  recipientEmail: string;
  onRecipientEmailChange: (email: string) => void;
  promptOnSignal: boolean;
  onTogglePromptOnSignal: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onSendTestNotification: () => void;
  sentLogs: SentNotificationLog[];
}

export const GmailNotificationPanel: React.FC<GmailNotificationPanelProps> = ({
  user,
  needsAuth,
  isLoggingIn,
  authError,
  recipientEmail,
  onRecipientEmailChange,
  promptOnSignal,
  onTogglePromptOnSignal,
  onLogin,
  onLogout,
  onSendTestNotification,
  sentLogs,
}) => {
  const isConnected = !needsAuth && Boolean(user);

  return (
    <div
      id="gmail-notifications-panel"
      className="luxury-card rounded-2xl p-4 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/25 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#A855F7]/20 text-[#E9D5FF] border border-[#A855F7]/40">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>Notifications Gmail</span>
              {isConnected ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  CONNECTÉ
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                  NON CONNECTÉ
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400">
              Reçois tes signaux et alertes TRADEMASTER AI directement dans Gmail
            </p>
          </div>
        </div>

        {isConnected && (
          <button
            type="button"
            onClick={onLogout}
            className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 transition"
            title="Déconnecter le compte Gmail"
          >
            <LogOut className="w-3 h-3" />
            <span>Déconnexion</span>
          </button>
        )}
      </div>

      {/* Auth Error */}
      {authError && (
        <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-[11px] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {!isConnected ? (
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col items-start gap-3">
          <div className="text-xs text-slate-300 leading-relaxed">
            Connecte ton compte Google pour autoriser l'envoi de notifications par e-mail via l'API Gmail officielle.
            {user?.email && (
              <span className="block mt-1 text-[11px] text-amber-300">
                Connecté avec {user.email} : clique ci-dessous pour autoriser l'envoi d'e-mails via Gmail.
              </span>
            )}
          </div>
          <GoogleSignInButton
            onClick={onLogin}
            isLoading={isLoggingIn}
            label="Sign in with Google"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Connected account info */}
          <div className="bg-slate-950/70 px-3 py-2 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">Expéditeur Gmail actif :</span>
                <span className="font-mono font-bold text-slate-200 truncate">
                  {user?.email || 'Compte Google'}
                </span>
              </div>
            </div>
          </div>

          {/* Recipient Email */}
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Adresse Gmail de réception des notifications
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => onRecipientEmailChange(e.target.value)}
              placeholder={user?.email || 'ton-email@gmail.com'}
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 outline-none"
            />
          </div>

          {/* Prompt on New Signal Toggle */}
          <button
            type="button"
            onClick={onTogglePromptOnSignal}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
              promptOnSignal
                ? 'bg-cyan-500/15 text-cyan-200 border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              <Bell className={`w-4 h-4 flex-shrink-0 ${promptOnSignal ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>Proposer une notification Gmail à chaque nouveau signal</span>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                promptOnSignal ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {promptOnSignal ? 'ACTIF' : 'INACTIF'}
            </span>
          </button>

          {/* Test Notification Button */}
          <button
            type="button"
            onClick={onSendTestNotification}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Send className="w-3.5 h-3.5 text-rose-400" />
            <span>Envoyer une notification test Gmail</span>
          </button>

          {/* Sent Notifications History */}
          {sentLogs.length > 0 && (
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Notifications envoyées ({sentLogs.length})
                </span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                {sentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="text-[11px] bg-slate-900 border border-slate-800/80 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-200 truncate">{log.subject}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        À: {log.to}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 flex-shrink-0">
                      ✓ {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
