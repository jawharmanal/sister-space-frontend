// ============================================================================
// SISTER SPACE — Menu utilisatrice (avatar + dropdown)
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, Settings, Shield, LogOut } from 'lucide-react';
import * as authService from '../services/authService';
import Avatar from './Avatar';

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

  return (
    <div className="relative" ref={menuRef}>

      {/* Bouton avatar */}
      <button
        onClick={() => setOuvert(!ouvert)}
        className="flex items-center gap-2 hover:bg-sister-50 pl-1 pr-3 py-1 rounded-full transition-all"
      >
        <Avatar prenom={utilisatrice.prenom} taille="sm" photoUrl={(utilisatrice as any).photoUrl} />
        <span className="text-sm font-medium text-cocoa-800 hidden sm:inline">
          {utilisatrice.prenom}
        </span>
        <ChevronDown
          size={14}
          className={`text-mauve-400 transition-transform duration-200 ${ouvert ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Menu déroulant */}
      {ouvert && (
        <div className="absolute right-0 top-full mt-2 w-64 glass rounded-3xl shadow-pink-md border border-sister-100/50 overflow-hidden z-30 animate-fade-in">

          {/* En-tête du menu */}
          <div className="p-4 bg-gradient-to-br from-sister-50/80 to-champagne-100/40 border-b border-sister-100/50 flex items-center gap-3">
            <Avatar prenom={utilisatrice.prenom} taille="lg" photoUrl={(utilisatrice as any).photoUrl} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-cocoa-900 truncate">{utilisatrice.prenom}</div>
              <div className="text-xs text-sister-600 truncate">{utilisatrice.pseudo}</div>
              <div className="text-xs text-mauve-400 truncate">{utilisatrice.email}</div>
            </div>
          </div>

          {/* Options */}
          <div className="py-2">
            <button
              onClick={() => { setOuvert(false); navigate('/profil'); }}
              className="w-full text-left px-4 py-2.5 hover:bg-sister-50/60 text-sm text-cocoa-800 transition flex items-center gap-3"
            >
              <User size={16} strokeWidth={1.75} className="text-mauve-500" />
              Mon profil
            </button>

            <button
              onClick={() => { setOuvert(false); navigate('/parametres'); }}
              className="w-full text-left px-4 py-2.5 hover:bg-sister-50/60 text-sm text-cocoa-800 transition flex items-center gap-3"
            >
              <Settings size={16} strokeWidth={1.75} className="text-mauve-500" />
              Paramètres
            </button>

            {utilisatrice.role === 'ADMIN' && (
              <button
                onClick={() => { setOuvert(false); navigate('/admin'); }}
                className="w-full text-left px-4 py-2.5 hover:bg-sister-50/60 text-sm text-sister-600 font-medium transition flex items-center gap-3"
              >
                <Shield size={16} strokeWidth={1.75} className="text-sister-500" />
                Gestion communauté
              </button>
            )}

            <div className="border-t border-sister-100/60 my-1.5 mx-3"></div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 hover:bg-red-50/60 text-sm text-red-500 transition flex items-center gap-3"
            >
              <LogOut size={16} strokeWidth={1.75} />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}