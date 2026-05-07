// ============================================================================
// SISTER SPACE — Menu utilisatrice (avatar + dropdown)
// ============================================================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

export default function UserMenu() {
  const navigate = useNavigate();
  const utilisatrice = authService.getUtilisatriceConnectee();
  const [ouvert, setOuvert] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickExterieur = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOuvert(false);
      }
    };
    document.addEventListener('mousedown', handleClickExterieur);
    return () => document.removeEventListener('mousedown', handleClickExterieur);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!utilisatrice) return null;

  const initiale = utilisatrice.prenom.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      
      {/* Bouton avatar */}
      <button
        onClick={() => setOuvert(!ouvert)}
        className="flex items-center gap-2 hover:bg-pink-50 px-2 py-1 rounded-full transition"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white font-bold text-sm">
          {initiale}
        </div>
        <span className="text-sm text-gray-700 hidden sm:inline">
          {utilisatrice.prenom}
        </span>
        <span className="text-gray-400 text-xs">▼</span>
      </button>

      {/* Menu déroulant */}
      {ouvert && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-30">
          
          {/* En-tête du menu */}
          <div className="p-4 bg-gradient-to-br from-sister-50 to-pink-50 border-b border-pink-100">
            <div className="font-semibold text-gray-800">{utilisatrice.prenom}</div>
            <div className="text-xs text-sister-500">{utilisatrice.pseudo}</div>
            <div className="text-xs text-gray-400 mt-1 truncate">{utilisatrice.email}</div>
          </div>

          {/* Options */}
          <div className="py-1">
            <button
              onClick={() => { setOuvert(false); navigate('/profil'); }}
              className="w-full text-left px-4 py-2 hover:bg-pink-50 text-sm text-gray-700 transition flex items-center gap-2"
            >
              👤 Mon profil
            </button>

            <button
              onClick={() => { setOuvert(false); alert('Paramètres à venir 🌸'); }}
              className="w-full text-left px-4 py-2 hover:bg-pink-50 text-sm text-gray-700 transition flex items-center gap-2"
            >
              ⚙️ Paramètres
            </button>

            {utilisatrice.role === 'ADMIN' && (
              <button
                onClick={() => { setOuvert(false); navigate('/admin'); }}
                className="w-full text-left px-4 py-2 hover:bg-pink-50 text-sm text-sister-600 font-medium transition flex items-center gap-2"
              >
               👮 Admin
              </button>
             )}

            <div className="border-t border-pink-100 my-1"></div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500 transition flex items-center gap-2"
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}