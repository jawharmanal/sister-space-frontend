// ============================================================================
// SISTER SPACE — Page Exploration
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import BottomNav from '../components/BottomNav';

// ----------------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------------

interface Categorie {
  id: number;
  nom: string;
  emoji: string;
  description: string;
  gradient: string;
}

// ----------------------------------------------------------------------------
// DONNÉES — gradients pastel harmonisés
// ----------------------------------------------------------------------------

const CATEGORIES: Categorie[] = [
  { id: 1, nom: 'Restos',    emoji: '🍴', description: 'Bons plans culinaires',     gradient: 'from-rose-200 via-pink-200 to-orange-200' },
  { id: 2, nom: 'Cinéma',    emoji: '🎬', description: 'Films à découvrir',         gradient: 'from-purple-200 via-pink-200 to-rose-200' },
  { id: 3, nom: 'Shopping',  emoji: '🛍️', description: 'Pépites mode et déco',      gradient: 'from-pink-200 via-rose-200 to-fuchsia-200' },
  { id: 4, nom: 'Culture',   emoji: '🎨', description: 'Expos, musées, sorties',    gradient: 'from-amber-200 via-orange-200 to-pink-200' },
  { id: 5, nom: 'Sport',     emoji: '💪', description: 'Cours, courses, motivation', gradient: 'from-emerald-200 via-teal-200 to-pink-200' },
  { id: 6, nom: 'Bien-être', emoji: '🌿', description: 'Self-care & mindfulness',   gradient: 'from-teal-200 via-cyan-200 to-pink-200' },
  { id: 7, nom: 'Musique',   emoji: '🎵', description: 'Concerts, festivals',       gradient: 'from-indigo-200 via-purple-200 to-pink-200' },
  { id: 8, nom: 'Voyages',   emoji: '✈️', description: 'Destinations & road trips', gradient: 'from-sky-200 via-blue-200 to-pink-200' },
];

// ----------------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------------

export default function ExplorePage() {
  const [recherche, setRecherche] = useState('');

  const categoriesFiltrees = CATEGORIES.filter((c) =>
    c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    c.description.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-28">

      {/* HEADER */}
      <header className="glass sticky top-0 z-10 border-b border-sister-100/50">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-serif text-2xl text-sister-600 italic">
              Explorer
            </h1>
            <span className="text-2xl">🧭</span>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search
              size={18}
              strokeWidth={1.75}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-mauve-400 pointer-events-none"
            />
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher une catégorie..."
              className="w-full pl-11 pr-4 py-3 bg-white/70 border border-sister-200 rounded-full text-cocoa-900 placeholder-mauve-400 focus:outline-none focus:border-sister-400 focus:ring-4 focus:ring-sister-100 transition-all"
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-2xl mx-auto px-5 pt-6 animate-fade-in-up">

        <p className="text-xs text-mauve-500 mb-4 uppercase tracking-wider font-medium">
          Découvre par centre d'intérêt
        </p>

        {/* Aucun résultat */}
        {categoriesFiltrees.length === 0 && (
          <div className="card-sister p-8 text-center">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-mauve-500">Aucune catégorie trouvée</p>
          </div>
        )}

        {/* Grille catégories */}
        <div className="grid grid-cols-2 gap-3">
          {categoriesFiltrees.map((cat) => (
            <Link
              key={cat.id}
              to={`/categorie/${cat.id}`}
              className={`bg-gradient-to-br ${cat.gradient} text-cocoa-900 rounded-3xl p-5 text-left shadow-pink-soft hover:shadow-pink-md hover:-translate-y-1 transition-all duration-300 block group`}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">
                {cat.emoji}
              </div>
              <div className="font-serif text-xl mb-1">{cat.nom}</div>
              <div className="text-xs text-cocoa-800/80">{cat.description}</div>
            </Link>
          ))}
        </div>

        {/* SECTION COMMUNAUTÉ */}
        <div className="mt-10">
          <p className="text-xs text-mauve-500 mb-3 uppercase tracking-wider font-medium">
            La communauté
          </p>

          <div className="card-sister p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🌸</div>
              <div className="flex-1">
                <div className="font-serif text-lg text-cocoa-900">
                  Sister Space grandit !
                </div>
                <div className="text-xs text-mauve-500">
                  Plus de 20 sisters connectées
                </div>
              </div>
            </div>

            <Link
              to="/feed"
              className="inline-flex items-center gap-1 text-sm text-sister-600 hover:text-sister-700 font-medium transition group"
            >
              Voir le fil
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}