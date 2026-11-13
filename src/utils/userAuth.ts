import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  User,
} from 'firebase/auth';
import { auth, logout } from './gmailAuth';

export function translateFirebaseAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code || '';
  const message = (error as { message?: string })?.message || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Cette adresse e-mail est déjà utilisée par un autre compte. Essaie de te connecter.';
    case 'auth/invalid-email':
      return "L'adresse e-mail saisie n'est pas valide.";
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible. Utilise au moins 6 caractères.';
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cette adresse e-mail.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect. Vérifie ta saisie ou utilise « Mot de passe oublié ».';
    case 'auth/invalid-credential':
      return 'E-mail ou mot de passe incorrect. Vérifie tes identifiants et réessaie.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives effectuées. Patiente quelques minutes avant de réessayer.';
    case 'auth/user-disabled':
      return 'Ce compte utilisateur a été désactivé.';
    case 'auth/network-request-failed':
      return 'Erreur de connexion réseau. Vérifie ton accès Internet et réessaie.';
    case 'auth/missing-email':
      return 'Veuillez saisir votre adresse e-mail.';
    case 'auth/operation-not-allowed':
      return "La connexion par e-mail et mot de passe n'est pas encore activée dans la console Firebase (Authentication > Sign-in method > E-mail/Mot de passe).";
    case 'auth/popup-closed-by-user':
      return 'La fenêtre de connexion Google a été fermée avant la validation.';
    case 'auth/requires-recent-login':
      return 'Cette opération nécessite une reconnexion récente.';
    default:
      if (message.includes('password')) {
        return 'Le mot de passe ne respecte pas les critères de sécurité requis.';
      }
      return "Une erreur d'authentification est survenue. Vérifie tes informations et réessaie.";
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const trimmedEmail = email.trim();
  const credential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
  await sendEmailVerification(credential.user);
  return credential.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const trimmedEmail = email.trim();
  const credential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
  return credential.user;
}

export async function resendVerificationEmail(user: User): Promise<void> {
  await sendEmailVerification(user);
}

export async function checkEmailVerified(user: User): Promise<boolean> {
  await reload(user);
  return Boolean(auth.currentUser?.emailVerified);
}

export async function resetPassword(email: string): Promise<void> {
  const trimmedEmail = email.trim();
  await sendPasswordResetEmail(auth, trimmedEmail);
}

export { logout };
