import React, { useState, useEffect } from 'react';
import { Mail, Send, X, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

export interface PendingGmailNotification {
  to: string;
  subject: string;
  body: string;
  sourceLabel?: string;
}

interface GmailConfirmModalProps {
  pendingEmail: PendingGmailNotification | null;
  isSending: boolean;
  error: string | null;
  onConfirm: (finalEmail: PendingGmailNotification) => void;
  onCancel: () => void;
}

export const GmailConfirmModal: React.FC<GmailConfirmModalProps> = ({
  pendingEmail,
  isSending,
  error,
  onConfirm,
  onCancel,
}) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (pendingEmail) {
      setTo(pendingEmail.to);
      setSubject(pendingEmail.subject);
      setBody(pendingEmail.body);
    }
  }, [pendingEmail]);

  if (!pendingEmail) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || !subject.trim() || !body.trim()) return;
    onConfirm({
      to: to.trim(),
      subject: subject.trim(),
      body: body.trim(),
      sourceLabel: pendingEmail.sourceLabel,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A0A12]/85 backdrop-blur-md">
      <div className="luxury-card rounded-2xl max-w-lg w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0A0A12]/95 border-b border-[#FFD700]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Confirmer l'envoi de notification Gmail
              </h3>
              <p className="text-[11px] text-slate-400">
                {pendingEmail.sourceLabel || 'Un e-mail va être envoyé via ton compte Gmail connecté'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSending}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              Vérifie le destinataire et le contenu ci-dessous avant d'envoyer ce message Gmail.
            </span>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 flex items-start gap-2 text-[11px]">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Destinataire (À)
            </label>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="ex: trader@gmail.com"
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Objet du message
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Contenu de la notification
            </label>
            <textarea
              rows={7}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSending}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSending || !to.trim() || !subject.trim() || !body.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirmer et envoyer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
