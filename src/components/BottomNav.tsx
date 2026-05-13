// ============================================================================
// SISTER SPACE — Bottom Navigation (avec badge + toast notifications)
// Vibe : Pinterest / Glossier - barre flottante glassmorphism
// ============================================================================

import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MessageCircle, User, Plus } from 'lucide-react';
import * as messageService from '../services/messageService';
import * as authService from '../services/authService';
import Toast from './Toast';

export default function BottomNav() {
  const location = useLocation();
  const [nbNonLus, setNbNonLus] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const premierChargement = useRef(true);
  const ancienNbNonLus = useRef(0);

  const estActif = (chemin: string) => location.pathname === chemin;

  // Charger le nombre de messages non lus
  const chargerNonLus = async () => {
    if (!authService.estConnectee()) return;
    try {
      const nb = await messageService.compterMessagesNonLus();

      if (!premierChargement.current && nb > ancienNbNonLus.current) {
        const diff = nb - ancienNbNonLus.current;
        setToastMessage(
          diff === 1
            ? 'Tu as reçu un nouveau message !'
            : `Tu as reçu ${diff} nouveaux messages !`
        );
        setToastVisible(true);
      }

      ancienNbNonLus.current = nb;
      setNbNonLus(nb);
      premierChargement.current = false;
    } catch (err) {
      console.error('Erreur comptage non lus :', err);
    }
  };

  useEffect(() => {
    chargerNonLus();
    const intervalle = setInterval(chargerNonLus, 30000);
    return () => clearInterval(intervalle);
  }, [location.pathname]);

  // Classes d'un lien (actif / inactif)
  const styleLien = (actif: boolean) =>
    `flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all duration-200 relative ${
      actif ? 'text-sister-600' : 'text-mauve-400 hover:text-sister-500'
    }`;

  return (
    <>
      {/* Toast de notification */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Bottom Nav — barre flottante glassmorphism */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 pb-4 pt-1 px-3 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <div className="glass shadow-pink-md rounded-full flex items-center px-2 py-1.5">

            {/* Accueil */}
            <Link to="/feed" className={styleLien(estActif('/feed'))} title="Accueil">
              <Home size={22} strokeWidth={estActif('/feed') ? 2.5 : 1.75} />
              {estActif('/feed') && (
                <span className="absolute -bottom-0.5 w-1.5 h-1.5 bg-sister-500 rounded-full" />
              )}
            </Link>

            {/* Explorer */}
            <Link to="/explore" className={styleLien(estActif('/explore'))} title="Explorer">
              <Compass size={22} strokeWidth={estActif('/explore') ? 2.5 : 1.75} />
              {estActif('/explore') && (
                <span className="absolute -bottom-0.5 w-1.5 h-1.5 bg-sister-500 rounded-full" />
              )}
            </Link>

            {/* Bouton créer un post (proéminent au centre) */}
            <Link
              to="/creer-post"
              className="mx-2 -my-3 w-14 h-14 bg-gradient-sister text-white rounded-full flex items-center justify-center shadow-pink-md hover:scale-110 hover:shadow-pink-glow active:scale-95 transition-all duration-200"
              title="Créer un post"
            >
              <Plus size={26} strokeWidth={2.5} />
            </Link>

            {/* Messagerie avec badge */}
            <Link
              to="/messages"
              className={styleLien(estActif('/messages'))}
              title="Messages"
            >
              <div className="relative">
                <MessageCircle size={22} strokeWidth={estActif('/messages') ? 2.5 : 1.75} />
                {nbNonLus > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-sister text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-pink-soft ring-2 ring-white">
                    {nbNonLus > 99 ? '99+' : nbNonLus}
                  </span>
                )}
              </div>
              {estActif('/messages') && (
                <span className="absolute -bottom-0.5 w-1.5 h-1.5 bg-sister-500 rounded-full" />
              )}
            </Link>

            {/* Profil */}
            <Link to="/profil" className={styleLien(estActif('/profil'))} title="Profil">
              <User size={22} strokeWidth={estActif('/profil') ? 2.5 : 1.75} />
              {estActif('/profil') && (
                <span className="absolute -bottom-0.5 w-1.5 h-1.5 bg-sister-500 rounded-full" />
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}