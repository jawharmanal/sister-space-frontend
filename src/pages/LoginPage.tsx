// ============================================================================
// SISTER SPACE — Page de connexion
// ============================================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();

  // ----- States du formulaire -----
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  // ----- Soumission du formulaire -----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);

    try {
      const data = await authService.login(email, motDePasse);
      console.log('Connexion réussie :', data);
      navigate('/feed'); // Redirection vers le fil d'actualité
    } catch (err: any) {
      setErreur(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🌸</div>
          <h1 className="text-3xl font-bold text-sister-600">
            Welcome to Sister Space
          </h1>
          <p className="text-gray-500 mt-2">
            La communauté rien que pour nous 💕
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              required
              className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-400"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-400"
            />
            <div className="text-right mt-1">
              <a href="#" className="text-sm text-sister-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Message d'erreur */}
          {erreur && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">
              ⚠️ {erreur}
            </div>
          )}

          {/* Bouton Sign in */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sister-500 hover:bg-sister-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Sign in'}
          </button>

          {/* Lien inscription */}
          <p className="text-center text-sm text-gray-500 mt-4">
            New here?{' '}
            <Link to="/register" className="text-sister-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}