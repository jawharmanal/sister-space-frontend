// ============================================================================
// SISTER SPACE — Service Messagerie (côté front)
// ============================================================================

import api from './api';

export interface Conversation {
  id: number;
  derniere_activite: string;
  id_autre: number;
  autre_prenom: string;
  autre_pseudo: string;
  dernier_message: string | null;
  date_dernier_message: string | null;
  nb_non_lus: string;
}

export interface Message {
  id: number;
  id_expeditrice: number;
  contenu: string;
  date_envoi: string;
  est_lu: boolean;
}

export interface DetailConversation {
  conversation: {
    id: number;
    autre: {
      id: number;
      prenom: string;
      pseudo: string;
    };
  };
  messages: Message[];
}

// Lister mes conversations
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get('/conversations');
  return response.data.data;
};

// Récupérer une conversation avec ses messages
export const getConversation = async (id: number): Promise<DetailConversation> => {
  const response = await api.get(`/conversations/${id}/messages`);
  return response.data.data;
};

// Envoyer un message
export const envoyerMessage = async (id_conversation: number, contenu: string): Promise<Message> => {
  const response = await api.post(`/conversations/${id_conversation}/messages`, { contenu });
  return response.data.data;
};
// Démarrer une nouvelle conversation
export const demarrerConversation = async (id_destinataire: number) => {
  const response = await api.post('/conversations', { id_destinataire });
  return response.data.data; // { id, deja_existante }
};