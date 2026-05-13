// ============================================================================
// SISTER SPACE — Page Feed (fil d'actualité)
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useEffect, useState } from 'react';
import * as postService from '../services/postService';
import type { Post } from '../services/postService';
import PostCard from '../components/PostCard';
import BottomNav from '../components/BottomNav';
import UserMenu from '../components/UserMenu';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  // Charger les posts au montage du composant
  useEffect(() => {
    const chargerPosts = async () => {
      try {
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (err: any) {
        setErreur(err.response?.data?.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    chargerPosts();
  }, []);

  return (
    <div className="min-h-screen pb-28">

      {/* Header avec glassmorphism */}
      <header className="glass sticky top-0 z-10 border-b border-sister-100/50">
        <div className="max-w-2xl mx-auto px-5 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl text-sister-600 italic">
              Sister Space
            </h1>
            <span className="text-xl">🌸</span>
          </div>

          <UserMenu />
        </div>
      </header>

      {/* Sous-titre poétique */}
      <div className="max-w-2xl mx-auto px-5 pt-5 pb-2">
        <p className="text-mauve-500 text-sm italic font-serif">
          Bienvenue dans ton fil ✨
        </p>
      </div>

      {/* Fil d'actualité */}
      <main className="max-w-2xl mx-auto px-5 pt-3">

        {/* État : chargement */}
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

        {/* État : erreur */}
        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-2">
            <span>⚠️</span>
            <span>{erreur}</span>
          </div>
        )}

        {/* État : vide */}
        {!loading && !erreur && posts.length === 0 && (
          <div className="card-sister p-10 text-center mt-6">
            <div className="text-5xl mb-3">🌸</div>
            <h2 className="font-serif text-xl text-cocoa-900 mb-2">C'est calme par ici...</h2>
            <p className="text-mauve-500 text-sm">
              Sois la première à partager une bonne adresse !
            </p>
          </div>
        )}

        {/* Liste des posts */}
        {!loading && posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>

      <BottomNav />
    </div>
  );
}