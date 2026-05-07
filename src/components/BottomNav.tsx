// ============================================================================
// SISTER SPACE — Bottom Navigation (avec badge + toast notifications)
// ============================================================================

import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as messageService from '../services/messageService';
import * as authService from '../services/authService';
import Toast from './Toast';

export default function BottomNav() {
  const location = useLocation();
  const [nbNonLus, setNbNonLus] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Pour éviter de notifier au premier chargement
  const premierChargement = useRef(true);
  const ancienNbNonLus = useRef(0);

  // Helper pour savoir si une route est active
  const estActif = (chemin: string) => location.pathname === chemin;

  // Style commun pour les liens
  const styleLien = (actif: boolean) =>
    `flex-1 flex items-center justify-center text-2xl py-3 transition ${
      actif ? 'text-sister-600' : 'text-gray-400 hover:text-sister-400'
    }`;

  // Charger le nombre de messages non lus
  const chargerNonLus = async () => {
    if (!authService.estConnectee()) return;
    try {
      const nb = await messageService.compterMessagesNonLus();
      
      // 🎉 Si le nombre A AUGMENTÉ et qu'on n'est pas au premier chargement → TOAST
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

  return (
    <>
      {/* Toast de notification */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Bottom Nav */}
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

          {/* Messagerie avec badge */}
          <Link 
            to="/messages" 
            className={`${styleLien(estActif('/messages'))} relative`} 
            title="Messages"
          >
            💬
            {nbNonLus > 0 && (
              <span className="absolute top-2 right-1/2 translate-x-4 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-md animate-pulse">
                {nbNonLus > 99 ? '99+' : nbNonLus}
              </span>
            )}
          </Link>

          {/* Profil */}
          <Link to="/profil" className={styleLien(estActif('/profil'))} title="Profil">
            👤
          </Link>
        </div>
      </nav>
    </>
  );
}