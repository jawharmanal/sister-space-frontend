// ============================================================================
// SISTER SPACE — Service Authentification (côté front)
// ============================================================================

import api from './api';

export interface Utilisatrice {
  id: number;
  email: string;
  prenom: string;
  pseudo: string;
  statut: string;
  role: string;
}

export const login = async (email: string, mot_de_passe: string) => {
  const response = await api.post('/auth/login', { email, mot_de_passe });
  
  // Stocker le token et les infos utilisatrice
  localStorage.setItem('token', response.data.data.token);
  localStorage.setItem('utilisatrice', JSON.stringify(response.data.data.utilisatrice));
  
  return response.data.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('utilisatrice');
};

export const getUtilisatriceConnectee = (): Utilisatrice | null => {
  const data = localStorage.getItem('utilisatrice');
  return data ? JSON.parse(data) : null;
};

export const estConnectee = (): boolean => {
  return !!localStorage.getItem('token');
};