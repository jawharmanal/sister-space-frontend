// ============================================================================
// SISTER SPACE — Explore Page (refonte 2026)
// ============================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import * as utilisatriceService from '../services/utilisatriceService';
import Sidebar from '../components/Sidebar';
import type { UtilisatriceListe } from '../services/utilisatriceService';

const CATEGORIES = [
  { id: 1, nom: 'Advice', posts: '4.2k posts this week', bg: 'from-peach-200 to-peach-300' },
  { id: 2, nom: 'Friendship', posts: '2.8k posts this week', bg: 'from-sister-200 to-sister-300' },
  { id: 3, nom: 'Outings', posts: '1.6k posts this week', bg: 'from-sister-100 to-peach-200' },
  { id: 4, nom: 'Recommend', posts: '3.1k posts this week', bg: 'from-peach-100 to-sister-200' },
  { id: 5, nom: 'Career', posts: '912 posts this week', bg: 'from-sister-200 to-peach-200' },
  { id: 6, nom: 'Wellness', posts: '2.3k posts this week', bg: 'from-peach-200 to-sister-200' },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [sisters, setSisters] = useState<UtilisatriceListe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerSisters();
  }, []);

  const chargerSisters = async () => {
    try {
      const data = await utilisatriceService.getAllUtilisatrices();
      setSisters((data || []).slice(0, 4));
    } catch (e) {
      console.error('Erreur sisters:', e);
    } finally {
      setLoading(false);
    }
  };

  const initiale = (prenom: string) => prenom?.charAt(0).toUpperCase() || '?';
  
  const getCouleurAvatar = (prenom: string) => {
    const couleurs = [
      'from-sister-300 to-sister-500',
      'from-peach-200 to-peach-300',
      'from-sister-200 to-sister-400',
      'from-sister-400 to-sister-600',
      'from-peach-300 to-sister-400',
    ];
    return couleurs[(prenom?.charCodeAt(0) || 0) % couleurs.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sister-50 via-cream to-sister-100">
      
      <Sidebar />

      <main className="ml-64 px-8 py-6 max-w-6xl">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search Sister Space"
              className="pl-10 pr-4 py-2.5 bg-white rounded-full border border-sister-100 focus:outline-none focus:border-sister-300 w-64 text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/categorie/${cat.id}`)}
                className={`relative aspect-[5/3] rounded-3xl bg-gradient-to-br ${cat.bg} p-6 text-left overflow-hidden shadow-sm hover:shadow-lg transition group`}
              >
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/20"></div>
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/15"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-sister-700 mb-1 group-hover:scale-105 transition origin-left">
                    #{cat.nom}
                  </h3>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <p className="text-xs text-sister-700/70 font-medium">
                    {cat.posts}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Discover Sisters */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Discover Sisters
            </h2>
            <button className="text-sm text-sister-500 hover:text-sister-600 font-semibold">
              See all
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Chargement...</div>
          ) : sisters.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Aucune sister à découvrir pour l'instant</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sisters.map((sister) => (
                <div
                  key={sister.id}
                  className="bg-white rounded-2xl p-5 text-center shadow-sm border border-sister-100 hover:shadow-md transition"
                >
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getCouleurAvatar(sister.prenom)} flex items-center justify-center text-white font-bold text-xl shadow-md mb-3`}>
                    {initiale(sister.prenom)}
                  </div>
                  
                  <p className="font-semibold text-gray-900 text-sm">{sister.prenom}</p>
                  
                  <p className="text-xs text-gray-500 mt-1 mb-3 truncate">
                    {sister.bio || `@${sister.pseudo}`}
                  </p>

                  <button className="w-full bg-gradient-to-r from-sister-400 to-sister-500 hover:from-sister-500 hover:to-sister-600 text-white py-1.5 rounded-full text-xs font-semibold shadow-sm transition">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}