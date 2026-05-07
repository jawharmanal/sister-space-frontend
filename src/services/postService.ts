// ============================================================================
// SISTER SPACE — Service Posts (côté front)
// ============================================================================

import api from './api';

export interface Post {
  id: number;
  contenu: string;
  photos_urls: string[] | null;
  date_creation: string;
  id_auteure: number;
  auteure_prenom: string;
  auteure_pseudo: string;
  nb_likes: string;
  nb_commentaires: string;
}

// Récupérer tous les posts
export const getAllPosts = async (id_categorie?: number): Promise<Post[]> => {
  const url = id_categorie ? `/posts?categorie=${id_categorie}` : '/posts';
  const response = await api.get(url);
  return response.data.data;
};

// Liker un post
export const likerPost = async (id_post: number) => {
  const response = await api.post(`/posts/${id_post}/like`);
  return response.data;
};

// Unliker un post
export const unlikerPost = async (id_post: number) => {
  const response = await api.delete(`/posts/${id_post}/like`);
  return response.data;
};
// Type pour un commentaire
export interface Commentaire {
  id: number;
  contenu: string;
  date_creation: string;
  id_auteure: number;
  auteure_prenom: string;
  auteure_pseudo: string;
}

// Récupérer un post avec ses commentaires
export const getPost = async (id: number) => {
  const response = await api.get(`/posts/${id}`);
  return response.data.data;
};

// Créer un commentaire
export const creerCommentaire = async (id_post: number, contenu: string): Promise<Commentaire> => {
  const response = await api.post(`/posts/${id_post}/commentaires`, { contenu });
  return response.data.data;
};