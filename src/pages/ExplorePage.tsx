// ============================================================================
// SISTER SPACE — Page Exploration
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

// ----------------------------------------------------------------------------
// 🔹 TYPES
// ----------------------------------------------------------------------------

interface Categorie {
  id: number;
  nom: string;
  emoji: string;
  description: string;
  gradient: string;
}

// ----------------------------------------------------------------------------
// 🔹 DONNÉES
// ----------------------------------------------------------------------------

const CATEGORIES: Categorie[] = [
  {
    id: 1,
    nom: 'Restos',
    emoji: '🍴',
    description: 'Bons plans culinaires',
    gradient: 'from-orange-300 to-red-400',
  },
  {
    id: 2,
    nom: 'Cinéma',
    emoji: '🎬',
    description: 'Films à découvrir',
    gradient: 'from-purple-300 to-indigo-400',
  },
  {
    id: 3,
    nom: 'Shopping',
    emoji: '🛍️',
    description: 'Pépites mode et déco',
    gradient: 'from-pink-300 to-rose-400',
  },
  {
    id: 4,
    nom: 'Culture',
    emoji: '🎨',
    description: 'Expos, musées, sorties',
    gradient: 'from-yellow-300 to-orange-400',
  },
  {
    id: 5,
    nom: 'Sport',
    emoji: '💪',
    description: 'Cours, courses, motivation',
    gradient: 'from-green-300 to-emerald-400',
  },
  {
    id: 6,
    nom: 'Bien-être',
    emoji: '🌿',
    description: 'Self-care & mindfulness',
    gradient: 'from-teal-300 to-cyan-400',
  },
  {
    id: 7,
    nom: 'Musique',
    emoji: '🎵',
    description: 'Concerts, festivals, playlists',
    gradient: 'from-blue-300 to-purple-400',
  },
  {
    id: 8,
    nom: 'Voyages',
    emoji: '✈️',
    description: 'Destinations & road trips',
    gradient: 'from-cyan-300 to-blue-400',
  },
];

// ----------------------------------------------------------------------------
// 🔹 COMPONENT
// ----------------------------------------------------------------------------

export default function ExplorePage() {
  const [recherche, setRecherche] = useState('');

  // Filtrage des catégories
  const categoriesFiltrees = CATEGORIES.filter((c) =>
    c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    c.description.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24">

      {/* ------------------------------------------------------------------ */}
      {/* 🔹 HEADER */}
      {/* ------------------------------------------------------------------ */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-4">

          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Explorer 🌸
          </h1>

          {/* Barre de recherche */}
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="🔍 Rechercher une catégorie..."
            className="w-full px-4 py-2 bg-pink-50 border border-pink-100 rounded-full focus:outline-none focus:ring-2 focus:ring-sister-300"
          />

        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 🔹 MAIN CONTENT */}
      {/* ------------------------------------------------------------------ */}
      <main className="max-w-2xl mx-auto px-4 pt-6">

        <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide font-semibold">
          Découvre par centre d'intérêt
        </p>

        {/* Aucun résultat */}
        {categoriesFiltrees.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            Aucune catégorie trouvée
          </div>
        )}

        {/* Grille catégories */}
        <div className="grid grid-cols-2 gap-3">
          {categoriesFiltrees.map((cat) => (
            <Link
              key={cat.id}
              to={`/categorie/${cat.id}`}
              className={`bg-gradient-to-br ${cat.gradient} text-white rounded-2xl p-5 text-left hover:scale-105 transition-transform shadow-lg block`}
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="font-bold text-lg mb-1">{cat.nom}</div>
              <div className="text-xs opacity-90">{cat.description}</div>
            </Link>
          ))}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 🔹 SECTION COMMUNAUTÉ */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-8">

          <p className="text-sm text-gray-500 mb-3 uppercase tracking-wide font-semibold">
            La communauté
          </p>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">

            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🌸</div>

              <div>
                <div className="font-bold text-gray-800">
                  Sister Space grandit !
                </div>
                <div className="text-xs text-gray-500">
                  Plus de 20 sisters connectées
                </div>
              </div>
            </div>

            <Link
              to="/feed"
              className="inline-block text-sm text-sister-600 font-semibold hover:underline"
            >
              Voir le fil d'actualité →
            </Link>

          </div>
        </div>

      </main>

      {/* ------------------------------------------------------------------ */}
      {/* 🔹 NAVIGATION BASSE */}
      {/* ------------------------------------------------------------------ */}
      <BottomNav />

    </div>
  );
}