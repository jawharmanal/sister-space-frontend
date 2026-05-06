// ============================================================================
// SISTER SPACE — Page Feed (fil d'actualité)
// ============================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as postService from '../services/postService';
import * as authService from '../services/authService';
import type { Post } from '../services/postService';
import PostCard from '../components/PostCard';
import BottomNav from '../components/BottomNav';
import UserMenu from '../components/UserMenu';
export default function FeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  const utilisatrice = authService.getUtilisatriceConnectee();

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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen pb-24">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold italic text-sister-600">
            Sister Space 🌸
          </h1>
          <div className="flex items-center gap-3">
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Fil d'actualité */}
      <main className="max-w-2xl mx-auto px-4 pt-6">
        
        {loading && (
          <div className="text-center py-12 text-gray-400">
            Chargement... 🌸
          </div>
        )}

        {erreur && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl">
            ⚠️ {erreur}
          </div>
        )}

        {!loading && !erreur && posts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Aucun post pour le moment
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