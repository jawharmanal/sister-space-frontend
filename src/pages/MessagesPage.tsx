// ============================================================================
// SISTER SPACE — Page Messages
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Pencil, X, ChevronRight } from 'lucide-react';
import * as messageService from '../services/messageService';
import * as utilisatriceService from '../services/utilisatriceService';
import * as authService from '../services/authService';
import type { Conversation } from '../services/messageService';
import type { UtilisatriceListe } from '../services/utilisatriceService';
import BottomNav from '../components/BottomNav';
import Avatar from '../components/Avatar';

export default function MessagesPage() {
  const navigate = useNavigate();
  const utilisatriceConnectee = authService.getUtilisatriceConnectee();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

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

  const ouvrirModale = async () => {
    setModaleOuverte(true);
    setChargementUtilisatrices(true);
    try {
      const data = await utilisatriceService.getAllUtilisatrices();
      const filtrees = data.filter((u) => u.id !== utilisatriceConnectee?.id);
      setUtilisatrices(filtrees);
    } catch (err) {
      console.error('Erreur chargement utilisatrices :', err);
    } finally {
      setChargementUtilisatrices(false);
    }
  };

  const demarrerConversation = async (id_destinataire: number) => {
    try {
      const conv = await messageService.demarrerConversation(id_destinataire);
      setModaleOuverte(false);
      navigate(`/conversation/${conv.id}`);
    } catch (err) {
      console.error('Erreur démarrage conv :', err);
    }
  };

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
    if (diffMin < 1) return 'à l\'instant';
    if (diffMin < 60) return `${diffMin}m`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h`;
    const diffJ = Math.floor(diffH / 24);
    if (diffJ < 7) return `${diffJ}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="min-h-screen pb-28">

      {/* Header */}
      <header className="glass sticky top-0 z-10 border-b border-sister-100/50">
        <div className="max-w-2xl mx-auto px-5 py-4 flex justify-between items-center">
          <h1 className="font-serif text-2xl text-sister-600 italic">Messages</h1>
          <button
            onClick={ouvrirModale}
            className="w-10 h-10 rounded-full bg-gradient-sister text-white flex items-center justify-center shadow-pink-soft hover:shadow-pink-md hover:scale-105 active:scale-95 transition"
            title="Nouvelle conversation"
          >
            <Pencil size={16} strokeWidth={2} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 animate-fade-in-up">

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-sister-400 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-sister-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-sister-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <p className="text-mauve-400 text-sm">Chargement...</p>
          </div>
        )}

        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">⚠️ {erreur}</div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="card-sister p-10 text-center mt-4">
            <div className="text-5xl mb-3">💌</div>
            <p className="font-serif text-lg text-cocoa-900 mb-1">Aucune conversation</p>
            <p className="text-mauve-500 text-sm mb-5">Commence à échanger avec une sister !</p>
            <button onClick={ouvrirModale} className="btn-sister inline-flex items-center gap-2 text-sm">
              <Pencil size={14} strokeWidth={2} />
              Démarrer une conversation
            </button>
          </div>
        )}

        {!loading && conversations.map((conv) => {
          const nbNonLus = parseInt(conv.nb_non_lus);

          return (
            <Link
              key={conv.id}
              to={`/conversation/${conv.id}`}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-sister-50/60 transition-all cursor-pointer mb-1 group"
            >
              <div className="relative flex-shrink-0">
                <Avatar prenom={conv.autre_prenom} taille="lg" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white"></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <div className="font-semibold text-cocoa-900 truncate group-hover:text-sister-600 transition">
                    {conv.autre_prenom}
                  </div>
                  <div className="text-xs text-mauve-400 flex-shrink-0">
                    {formaterTemps(conv.date_dernier_message)}
                  </div>
                </div>
                <div className={`text-sm truncate mt-0.5 ${nbNonLus > 0 ? 'font-semibold text-cocoa-800' : 'text-mauve-500'}`}>
                  {conv.dernier_message || 'Démarrer la conversation...'}
                </div>
              </div>

              {nbNonLus > 0 && (
                <div className="bg-gradient-sister text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-pink-soft">
                  {nbNonLus}
                </div>
              )}
            </Link>
          );
        })}
      </main>

      {/* MODALE — Nouvelle conversation */}
      {modaleOuverte && (
        <div
          className="fixed inset-0 bg-cocoa-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setModaleOuverte(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-pink-md w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modale */}
            <div className="px-5 py-4 border-b border-sister-100 flex justify-between items-center">
              <h2 className="font-serif text-xl text-cocoa-900">Nouvelle conversation</h2>
              <button
                onClick={() => setModaleOuverte(false)}
                className="text-mauve-400 hover:text-cocoa-800 hover:bg-sister-50 rounded-full p-2 transition"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            {/* Recherche */}
            <div className="p-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mauve-400" />
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher une sister..."
                  className="w-full pl-11 pr-4 py-3 bg-sister-50/60 border border-sister-100 rounded-full text-cocoa-900 placeholder-mauve-400 focus:outline-none focus:border-sister-400 focus:ring-4 focus:ring-sister-100"
                />
              </div>
            </div>

            {/* Liste */}
            <div className="overflow-y-auto px-2 pb-4 flex-1">
              {chargementUtilisatrices && (
                <div className="text-center text-mauve-400 py-8">Chargement...</div>
              )}

              {!chargementUtilisatrices && utilisatricesFiltrees.length === 0 && (
                <div className="text-center text-mauve-400 py-8">
                  Aucune sister trouvée
                </div>
              )}

              {!chargementUtilisatrices && utilisatricesFiltrees.map((u) => (
                <button
                  key={u.id}
                  onClick={() => demarrerConversation(u.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-sister-50/60 transition text-left group"
                >
                  <Avatar prenom={u.prenom} taille="md" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-cocoa-900">{u.prenom}</div>
                    <div className="text-xs text-sister-600">{u.pseudo}</div>
                  </div>
                  <ChevronRight size={18} className="text-mauve-400 group-hover:text-sister-500 group-hover:translate-x-1 transition" />
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