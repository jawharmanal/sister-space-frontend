// ============================================================================
// SISTER SPACE — Page d'une catégorie (posts filtrés)
// ============================================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as postService from '../services/postService';
import type { Post } from '../services/postService';
import PostCard from '../components/PostCard';
import BottomNav from '../components/BottomNav';

const CATEGORIES_INFO: Record<number, { nom: string; emoji: string; gradient: string }> = {
  1: { nom: 'Restos', emoji: '🍴', gradient: 'from-orange-300 to-red-400' },
  2: { nom: 'Cinéma', emoji: '🎬', gradient: 'from-purple-300 to-indigo-400' },
  3: { nom: 'Shopping', emoji: '🛍️', gradient: 'from-pink-300 to-rose-400' },
  4: { nom: 'Culture', emoji: '🎨', gradient: 'from-yellow-300 to-orange-400' },
  5: { nom: 'Sport', emoji: '💪', gradient: 'from-green-300 to-emerald-400' },
  6: { nom: 'Bien-être', emoji: '🌿', gradient: 'from-teal-300 to-cyan-400' },
  7: { nom: 'Musique', emoji: '🎵', gradient: 'from-blue-300 to-purple-400' },
  8: { nom: 'Voyages', emoji: '✈️', gradient: 'from-cyan-300 to-blue-400' },
};

export default function CategoriePage() {
  const { id } = useParams<{ id: string }>();
  const id_categorie = id ? parseInt(id) : 0;
  const info = CATEGORIES_INFO[id_categorie];

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await postService.getAllPosts(id_categorie);
        setPosts(data);
      } catch (err) {
        console.error('Erreur :', err);
      } finally {
        setLoading(false);
      }
    };
    if (id_categorie) charger();
  }, [id_categorie]);

  if (!info) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Catégorie introuvable</p>
          <Link to="/explore" className="text-sister-600 hover:underline">
            ← Retour à l'exploration
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      
      {/* Header avec gradient de la catégorie */}
      <header className={`bg-gradient-to-br ${info.gradient} text-white px-4 py-8 sticky top-0 z-10 shadow-lg`}>
        <div className="max-w-2xl mx-auto">
          <Link to="/explore" className="text-white/80 hover:text-white text-sm">
            ← Explorer
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <div className="text-5xl">{info.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold">{info.nom}</h1>
              <p className="text-white/90 text-sm">
                {posts.length} post{posts.length > 1 ? 's' : ''} de la communauté
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Posts */}
      <main className="max-w-2xl mx-auto px-4 pt-6">
        
        {loading && (
          <div className="text-center text-gray-400 py-12">Chargement... 🌸</div>
        )}

        {!loading && posts.length === 0 && (
          <div className="bg-pink-50 rounded-2xl p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">{info.emoji}</div>
            <p>Aucun post pour cette catégorie pour l'instant</p>
            <Link
              to="/creer-post"
              className="inline-block mt-3 bg-sister-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-sister-600"
            >
              Sois la première à publier !
            </Link>
          </div>
        )}

        {!loading && posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>

      <BottomNav />
    </div>
  );
}