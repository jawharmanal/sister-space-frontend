// ============================================================================
// SISTER SPACE — Page Conversation (chat)
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import * as messageService from '../services/messageService';
import * as authService from '../services/authService';
import type { Message } from '../services/messageService';
import Avatar from '../components/Avatar';

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const utilisatrice = authService.getUtilisatriceConnectee();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [autre, setAutre] = useState<{ id: number; prenom: string; pseudo: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  useEffect(() => {
    if (!id) return;
    const charger = async () => {
      try {
        const data = await messageService.getConversation(parseInt(id));
        setAutre(data.conversation.autre);
        setMessages(data.messages);
      } catch (err) {
        console.error('Erreur chargement conversation :', err);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEnvoi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauMessage.trim() || !id) return;

    setEnvoiEnCours(true);
    try {
      const message = await messageService.envoyerMessage(parseInt(id), nouveauMessage);
      setMessages([...messages, message]);
      setNouveauMessage('');
    } catch (err) {
      console.error('Erreur envoi :', err);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const formaterHeure = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!utilisatrice) return null;

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="glass border-b border-sister-100/50 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/messages')}
            className="p-2 -ml-2 rounded-full hover:bg-sister-50 text-mauve-500 hover:text-sister-600 transition"
          >
            <ArrowLeft size={20} strokeWidth={1.75} />
          </button>
          {autre && (
            <>
              <div className="relative">
                <Avatar prenom={autre.prenom} taille="md" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
              </div>
              <div>
                <div className="font-semibold text-cocoa-900">{autre.prenom}</div>
                <div className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  En ligne
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
        {loading && (
          <div className="text-center text-mauve-400 py-8">Chargement...</div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center text-mauve-500 py-12">
            <div className="text-4xl mb-3">💌</div>
            <p className="font-serif text-lg text-cocoa-900 mb-1">Démarre la conversation !</p>
            <p className="text-sm">Envoie ton premier message ✨</p>
          </div>
        )}

        {!loading && messages.map((msg, index) => {
          const estMoi = msg.id_expeditrice === utilisatrice.id;
          const messagePrecedent = index > 0 ? messages[index - 1] : null;
          const memeMessageGroupe = messagePrecedent?.id_expeditrice === msg.id_expeditrice;

          return (
            <div
              key={msg.id}
              className={`flex mb-1.5 ${estMoi ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-[75%] ${estMoi ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-2.5 ${
                    estMoi
                      ? 'bg-gradient-sister text-white shadow-pink-soft rounded-3xl rounded-br-lg'
                      : 'bg-white text-cocoa-900 border border-sister-100 rounded-3xl rounded-bl-lg shadow-cream'
                  }`}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">{msg.contenu}</p>
                </div>
                {!memeMessageGroupe && (
                  <div className={`text-[11px] text-mauve-400 mt-1 px-2 ${estMoi ? 'text-right' : 'text-left'}`}>
                    {formaterHeure(msg.date_envoi)}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </main>

      {/* Zone de saisie */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-sister-100 p-3 sticky bottom-0">
        <form onSubmit={handleEnvoi} className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={nouveauMessage}
            onChange={(e) => setNouveauMessage(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 px-4 py-3 bg-sister-50/60 border border-sister-100 rounded-full text-cocoa-900 placeholder-mauve-400 focus:outline-none focus:border-sister-400 focus:ring-4 focus:ring-sister-100"
          />
          <button
            type="submit"
            disabled={envoiEnCours || !nouveauMessage.trim()}
            className="w-11 h-11 rounded-full bg-gradient-sister text-white flex items-center justify-center disabled:opacity-40 shadow-pink-soft hover:shadow-pink-md hover:scale-105 active:scale-95 transition disabled:hover:scale-100"
          >
            <Send size={16} strokeWidth={2} />
          </button>
        </form>
      </footer>
    </div>
  );
}