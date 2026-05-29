// ============================================================================
// SISTER SPACE — Sidebar gauche (avec icônes Lucide React)
// ============================================================================

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, Compass, MessageCircle, Plus, User, Shield, MoreHorizontal, LogOut } from 'lucide-react';
import * as authService from '../services/authService';
import * as messageService from '../services/messageService';

interface UtilisatriceConnectee {
  id: number;
  prenom: string;
  pseudo: string;
  email: string;
  role: string;
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UtilisatriceConnectee | null>(null);
  const [nbNonLus, setNbNonLus] = useState(0);
  const [menuOuvert, setMenuOuvert] = useState(false);

  // Charger l'utilisatrice connectée
  useEffect(() => {
    const u = authService.getUtilisatriceConnectee();
    if (u) setUser(u);
  }, []);

  // Polling des messages non lus (toutes les 30s)
  useEffect(() => {
    const charger = async () => {
      try {
        const nb = await messageService.compterMessagesNonLus();
        setNbNonLus(nb || 0);
      } catch (e) {
         // silencieux
      }
    };
    charger();
    const interval = setInterval(charger, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Initiale du prénom pour l'avatar
  const initiale = user?.prenom?.charAt(0).toUpperCase() || '?';

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-sister-100 flex flex-col fixed left-0 top-0">
      
      {/* Logo */}
      <Link to="/feed" className="flex items-center gap-3 px-6 pt-6 pb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sister-400 to-sister-500 flex items-center justify-center text-white font-bold shadow-md">
          s
        </div>
        <span className="text-2xl font-serif italic text-sister-600">Sister Space</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        
        {/* Home */}
        <Link
          to="/feed"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isActive('/feed')
              ? 'bg-sister-100 text-sister-600 font-semibold'
              : 'text-gray-700 hover:bg-sister-50'
          }`}
        >
          <Home className="w-5 h-5" strokeWidth={2} />
          <span>Home</span>
        </Link>

        {/* Explore */}
        <Link
          to="/explore"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isActive('/explore')
              ? 'bg-sister-100 text-sister-600 font-semibold'
              : 'text-gray-700 hover:bg-sister-50'
          }`}
        >
          <Compass className="w-5 h-5" strokeWidth={2} />
          <span>Explore</span>
        </Link>

        {/* Messages avec badge */}
        <Link
          to="/messages"
          className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
            isActive('/messages')
              ? 'bg-sister-100 text-sister-600 font-semibold'
              : 'text-gray-700 hover:bg-sister-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5" strokeWidth={2} />
            <span>Messages</span>
          </div>
          {nbNonLus > 0 && (
            <span className="bg-gradient-to-r from-sister-400 to-sister-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[24px] text-center shadow-sm">
              {nbNonLus}
            </span>
          )}
        </Link>

        {/* Create */}
        <Link
          to="/creer-post"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isActive('/creer-post')
              ? 'bg-sister-100 text-sister-600 font-semibold'
              : 'text-gray-700 hover:bg-sister-50'
          }`}
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          <span>Create</span>
        </Link>

        {/* Profile */}
        <Link
          to="/profil"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isActive('/profil')
              ? 'bg-sister-100 text-sister-600 font-semibold'
              : 'text-gray-700 hover:bg-sister-50'
          }`}
        >
          <User className="w-5 h-5" strokeWidth={2} />
          <span>Profile</span>
        </Link>

        {/* Admin (uniquement si role ADMIN) */}
        {user?.role === 'ADMIN' && (
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isActive('/admin')
                ? 'bg-sister-100 text-sister-600 font-semibold'
                : 'text-gray-700 hover:bg-sister-50'
            }`}
          >
            <Shield className="w-5 h-5" strokeWidth={2} />
            <span>Admin</span>
          </Link>
        )}
      </nav>

      {/* Carte utilisatrice en bas */}
      {user && (
        <div className="relative p-3 m-3 bg-sister-50 rounded-2xl">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sister-400 to-sister-500 flex items-center justify-center text-white font-bold shadow-sm">
              {initiale}
            </div>
            {/* Nom + pseudo */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.prenom}
              </p>
              <p className="text-xs text-gray-500 truncate">
                @{user.pseudo}
              </p>
            </div>
            {/* Menu ... */}
            <button
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="text-gray-400 hover:text-gray-700 transition p-1"
            >
              <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* Mini menu déconnexion */}
          {menuOuvert && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-lg border border-sister-100 py-1 z-10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" strokeWidth={2} />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}