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

export interface UtilisatriceComplete {
  id: number;
  email: string;
  prenom: string;
  pseudo: string;
  bio: string | null;
  photo_url: string | null;
  statut: string;
  role: string;
}

export interface DonneesModificationProfil {
  prenom?: string;
  pseudo?: string;
  bio?: string;
  photo_url?: string;
}

// ----------------------------------------------------------------------------
// Lister toutes les utilisatrices actives
// ----------------------------------------------------------------------------
export const getAllUtilisatrices = async (): Promise<UtilisatriceListe[]> => {
  const response = await api.get('/utilisatrices');
  return response.data.data;
};

// ----------------------------------------------------------------------------
// Modifier mon profil (prenom, pseudo, bio, photo_url)
// ----------------------------------------------------------------------------
export const modifierMonProfil = async (
  donnees: DonneesModificationProfil
): Promise<UtilisatriceComplete> => {
  const response = await api.put('/utilisatrices/moi', donnees);
  return response.data.data;
};

// ----------------------------------------------------------------------------
// Changer mon mot de passe
// ----------------------------------------------------------------------------
export const changerMonMotDePasse = async (
  ancien_mot_de_passe: string,
  nouveau_mot_de_passe: string
): Promise<void> => {
  await api.put('/utilisatrices/moi/mot-de-passe', {
    ancien_mot_de_passe,
    nouveau_mot_de_passe,
  });
};

// ----------------------------------------------------------------------------
// Supprimer mon compte (RGPD)
// ----------------------------------------------------------------------------
export const supprimerMonCompte = async (mot_de_passe: string): Promise<void> => {
  await api.delete('/utilisatrices/moi', {
    data: { mot_de_passe },
  });
};