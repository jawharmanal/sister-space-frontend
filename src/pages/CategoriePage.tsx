// ============================================================================
// SISTER SPACE — Page d'une catégorie (posts filtrés)
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as postService from '../services/postService';
import type { Post } from '../services/postService';
import PostCard from '../components/PostCard';
import BottomNav from '../components/BottomNav';

const CATEGORIES_INFO: Record<number, { nom: string; emoji: string; gradient: string }> = {
  1: { nom: 'Restos',    emoji: '🍴', gradient: 'from-rose-200 via-pink-200 to-orange-200' },
  2: { nom: 'Cinéma',    emoji: '🎬', gradient: 'from-purple-200 via-pink-200 to-rose-200' },
  3: { nom: 'Shopping',  emoji: '🛍️', gradient: 'from-pink-200 via-rose-200 to-fuchsia-200' },
  4: { nom: 'Culture',   emoji: '🎨', gradient: 'from-amber-200 via-orange-200 to-pink-200' },
  5: { nom: 'Sport',     emoji: '💪', gradient: 'from-emerald-200 via-teal-200 to-pink-200' },
  6: { nom: 'Bien-être', emoji: '🌿', gradient: 'from-teal-200 via-cyan-200 to-pink-200' },
  7: { nom: 'Musique',   emoji: '🎵', gradient: 'from-indigo-200 via-purple-200 to-pink-200' },
  8: { nom: 'Voyages',   emoji: '✈️', gradient: 'from-sky-200 via-blue-200 to-pink-200' },
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
      <div className="min-h-screen pb-28 flex items-center justify-center">
        <div className="card-sister p-8 text-center">
          <div className="text-4xl mb-3">🌸</div>
          <p className="text-cocoa-800 mb-4">Catégorie introuvable</p>
          <Link to="/explore" className="btn-sister-outline inline-block text-sm">
            Retour à l'exploration
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">

      {/* Header avec gradient de la catégorie */}
      <header className={`bg-gradient-to-br ${info.gradient} text-cocoa-900 px-5 py-8 sticky top-0 z-10 shadow-pink-soft`}>
        <div className="max-w-2xl mx-auto">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-cocoa-800/80 hover:text-cocoa-900 text-sm font-medium transition group"
          >
            <ArrowLeft size={16} strokeWidth={1.75} className="group-hover:-translate-x-1 transition-transform" />
            Explorer
          </Link>
          <div className="flex items-center gap-4 mt-3">
            <div className="text-6xl">{info.emoji}</div>
            <div>
              <h1 className="font-serif text-4xl text-cocoa-900">{info.nom}</h1>
              <p className="text-cocoa-800/70 text-sm mt-0.5">
                {posts.length} post{posts.length > 1 ? 's' : ''} de la communauté
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Posts */}
      <main className="max-w-2xl mx-auto px-5 pt-6 animate-fade-in-up">

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-sister-400 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-sister-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-sister-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <p className="text-mauve-400 text-sm">Chargement...</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="card-sister p-10 text-center">
            <div className="text-5xl mb-3">{info.emoji}</div>
            <p className="font-serif text-lg text-cocoa-900 mb-1">Encore aucun post</p>
            <p className="text-mauve-500 text-sm mb-5">
              Sois la première à partager une bonne adresse !
            </p>
            <Link to="/creer-post" className="btn-sister inline-block text-sm">
              Publier ✨
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