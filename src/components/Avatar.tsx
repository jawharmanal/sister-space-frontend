// ============================================================================
// SISTER SPACE — Composant Avatar (généré dynamiquement avec DiceBear)
// ============================================================================

interface AvatarProps {
  prenom: string;
  taille?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  photoUrl?: string | null;
}

// Tailles disponibles
const TAILLES = {
  xs:   'w-7 h-7 text-xs',
  sm:   'w-9 h-9 text-sm',
  md:   'w-11 h-11 text-base',
  lg:   'w-14 h-14 text-lg',
  xl:   'w-20 h-20 text-3xl',
  '2xl':'w-28 h-28 text-4xl',
};

export default function Avatar({ prenom, taille = 'md', photoUrl }: AvatarProps) {
  // Si photo perso → on affiche
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={prenom}
        className={`${TAILLES[taille]} rounded-full object-cover ring-2 ring-white shadow-pink-soft`}
      />
    );
  }

  // Sinon DiceBear
  const seed = encodeURIComponent(prenom.toLowerCase());
  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=fce7f3,fbcfe8,f9a8d4,fdf2f8,fff0f6`;

  return (
    <img
      src={avatarUrl}
      alt={prenom}
      className={`${TAILLES[taille]} rounded-full bg-gradient-to-br from-sister-100 to-champagne-100 ring-2 ring-white shadow-pink-soft`}
    />
  );
}