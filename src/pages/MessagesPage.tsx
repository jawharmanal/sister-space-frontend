// ============================================================================
// SISTER SPACE — Page Messages (avec démarrage de conversation)
// ============================================================================

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as messageService from '../services/messageService';
import * as utilisatriceService from '../services/utilisatriceService';
import * as authService from '../services/authService';
import type { Conversation } from '../services/messageService';
import type { UtilisatriceListe } from '../services/utilisatriceService';
import BottomNav from '../components/BottomNav';

export default function MessagesPage() {
  const navigate = useNavigate();
  const utilisatriceConnectee = authService.getUtilisatriceConnectee();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  // États pour la modale de nouvelle conversation
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [utilisatrices, setUtilisatrices] = useState<UtilisatriceListe[]>([]);
  const [chargementUtilisatrices, setChargementUtilisatrices] = useState(false);
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await messageService.getConversations();
        setConversations(data);
      } catch (err: any) {
        setErreur(err.response?.data?.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  // Ouvrir la modale + charger les utilisatrices
  const ouvrirModale = async () => {
    setModaleOuverte(true);
    setChargementUtilisatrices(true);
    try {
      const data = await utilisatriceService.getAllUtilisatrices();
      // Filtrer pour exclure soi-même
      const filtrees = data.filter((u) => u.id !== utilisatriceConnectee?.id);
      setUtilisatrices(filtrees);
    } catch (err) {
      console.error('Erreur chargement utilisatrices :', err);
    } finally {
      setChargementUtilisatrices(false);
    }
  };

  // Démarrer ou rejoindre une conversation
  const demarrerConversation = async (id_destinataire: number) => {
    try {
      const conv = await messageService.demarrerConversation(id_destinataire);
      setModaleOuverte(false);
      navigate(`/conversation/${conv.id}`);
    } catch (err) {
      console.error('Erreur démarrage conv :', err);
    }
  };

  // Filtrer les utilisatrices par recherche
  const utilisatricesFiltrees = utilisatrices.filter(
    (u) =>
      u.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      u.pseudo.toLowerCase().includes(recherche.toLowerCase())
  );

  const formaterTemps = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const maintenant = new Date();
    const diffMin = Math.floor((maintenant.getTime() - date.getTime()) / 60000);
    if (diffMin < 1) return 'now';
    if (diffMin < 60) return `${diffMin}m`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h`;
    const diffJ = Math.floor(diffH / 24);
    if (diffJ < 7) return `${diffJ}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="min-h-screen pb-24">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <button
            onClick={ouvrirModale}
            className="w-10 h-10 rounded-full bg-sister-100 text-sister-600 flex items-center justify-center hover:bg-sister-200 transition"
            title="Nouvelle conversation"
          >
            ✏️
          </button>
        </div>
      </header>

      {/* Liste des conversations */}
      <main className="max-w-2xl mx-auto px-4 pt-4">
        
        {loading && (
          <div className="text-center text-gray-400 py-12">Chargement... 🌸</div>
        )}

        {erreur && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl">⚠️ {erreur}</div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="bg-pink-50 rounded-2xl p-8 text-center text-gray-500 mt-4">
            <div className="text-4xl mb-3">💌</div>
            <p className="mb-4">Tu n'as pas encore de conversation</p>
            <button
              onClick={ouvrirModale}
              className="bg-sister-500 hover:bg-sister-600 text-white px-5 py-2 rounded-full font-medium transition"
            >
              ✏️ Démarrer une conversation
            </button>
          </div>
        )}

        {!loading && conversations.map((conv) => {
          const initiale = conv.autre_prenom.charAt(0).toUpperCase();
          const nbNonLus = parseInt(conv.nb_non_lus);

          return (
            <Link
              key={conv.id}
              to={`/conversation/${conv.id}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition cursor-pointer"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {initiale}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-gray-800 truncate">{conv.autre_prenom}</div>
                  <div className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {formaterTemps(conv.date_dernier_message)}
                  </div>
                </div>
                <div className={`text-sm truncate ${nbNonLus > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                  {conv.dernier_message || 'Démarrer la conversation...'}
                </div>
              </div>

              {nbNonLus > 0 && (
                <div className="bg-sister-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  {nbNonLus}
                </div>
              )}
            </Link>
          );
        })}
      </main>

      {/* MODALE — Démarrer une conversation */}
      {modaleOuverte && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
          onClick={() => setModaleOuverte(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header de la modale */}
            <div className="px-5 py-4 border-b border-pink-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Nouvelle conversation</h2>
              <button
                onClick={() => setModaleOuverte(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Recherche */}
            <div className="p-4">
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="🔍 Rechercher une sister..."
                className="w-full px-4 py-2 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sister-300"
              />
            </div>

            {/* Liste */}
            <div className="overflow-y-auto px-2 pb-4 flex-1">
              {chargementUtilisatrices && (
                <div className="text-center text-gray-400 py-8">Chargement... 🌸</div>
              )}

              {!chargementUtilisatrices && utilisatricesFiltrees.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  Aucune utilisatrice trouvée
                </div>
              )}

              {!chargementUtilisatrices && utilisatricesFiltrees.map((u) => (
                <button
                  key={u.id}
                  onClick={() => demarrerConversation(u.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {u.prenom.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800">{u.prenom}</div>
                    <div className="text-xs text-sister-500">{u.pseudo}</div>
                  </div>
                  <div className="text-sister-400 text-xl">→</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}