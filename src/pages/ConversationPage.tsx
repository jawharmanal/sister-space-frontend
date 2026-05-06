// ============================================================================
// SISTER SPACE — Page Conversation (chat)
// ============================================================================

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as messageService from '../services/messageService';
import * as authService from '../services/authService';
import type { Message } from '../services/messageService';

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

  // Charger la conversation
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

  // Scroll en bas après chargement ou nouveau message
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-white">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/messages')}
            className="text-sister-500 text-xl hover:text-sister-700"
          >
            ←
          </button>
          {autre && (
            <>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white font-bold">
                {autre.prenom.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{autre.prenom}</div>
                <div className="text-xs text-green-500">● Active now</div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
        {loading && (
          <div className="text-center text-gray-400 py-8">Chargement... 🌸</div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>💌 Démarre la conversation !</p>
          </div>
        )}

        {!loading && messages.map((msg) => {
          const estMoi = msg.id_expeditrice === utilisatrice.id;
          return (
            <div
              key={msg.id}
              className={`flex mb-3 ${estMoi ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${estMoi ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    estMoi
                      ? 'bg-gradient-to-br from-sister-400 to-sister-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-pink-100 rounded-bl-md'
                  }`}
                >
                  {msg.contenu}
                </div>
                <div className={`text-xs text-gray-400 mt-1 ${estMoi ? 'text-right' : 'text-left'}`}>
                  {formaterHeure(msg.date_envoi)}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </main>

      {/* Zone de saisie */}
      <footer className="bg-white border-t border-pink-100 p-3 sticky bottom-0">
        <form onSubmit={handleEnvoi} className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={nouveauMessage}
            onChange={(e) => setNouveauMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 px-4 py-2 bg-pink-50 border border-pink-100 rounded-full focus:outline-none focus:ring-2 focus:ring-sister-300"
          />
          <button
            type="submit"
            disabled={envoiEnCours || !nouveauMessage.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-sister-400 to-sister-500 text-white flex items-center justify-center disabled:opacity-40 hover:shadow-lg transition"
          >
            ➤
          </button>
        </form>
      </footer>
    </div>
  );
}