// ============================================================================
// SISTER SPACE — Login Page (refonte 2026)
// ============================================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [seSouvenirDeMoi, setSeSouvenirDeMoi] = useState(false);
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  // -------------------------------------------------------------------------
  // Fonction de connexion
  // -------------------------------------------------------------------------
  const seConnecter = async () => {
    if (!email.trim() || !motDePasse) {
      setErreur('Merci de remplir tous les champs');
      return;
    }

    setErreur('');
    setLoading(true);

    try {
      await authService.seConnecter(email, motDePasse, seSouvenirDeMoi);
      navigate('/feed');
    } catch (err: any) {
      setErreur(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sister-50 via-cream to-sister-100">
      
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sister-400 to-sister-500 flex items-center justify-center text-white font-bold shadow-md">
            s
          </div>
          <span className="text-2xl font-serif italic text-sister-600">Sister Space</span>
        </div>
        <nav className="flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-sister-600 transition text-sm font-medium">About</a>
          <a href="#" className="text-gray-700 hover:text-sister-600 transition text-sm font-medium">Community</a>
          <a href="#" className="text-gray-700 hover:text-sister-600 transition text-sm font-medium">Safety</a>
          <button
            type="button"
            onClick={() => document.getElementById('login-card')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-full text-sm font-medium transition"
          >
            Sign in
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-8 py-12 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left side */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-sister-500 rounded-full"></span>
            <span className="text-sm font-medium text-sister-600">Verified women-only community</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            A social space made
            <br />
            <span className="font-serif italic text-sister-500">just for women.</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-md leading-relaxed">
            Ask for advice, plan outings, swap recommendations,
            and make real friends — in a warm, safe place that's all yours.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Link
              to="/register"
              className="bg-gradient-to-r from-sister-400 to-sister-500 hover:from-sister-500 hover:to-sister-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-sister-300/50 transition"
            >
              Join Sister Space
            </Link>
            <button
              type="button"
              className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-md transition"
            >
              Take a tour
            </button>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <div className="flex -space-x-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sister-200 to-sister-300 border-2 border-white"></div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-peach-200 to-peach-300 border-2 border-white"></div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sister-300 to-sister-400 border-2 border-white"></div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sister-200 to-peach-200 border-2 border-white"></div>
            </div>
            <span className="text-sm text-gray-600">
              <strong>120k+</strong> women already growing together
            </span>
          </div>
        </div>

        {/* Right side : Login card */}
        <div
          id="login-card"
          className="bg-white rounded-3xl shadow-2xl shadow-sister-200/50 p-8 max-w-md mx-auto w-full"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-6">Sign in to your space</p>

          <div className="space-y-5">
            
            <div>
              <label htmlFor="email-input" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emma@sisterspace.app"
                className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
              />
            </div>

            <div>
              <label htmlFor="password-input" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    seConnecter();
                  }
                }}
                className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
              />
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={seSouvenirDeMoi}
                    onChange={(e) => setSeSouvenirDeMoi(e.target.checked)}
                    className="w-4 h-4 rounded text-sister-500 focus:ring-sister-400"
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm text-sister-500 hover:text-sister-600 font-medium">
                  Forgot password?
                </a>
              </div>
            </div>

            {erreur && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
                ⚠️ {erreur}
              </div>
            )}

            <button
              type="button"
              onClick={seConnecter}
              disabled={loading}
              className="w-full bg-gradient-to-r from-sister-400 to-sister-500 hover:from-sister-500 hover:to-sister-600 text-white py-3 rounded-full font-semibold shadow-lg shadow-sister-300/50 disabled:opacity-50 transition"
            >
              {loading ? 'Connexion...' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-gray-600">
              New here?{' '}
              <Link to="/register" className="text-sister-500 hover:text-sister-600 font-semibold">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}