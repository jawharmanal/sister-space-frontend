// ============================================================================
// SISTER SPACE — Page de connexion (avec "Se souvenir de moi")
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();

  // ----- States du formulaire -----
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [seSouvenirDeMoi, setSeSouvenirDeMoi] = useState(false);
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  // ----- Soumission du formulaire -----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);

    try {
      const data = await authService.seConnecter(email, motDePasse, seSouvenirDeMoi);
      console.log('Connexion réussie :', data);
      navigate('/feed');
    } catch (err: any) {
      setErreur(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Cercles décoratifs flottants en arrière-plan */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-sister-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-champagne-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-sister-100 rounded-full opacity-30 blur-3xl pointer-events-none" />

      {/* Carte principale avec glassmorphism */}
      <div className="relative glass p-10 rounded-4xl shadow-pink-md w-full max-w-md animate-fade-in-up">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          {/* Logo fleur élégant */}
          <div className="inline-block mb-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-gradient-sister rounded-full flex items-center justify-center shadow-pink-md">
              <span className="text-3xl">🌸</span>
            </div>
          </div>

          {/* Titre en Playfair */}
          <h1 className="font-serif text-4xl text-cocoa-900 mb-2 tracking-tight">
            Bienvenue
          </h1>
          <p className="font-serif text-2xl text-sister-600 italic mb-3">
            chez Sister Space
          </p>
          <p className="text-mauve-500 text-sm">
            La communauté rien que pour nous ✨
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-mauve-700 mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              required
              className="input-sister"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-medium text-mauve-700 mb-2 uppercase tracking-wider">
              Mot de passe
            </label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              required
              className="input-sister"
            />
          </div>

          {/* Se souvenir de moi + Mot de passe oublié */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={seSouvenirDeMoi}
                onChange={(e) => setSeSouvenirDeMoi(e.target.checked)}
                className="w-4 h-4 rounded border-sister-300 text-sister-500 focus:ring-sister-300 cursor-pointer"
              />
              <span className="text-mauve-500 group-hover:text-sister-600 transition select-none">
                Se souvenir de moi
              </span>
            </label>
            <a href="#" className="text-sister-600 hover:text-sister-700 hover:underline font-medium">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Message d'erreur */}
          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-sm flex items-start gap-2 animate-fade-in">
              <span className="text-base">⚠️</span>
              <span>{erreur}</span>
            </div>
          )}

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading}
            className="btn-sister w-full text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </span>
            ) : (
              'Se connecter 🌸'
            )}
          </button>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-sister-200" />
            <span className="text-xs text-mauve-400 uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-sister-200" />
          </div>

          {/* Lien inscription */}
          <p className="text-center text-sm text-mauve-500">
            Première fois ici ?{' '}
            <Link 
              to="/register" 
              className="text-sister-600 hover:text-sister-700 font-semibold hover:underline"
            >
              Crée ton compte ✨
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}