// ============================================================================
// SISTER SPACE — Configuration axios pour appeler le back-end
// ============================================================================

import axios from 'axios';

// Créer une instance axios pré-configurée
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  ...
});

// Intercepteur : ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : gère les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré → déconnexion
      localStorage.removeItem('token');
      localStorage.removeItem('utilisatrice');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;