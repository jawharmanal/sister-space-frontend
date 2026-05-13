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
  bio?: string | null;
  photoUrl?: string | null;
}

// ----------------------------------------------------------------------------
// Choisir automatiquement le bon storage (celui qui contient déjà le token)
// ----------------------------------------------------------------------------
const getStorageActif = (): Storage => {
  if (localStorage.getItem('token')) return localStorage;
  return sessionStorage;
};

// ----------------------------------------------------------------------------
// Connexion
// - seSouvenirDeMoi = true  → localStorage (token persistant, durée 30j)
// - seSouvenirDeMoi = false → sessionStorage (token effacé à la fermeture, 24h)
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
  
  // Nettoyer les deux storages avant de stocker
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
// Mettre à jour les infos de l'utilisatrice connectée dans le storage
// (utilisé après modification du profil)
// Accepte un objet partiel : seuls les champs fournis sont mis à jour
// ----------------------------------------------------------------------------
export const mettreAJourUtilisatriceConnectee = (
  nouvellesInfos: Partial<Utilisatrice> & { photo_url?: string | null }
) => {
  const actuelle = getUtilisatriceConnectee();
  if (!actuelle) return;

  // Le backend renvoie photo_url en snake_case → on convertit en photoUrl côté front
  const { photo_url, ...autresInfos } = nouvellesInfos as any;

  const utilisatriceMaj: Utilisatrice = {
    ...actuelle,
    ...autresInfos,
    ...(photo_url !== undefined ? { photoUrl: photo_url } : {}),
  };

  const storage = getStorageActif();
  storage.setItem('utilisatrice', JSON.stringify(utilisatriceMaj));
};

// ----------------------------------------------------------------------------
// Vérifier si l'utilisatrice est connectée
// ----------------------------------------------------------------------------
export const estConnectee = (): boolean => {
  return !!getToken();
};