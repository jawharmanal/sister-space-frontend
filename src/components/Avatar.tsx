// ============================================================================
// SISTER SPACE — Composant Avatar (généré dynamiquement avec DiceBear)
// ============================================================================

interface AvatarProps {
  prenom: string;
  taille?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  photoUrl?: string | null;
}

// Tailles disponibles
const TAILLES = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-20 h-20 text-3xl',
};

export default function Avatar({ prenom, taille = 'md', photoUrl }: AvatarProps) {
  // Si l'utilisatrice a une photo de profil personnalisée, on l'utilise
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={prenom}
        className={`${TAILLES[taille]} rounded-full object-cover border-2 border-white shadow-sm`}
      />
    );
  }

  // Sinon, on génère un avatar avec DiceBear
  // Le seed = prénom → toujours le même avatar pour la même personne
  const seed = encodeURIComponent(prenom.toLowerCase());
  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=fce7f3,fbcfe8,f9a8d4,fdf2f8,fff0f6`;

  return (
    <img
      src={avatarUrl}
      alt={prenom}
      className={`${TAILLES[taille]} rounded-full bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-white shadow-sm`}
    />
  );
}