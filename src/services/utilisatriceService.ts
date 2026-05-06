// ============================================================================
// SISTER SPACE — Service Utilisatrices (côté front)
// ============================================================================

import api from './api';

export interface UtilisatriceListe {
  id: number;
  prenom: string;
  pseudo: string;
  bio: string | null;
}

export const getAllUtilisatrices = async (): Promise<UtilisatriceListe[]> => {
  const response = await api.get('/utilisatrices');
  return response.data.data;
};