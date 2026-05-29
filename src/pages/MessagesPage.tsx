// ============================================================================
// SISTER SPACE — Messages Page (3 colonnes, refonte 2026)
// ============================================================================

import { useEffect, useState, useRef } from 'react';
import { Search, Pencil, Send, Plus, MoreHorizontal } from 'lucide-react';
import * as messageService from '../services/messageService';
import * as authService from '../services/authService';
import Sidebar from '../components/Sidebar';

export default function MessagesPage() {
  const utilisatriceConnectee = authService.getUtilisatriceConnectee();
  const monId = utilisatriceConnectee?.id || 0;

  const [conversations, setConversations] = useState<messageService.Conversation[]>([]);
  const [conversationActive, setConversationActive] = useState<messageService.DetailConversation | null>(null);
  const [recherche, setRecherche] = useState('');
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger les conversations au montage
  useEffect(() => {
    chargerConversations();
  }, []);

  // Scroll auto vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationActive?.messages]);

  const chargerConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
      // Auto-ouvrir la première conversation
      if (data.length > 0 && !conversationActive) {
        ouvrirConversation(data[0].id);
      }
    } catch (e) {
      console.error('Erreur conversations:', e);
    } finally {
      setLoading(false);
    }
  };

  const ouvrirConversation = async (id: number) => {
    try {
      const detail = await messageService.getConversation(id);
      setConversationActive(detail);
      // Recharger les conversations pour mettre à jour les non-lus
      chargerConversations();
    } catch (e) {
      console.error('Erreur conversation:', e);
    }
  };

  const envoyer = async () => {
    if (!nouveauMessage.trim() || !conversationActive) return;
    try {
      await messageService.envoyerMessage(conversationActive.conversation.id, nouveauMessage);
      setNouveauMessage('');
      // Recharger
      ouvrirConversation(conversationActive.conversation.id);
    } catch (e) {
      console.error('Erreur envoi:', e);
    }
  };

  // Filtrer les conversations selon la recherche
  const conversationsFiltrees = conversations.filter(c =>
    c.autre_prenom.toLowerCase().includes(recherche.toLowerCase()) ||
    c.autre_pseudo.toLowerCase().includes(recherche.toLowerCase())
  );

  // Helpers
  const initiale = (prenom: string) => prenom?.charAt(0).toUpperCase() || '?';
  
  const getCouleurAvatar = (prenom: string) => {
    const couleurs = [
      'from-sister-300 to-sister-500',
      'from-peach-200 to-peach-300',
      'from-sister-200 to-sister-400',
      'from-sister-400 to-sister-600',
      'from-peach-300 to-sister-400',
    ];
    return couleurs[(prenom?.charCodeAt(0) || 0) % couleurs.length];
  };

  const formaterTemps = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const formaterHeure = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sister-50 via-cream to-sister-100">
      
      {/* Sidebar gauche (fixed) */}
      <Sidebar />

      {/* Contenu : 2 colonnes (liste + conversation) */}
      <div className="ml-64 flex h-screen">
        
        {/* === COLONNE 1 : Liste des conversations === */}
        <section className="w-96 bg-white border-r border-sister-100 flex flex-col">
          
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-sister-100">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-sister-400 to-sister-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition">
                <Pencil className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Search messages"
                className="w-full pl-10 pr-4 py-2.5 bg-sister-50 border border-transparent rounded-full focus:outline-none focus:border-sister-300 focus:bg-white text-sm transition"
              />
            </div>
          </div>

          {/* Liste */}
          <div className="flex-1 overflow-y-auto py-2">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Chargement...</div>
            ) : conversationsFiltrees.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">Aucune conversation</div>
            ) : (
              conversationsFiltrees.map((c) => {
                const isActive = conversationActive?.conversation.id === c.id;
                const nbNonLus = parseInt(c.nb_non_lus) || 0;
                return (
                  <button
                    key={c.id}
                    onClick={() => ouvrirConversation(c.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-sister-50 transition border-l-4 ${
                      isActive ? 'bg-sister-50 border-sister-500' : 'border-transparent'
                    }`}
                  >
                    {/* Avatar avec indicateur en ligne */}
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCouleurAvatar(c.autre_prenom)} flex items-center justify-center text-white font-bold shadow-sm`}>
                        {initiale(c.autre_prenom)}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 truncate text-sm">
                          {c.autre_prenom}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formaterTemps(c.date_dernier_message)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className={`text-xs truncate ${nbNonLus > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                          {c.dernier_message || 'Aucun message'}
                        </p>
                        {nbNonLus > 0 && (
                          <span className="bg-gradient-to-r from-sister-400 to-sister-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-2 flex-shrink-0 shadow-sm">
                            {nbNonLus}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* === COLONNE 2 : Conversation active === */}
        <section className="flex-1 flex flex-col bg-cream/30">
          {conversationActive ? (
            <>
              {/* Header de la conversation */}
              <div className="px-6 py-4 bg-white border-b border-sister-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getCouleurAvatar(conversationActive.conversation.autre.prenom)} flex items-center justify-center text-white font-bold shadow-sm`}>
                      {initiale(conversationActive.conversation.autre.prenom)}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {conversationActive.conversation.autre.prenom}
                    </p>
                    <p className="text-xs text-green-500 font-medium">Active now</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-700 transition">
                  <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
                {/* Marqueur de jour */}
                <div className="text-center text-xs text-gray-400 font-medium py-2">
                  TODAY · {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>

                {conversationActive.messages.map((msg) => {
                  const estMoi = msg.id_expeditrice === monId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${estMoi ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl ${
                          estMoi
                            ? 'bg-gradient-to-r from-sister-400 to-sister-500 text-white rounded-br-sm shadow-md'
                            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-sister-100'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.contenu}</p>
                        <p className={`text-[10px] mt-1 ${estMoi ? 'text-white/70' : 'text-gray-400'}`}>
                          {formaterHeure(msg.date_envoi)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="px-6 py-4 bg-white border-t border-sister-100">
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-sister-50 hover:bg-sister-100 text-sister-500 flex items-center justify-center transition flex-shrink-0">
                    <Plus className="w-5 h-5" strokeWidth={2} />
                  </button>
                  <input
                    type="text"
                    value={nouveauMessage}
                    onChange={(e) => setNouveauMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        envoyer();
                      }
                    }}
                    placeholder={`Message ${conversationActive.conversation.autre.prenom}...`}
                    className="flex-1 px-4 py-2.5 bg-sister-50 border border-transparent rounded-full focus:outline-none focus:border-sister-300 focus:bg-white text-sm transition"
                  />
                  <button
                    onClick={envoyer}
                    disabled={!nouveauMessage.trim()}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-sister-400 to-sister-500 text-white flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0"
                  >
                    <Send className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Aucune conversation sélectionnée */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-sister-100 flex items-center justify-center mx-auto mb-4">
                  <Pencil className="w-8 h-8 text-sister-500" strokeWidth={1.5} />
                </div>
                <p className="text-gray-500 font-medium">Sélectionne une conversation</p>
                <p className="text-sm text-gray-400 mt-1">ou commences-en une nouvelle 🌸</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}