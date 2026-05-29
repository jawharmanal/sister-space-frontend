// ============================================================================
// SISTER SPACE — Feed Page (refonte 2026)
// ============================================================================

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as postService from '../services/postService';
import * as utilisatriceService from '../services/utilisatriceService';
import Sidebar from '../components/Sidebar';

// Types
interface Post {
  id: number;
  contenu: string;
  photos_urls: string[] | null;
  date_creation: string;
  auteure_prenom: string;
  auteure_pseudo: string;
  nb_likes: number;
  nb_commentaires: number;
  est_likee: boolean;
}

interface Utilisatrice {
  id: number;
  prenom: string;
  pseudo: string;
  bio?: string;
}

export default function FeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestions, setSuggestions] = useState<Utilisatrice[]>([]);
  const [recherche, setRecherche] = useState('');
  const [loading, setLoading] = useState(true);

  // Charger posts + suggestions au montage
  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const [postsData, suggestionsData] = await Promise.all([
        postService.getPosts(),
        utilisatriceService.getUtilisatrices().catch(() => []),
      ]);
      setPosts(postsData || []);
      // Prendre les 3 premières utilisatrices pour les suggestions
      setSuggestions((suggestionsData || []).slice(0, 3));
    } catch (e) {
      console.error('Erreur chargement feed:', e);
    } finally {
      setLoading(false);
    }
  };

  // Like / Unlike
  const handleLike = async (postId: number, estLikee: boolean) => {
    try {
      if (estLikee) {
        await postService.retirerLike(postId);
      } else {
        await postService.likerPost(postId);
      }
      // Recharger les posts
      const updated = await postService.getPosts();
      setPosts(updated || []);
    } catch (e) {
      console.error('Erreur like:', e);
    }
  };

  // Formater le temps écoulé
  const formaterTemps = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'À l\'instant';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}j ago`;
  };

  // Initiale du prénom
  const initiale = (prenom: string) => prenom?.charAt(0).toUpperCase() || '?';

  // Couleur d'avatar selon initiale (pour varier)
  const getCouleurAvatar = (prenom: string) => {
    const couleurs = [
      'from-sister-300 to-sister-500',
      'from-peach-200 to-peach-300',
      'from-sister-200 to-sister-400',
      'from-sister-400 to-sister-600',
      'from-peach-300 to-sister-400',
    ];
    const index = (prenom?.charCodeAt(0) || 0) % couleurs.length;
    return couleurs[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sister-50 via-cream to-sister-100">
      
      {/* Sidebar gauche */}
      <Sidebar />

      {/* Contenu principal (avec marge à gauche pour la sidebar) */}
      <div className="ml-64 flex">
        
        {/* Zone centrale : feed */}
        <main className="flex-1 max-w-2xl mx-auto px-6 py-6">
          
          {/* Header : titre + recherche + bouton Create */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Home</h1>
            
            <div className="flex items-center gap-3">
              {/* Recherche */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Search Sister Space"
                  className="pl-10 pr-4 py-2.5 bg-white rounded-full border border-sister-100 focus:outline-none focus:border-sister-300 w-64 text-sm shadow-sm"
                />
              </div>
              
              {/* Bouton Create */}
              <button
                onClick={() => navigate('/creer-post')}
                className="bg-gradient-to-r from-sister-400 to-sister-500 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition flex items-center gap-1"
              >
                <span className="text-lg">+</span> Create post
              </button>
            </div>
          </div>

          {/* Stories en haut (cercles d'utilisatrices) */}
          {suggestions.length > 0 && (
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
              {posts.slice(0, 7).map((post, i) => (
                <div key={i} className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getCouleurAvatar(post.auteure_prenom)} flex items-center justify-center text-white font-bold text-xl ring-4 ring-white shadow-md`}>
                    {initiale(post.auteure_prenom)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Liste des posts */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Chargement...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Aucun post pour le moment 🌸</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-2xl shadow-sm border border-sister-100 p-5 hover:shadow-md transition"
                >
                  {/* Header du post */}
                  <div className="flex items-center justify-between mb-3">
                    <Link to={`/post/${post.id}`} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getCouleurAvatar(post.auteure_prenom)} flex items-center justify-center text-white font-bold shadow-sm`}>
                        {initiale(post.auteure_prenom)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{post.auteure_prenom}</p>
                        <p className="text-xs text-gray-500">{formaterTemps(post.date_creation)}</p>
                      </div>
                    </Link>
                    {/* Tag (badge) */}
                    <span className="bg-peach-100 text-sister-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                      ADVICE
                    </span>
                  </div>

                  {/* Contenu du post */}
                  <Link to={`/post/${post.id}`}>
                    <p className="text-gray-800 text-sm leading-relaxed mb-3">
                      {post.contenu}
                    </p>
                  </Link>

                  {/* Photo (si présente) */}
                  {post.photos_urls && post.photos_urls.length > 0 && (
                    <Link to={`/post/${post.id}`}>
                      <img 
                        src={post.photos_urls[0]} 
                        alt="" 
                        className="w-full h-64 object-cover rounded-xl mb-3"
                      />
                    </Link>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id, post.est_likee)}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-sister-500 transition"
                      >
                        <span className="text-lg">{post.est_likee ? '❤️' : '🤍'}</span>
                        <span className="text-sm font-medium">{post.nb_likes}</span>
                      </button>

                      <Link
                        to={`/post/${post.id}`}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-sister-500 transition"
                      >
                        <span className="text-lg">💬</span>
                        <span className="text-sm font-medium">{post.nb_commentaires}</span>
                      </Link>

                      <button className="text-gray-600 hover:text-sister-500 transition">
                        <span className="text-lg">📤</span>
                      </button>
                    </div>

                    <button className="text-gray-400 hover:text-sister-500 transition">
                      <span className="text-lg">🔖</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Sidebar droite : Suggested Sisters + Trending */}
        <aside className="w-80 px-6 py-6 space-y-4 hidden xl:block">
          
          {/* Suggested Sisters */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-sister-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Suggested Sisters
            </h3>
            <div className="space-y-3">
              {suggestions.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getCouleurAvatar(u.prenom)} flex items-center justify-center text-white font-bold shadow-sm`}>
                    {initiale(u.prenom)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{u.prenom}</p>
                    <p className="text-xs text-gray-500 truncate">@{u.pseudo}</p>
                  </div>
                  <button className="bg-sister-100 hover:bg-sister-200 text-sister-700 text-xs font-semibold px-3 py-1.5 rounded-full transition">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Now */}
          <div className="bg-sister-50 rounded-2xl p-5 border border-sister-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Trending Now
            </h3>
            <div className="space-y-3">
              <Link to="/categorie/1" className="block hover:bg-white p-2 -mx-2 rounded-lg transition">
                <p className="text-sm font-bold text-sister-600">#Outings</p>
                <p className="text-xs text-gray-500">Sunrise hike · Bear Mtn</p>
              </Link>
              <Link to="/categorie/2" className="block hover:bg-white p-2 -mx-2 rounded-lg transition">
                <p className="text-sm font-bold text-sister-600">#Advice</p>
                <p className="text-xs text-gray-500">Negotiating your first raise</p>
              </Link>
              <Link to="/categorie/3" className="block hover:bg-white p-2 -mx-2 rounded-lg transition">
                <p className="text-sm font-bold text-sister-600">#Recommend</p>
                <p className="text-xs text-gray-500">Best matcha in Brooklyn</p>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}