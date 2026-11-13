import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  KeyRound,
  ShieldCheck,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { AnimatedRobotLogo } from './AnimatedRobotLogo';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  signUpWithEmail,
  signInWithEmail,
  resendVerificationEmail,
  checkEmailVerified,
  resetPassword,
  translateFirebaseAuthError,
} from '../utils/userAuth';

type AuthView = 'login' | 'signup' | 'forgot';

interface AuthPagesProps {
  unverifiedUser: User | null;
  onGoogleLogin: () => Promise<string | null>;
  isGoogleLoading: boolean;
  onVerificationSuccess: () => void;
  onLogout: () => Promise<void>;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  unverifiedUser,
  onGoogleLogin,
  isGoogleLoading,
  onVerificationSuccess,
  onLogout,
}) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Verification gate state
  const [isCheckingVerify, setIsCheckingVerify] = useState(false);
  const [isResendingVerify, setIsResendingVerify] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const switchView = (nextView: AuthView) => {
    setView(nextView);
    setErrorMsg(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg('Veuillez saisir votre adresse e-mail.');
      return;
    }
    if (!password) {
      setErrorMsg('Veuillez saisir votre mot de passe.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await signInWithEmail(trimmedEmail, password);
      if (!user.emailVerified) {
        setSuccessMsg(
          'Connexion réussie, mais votre adresse e-mail doit être validée avant d’accéder au terminal.'
        );
      }
    } catch (err) {
      setErrorMsg(translateFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUpWithEmail(trimmedEmail, password);
      setResendCooldown(30);
      setSuccessMsg(
        `Compte créé ! Un e-mail de vérification vient d'être envoyé à ${trimmedEmail}. Valide ton adresse e-mail pour débloquer l'accès.`
      );
    } catch (err) {
      setErrorMsg(translateFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(trimmedEmail);
      setSuccessMsg(
        `Un e-mail de réinitialisation du mot de passe a été envoyé à ${trimmedEmail}. Pense à vérifier tes spams si tu ne le vois pas.`
      );
    } catch (err) {
      setErrorMsg(translateFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCheck = async () => {
    if (!unverifiedUser) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsCheckingVerify(true);

    try {
      const verified = await checkEmailVerified(unverifiedUser);
      if (verified) {
        onVerificationSuccess();
      } else {
        setErrorMsg(
          "Ton adresse e-mail n'est pas encore validée. Clique sur le lien reçu dans ta boîte mail (ou dans tes spams), puis réessaie."
        );
      }
    } catch (err) {
      setErrorMsg(translateFirebaseAuthError(err));
    } finally {
      setIsCheckingVerify(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedUser || resendCooldown > 0) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsResendingVerify(true);

    try {
      await resendVerificationEmail(unverifiedUser);
      setResendCooldown(30);
      setSuccessMsg(
        `Un nouvel e-mail de vérification a été envoyé à ${unverifiedUser.email}.`
      );
    } catch (err) {
      setErrorMsg(translateFirebaseAuthError(err));
    } finally {
      setIsResendingVerify(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const token = await onGoogleLogin();
    if (!token) {
      setErrorMsg(
        'Connexion Google annulée ou bloquée. Autorise les fenêtres pop-up et réessaie.'
      );
    }
  };

  return (
    <div className="min-h-screen luxury-bg text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Subtle neon purple, cyan & gold ambient glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#A855F7]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#00E5FF]/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Animated Robot Logo displayed prominently at the top */}
        <div className="flex flex-col items-center text-center mb-6">
          <AnimatedRobotLogo size="lg" className="mb-3" />
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black tracking-wider gold-gradient-text">
              TRADEMASTER AI
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#A855F7]/20 text-[#E9D5FF] border border-[#A855F7]/50">
              ULTIMATE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-sm">
            Robot &amp; Coach de Trading SMC • Indices, Or &amp; Forex
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full luxury-card rounded-2xl p-5 sm:p-7">
          {unverifiedUser ? (
            /* EMAIL VERIFICATION MANDATORY GATE */
            <div className="flex flex-col gap-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  Validation de l&apos;e-mail requise
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Un e-mail de vérification a été envoyé à{' '}
                  <span className="font-semibold text-cyan-300 break-all">
                    {unverifiedUser.email}
                  </span>
                  .
                </p>
                <p className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2.5 mt-3">
                  Ton compte ne peut pas être utilisé tant que ton adresse e-mail n&apos;est pas validée. Ouvre ta boîte de réception (et tes spams) puis clique sur le lien de confirmation.
                </p>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 text-left bg-rose-500/10 border border-rose-500/40 text-rose-200 rounded-xl p-3 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-start gap-2 text-left bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 rounded-xl p-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="flex flex-col gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={handleVerifyCheck}
                  disabled={isCheckingVerify}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isCheckingVerify ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>J&apos;ai validé mon e-mail — Continuer</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResendingVerify || resendCooldown > 0}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isResendingVerify ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span>
                    {resendCooldown > 0
                      ? `Renvoyer l'e-mail (${resendCooldown}s)`
                      : "Renvoyer l'e-mail de vérification"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    onLogout();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-slate-800/70 text-slate-400 hover:text-slate-200 font-medium text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Se déconnecter / Utiliser un autre compte</span>
                </button>
              </div>
            </div>
          ) : (
            /* LOGIN / SIGNUP / FORGOT PASSWORD VIEWS */
            <div className="flex flex-col gap-4">
              {/* Top Tabs for Login / Signup */}
              {view !== 'forgot' ? (
                <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => switchView('login')}
                    className={`py-2.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                      view === 'login'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    type="button"
                    onClick={() => switchView('signup')}
                    className={`py-2.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                      view === 'signup'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Inscription
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-purple-400" />
                    <h2 className="text-sm sm:text-base font-bold text-slate-100">
                      Mot de passe oublié
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchView('login')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Retour
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/40 text-rose-200 rounded-xl p-3 text-xs leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 rounded-xl p-3 text-xs leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {view === 'login' && (
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trader@exemple.com"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Mot de passe
                      </label>
                      <button
                        type="button"
                        onClick={() => switchView('forgot')}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                        aria-label={showPassword ? 'Masquer' : 'Afficher'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Se connecter</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* SIGNUP FORM */}
              {view === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trader@exemple.com"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Mot de passe (6 caractères min.)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 caractères"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                        aria-label={showPassword ? 'Masquer' : 'Afficher'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Répète ton mot de passe"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                        aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Un e-mail de vérification te sera envoyé automatiquement. Tu devras cliquer sur le lien reçu pour activer ton compte.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Créer mon compte</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* FORGOT PASSWORD FORM */}
              {view === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3.5">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Entre ton adresse e-mail ci-dessous pour recevoir un lien sécurisé de réinitialisation de mot de passe.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Adresse e-mail du compte
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trader@exemple.com"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Envoyer le lien de réinitialisation</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Google Sign-In Alternative */}
              {view !== 'forgot' && (
                <>
                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-slate-800" />
                    <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                      ou
                    </span>
                    <div className="flex-grow border-t border-slate-800" />
                  </div>

                  <div className="flex justify-center">
                    <GoogleSignInButton
                      onClick={handleGoogleSignIn}
                      isLoading={isGoogleLoading}
                      label="Continuer avec Google"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
