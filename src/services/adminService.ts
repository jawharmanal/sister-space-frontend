// ============================================================================
// SISTER SPACE — Service Admin (côté front)
// ============================================================================

import api from './api';

export interface UtilisatriceAdmin {
  id: number;
  email: string;
  prenom: string;
  pseudo: string;
  date_naissance: string;
  bio: string | null;
  statut: 'EN_ATTENTE' | 'ACTIF' | 'REFUSE' | 'BANNI' | 'INFOS_DEMANDEES';
  role: 'UTILISATRICE' | 'ADMIN';
  date_creation: string;
  date_validation: string | null;
  motif_refus: string | null;
}

// Lister les inscriptions en attente
export const getInscriptionsEnAttente = async (): Promise<UtilisatriceAdmin[]> => {
  const response = await api.get('/admin/inscriptions-en-attente');
  return response.data.data;
};

// Lister toutes les utilisatrices
export const getToutesUtilisatrices = async (): Promise<UtilisatriceAdmin[]> => {
  const response = await api.get('/admin/utilisatrices');
  return response.data.data;
};

// Valider un compte
export const validerCompte = async (id: number) => {
  const response = await api.patch(`/admin/utilisatrices/${id}/valider`);
  return response.data;
};

// Refuser un compte (avec motif)
export const refuserCompte = async (id: number, motif: string) => {
  const response = await api.patch(`/admin/utilisatrices/${id}/refuser`, { motif });
  return response.data;
};