// ============================================================================
// SISTER SPACE — Profil Page (refonte 2026)
// ============================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Search } from 'lucide-react';
import * as authService from '../services/authService';
import * as postService from '../services/postService';
import Sidebar from '../components/Sidebar';
import type { Post } from '../services/postService';

export default function ProfilPage() {
  const navigate = useNavigate();
  const utilisatrice = authService.getUtilisatriceConnectee();
  
  const [mesPosts, setMesPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerPosts();
  }, []);

  const chargerPosts = async () => {
    try {
      const tousLesPosts = await postService.getAllPosts();
      const mes = (tousLesPosts || []).filter(
        (p) => p.auteure_pseudo === utilisatrice?.pseudo
      );
      setMesPosts(mes);
    } catch (e) {
      console.error('Erreur chargement posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const initiale = utilisatrice?.prenom?.charAt(0).toUpperCase() || '?';

  const getCouleurCarte = (index: number) => {
    const couleurs = [
      'from-sister-200 to-sister-300',
      'from-peach-200 to-peach-300',
      'from-sister-100 to-peach-200',
      'from-peach-100 to-sister-200',
    ];
    return couleurs[index % couleurs.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sister-50 via-cream to-sister-100">
      
      <Sidebar />

      <main className="ml-64 px-8 py-6 max-w-6xl">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search Sister Space"
              className="pl-10 pr-4 py-2.5 bg-white rounded-full border border-sister-100 focus:outline-none focus:border-sister-300 w-64 text-sm shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-start gap-8 mb-10 pb-8 border-b border-sister-100">
          
          <div className="flex-shrink-0">
            <div className="w-44 h-44 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white text-7xl font-bold shadow-xl ring-4 ring-white">
              {initiale}
            </div>
          </div>

          <div className="flex-1 pt-4">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">
                {utilisatrice?.prenom}
              </h2>
              <button className="flex items-center gap-2 bg-white hover:bg-sister-50 border border-sister-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm transition">
                <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                <span>Edit profile</span>
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mb-3">@{utilisatrice?.pseudo}</p>
            
            <p className="text-gray-700 text-sm mb-4 max-w-md leading-relaxed">
              {(utilisatrice as any)?.bio || "Brooklyn UX designer · slow mornings, hot yoga, hunting the city's best matcha 🍵"}
            </p>

            <div className="flex items-center gap-6">
              <div>
                <span className="font-bold text-gray-900">{mesPosts.length}</span>
                <span className="text-gray-500 text-sm ml-1">posts</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">1,824</span>
                <span className="text-gray-500 text-sm ml-1">friends</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : mesPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-2">🌸 Pas encore de posts</p>
            <button
              onClick={() => navigate('/creer-post')}
              className="text-sister-500 hover:text-sister-600 font-semibold text-sm"
            >
              Créer ton premier post →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mesPosts.map((post, index) => (
              <button
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group relative"
              >
                {post.photos_urls && post.photos_urls.length > 0 ? (
                  <>
                    <img
                      src={post.photos_urls[0]}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-1.5 text-white font-semibold">
                        <span>❤️</span>
                        <span>{post.nb_likes}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getCouleurCarte(index)} relative overflow-hidden`}>
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 16px)',
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <p className="text-white/80 text-xs font-bold uppercase tracking-wider text-center">
                        {post.contenu.split(' ').slice(0, 2).join(' ')}
                      </p>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}