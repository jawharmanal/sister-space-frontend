// ============================================================================
// SISTER SPACE — Configuration axios pour appeler le back-end
// ============================================================================

import axios from 'axios';

// Créer une instance axios pré-configurée
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------------------------------
// Helper : récupère le token où qu'il soit (localStorage ou sessionStorage)
// ----------------------------------------------------------------------------
const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// ----------------------------------------------------------------------------
// Intercepteur REQUÊTE : ajoute automatiquement le token JWT à chaque requête
// ----------------------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------------------------------------------------------------
// Intercepteur RÉPONSE : gère les erreurs 401 (token expiré)
// ----------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré → déconnexion : on nettoie les DEUX storages
      localStorage.removeItem('token');
      localStorage.removeItem('utilisatrice');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('utilisatrice');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;