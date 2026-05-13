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

// ----------------------------------------------------------------------------
// Connexion
// - seSouvenirDeMoi = true  → localStorage (token persistant, durée 30j)
// - seSouvenirDeMoi = false → sessionStorage (token efface à la fermeture du navigateur, durée 24h)
// ----------------------------------------------------------------------------
export const seConnecter = async (
  email: string, 
  mot_de_passe: string,
  seSouvenirDeMoi: boolean = false
) => {
  const response = await api.post('/auth/login', { 
    email, 
    mot_de_passe,
    seSouvenirDeMoi,
  });
  const { token, utilisatrice } = response.data.data;
  
  // Nettoyer les deux storages avant de stocker (au cas où il y aurait un vieux token quelque part)
  localStorage.removeItem('token');
  localStorage.removeItem('utilisatrice');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('utilisatrice');
  
  // Choisir le bon storage selon la case "Se souvenir de moi"
  const storage = seSouvenirDeMoi ? localStorage : sessionStorage;
  storage.setItem('token', token);
  storage.setItem('utilisatrice', JSON.stringify(utilisatrice));
  
  return utilisatrice;
};

// ----------------------------------------------------------------------------
// Déconnexion : nettoie les deux storages
// ----------------------------------------------------------------------------
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('utilisatrice');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('utilisatrice');
};

// ----------------------------------------------------------------------------
// Récupérer le token (vérifie les deux storages)
// ----------------------------------------------------------------------------
export const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// ----------------------------------------------------------------------------
// Récupérer l'utilisatrice connectée (vérifie les deux storages)
// ----------------------------------------------------------------------------
export const getUtilisatriceConnectee = (): Utilisatrice | null => {
  const data = localStorage.getItem('utilisatrice') || sessionStorage.getItem('utilisatrice');
  return data ? JSON.parse(data) : null;
};

// ----------------------------------------------------------------------------
// Vérifier si l'utilisatrice est connectée
// ----------------------------------------------------------------------------
export const estConnectee = (): boolean => {
  return !!getToken();
};