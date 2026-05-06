// ============================================================================
// SISTER SPACE — Bottom Navigation
// ============================================================================

import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  // Helper pour savoir si une route est active
  const estActif = (chemin: string) => location.pathname === chemin;

  // Style commun pour les liens
  const styleLien = (actif: boolean) =>
    `flex-1 flex items-center justify-center text-2xl py-3 transition ${
      actif ? 'text-sister-600' : 'text-gray-400 hover:text-sister-400'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 shadow-lg z-20">
      <div className="max-w-2xl mx-auto flex items-center">
        
        {/* Accueil / Feed */}
        <Link to="/feed" className={styleLien(estActif('/feed'))} title="Accueil">
          🏠
        </Link>

        {/* Exploration */}
        <Link to="/explore" className={styleLien(estActif('/explore'))} title="Explorer">
          🧭
        </Link>

        {/* Bouton créer un post (mis en avant) */}
        <Link 
          to="/creer-post" 
          className="mx-2 my-2 w-14 h-14 bg-gradient-to-br from-sister-400 to-sister-600 text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition"
          title="Créer un post"
        >
          +
        </Link>

        {/* Messagerie */}
        <Link to="/messages" className={styleLien(estActif('/messages'))} title="Messages">
          💬
        </Link>

        {/* Profil */}
        <Link to="/profil" className={styleLien(estActif('/profil'))} title="Profil">
          👤
        </Link>
      </div>
    </nav>
  );
}