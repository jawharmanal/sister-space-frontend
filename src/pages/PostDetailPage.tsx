// ============================================================================
// SISTER SPACE — Page de détail d'un post (avec commentaires)
// ============================================================================

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as postService from '../services/postService';
import * as authService from '../services/authService';
import type { Commentaire } from '../services/postService';
import BottomNav from '../components/BottomNav';

interface PostDetail {
  id: number;
  contenu: string;
  photos_urls: string[] | null;
  date_creation: string;
  id_auteure: number;
  auteure_prenom: string;
  auteure_pseudo: string;
  nb_likes: string;
  commentaires: Commentaire[];
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const utilisatrice = authService.getUtilisatriceConnectee();
  const commentairesEndRef = useRef<HTMLDivElement>(null);

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [nouveauCommentaire, setNouveauCommentaire] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  useEffect(() => {
    if (!id) return;
    chargerPost();
  }, [id]);

  const chargerPost = async () => {
    try {
      const data = await postService.getPost(parseInt(id!));
      setPost(data);
    } catch (err) {
      console.error('Erreur chargement post :', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnvoyerCommentaire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauCommentaire.trim() || !id) return;

    setEnvoiEnCours(true);
    try {
      const commentaire = await postService.creerCommentaire(parseInt(id), nouveauCommentaire);
      // Ajouter le nouveau commentaire à la liste
      if (post) {
        setPost({
          ...post,
          commentaires: [...post.commentaires, commentaire],
        });
      }
      setNouveauCommentaire('');
      // Scroll vers le bas
      setTimeout(() => commentairesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error('Erreur envoi commentaire :', err);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const formaterDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24">
        <div className="text-gray-400">Chargement... 🌸</div>
        <BottomNav />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24">
        <p className="text-gray-500">Post introuvable</p>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-sister-500 text-xl hover:text-sister-700">
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-800">Publication</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4">
        {/* Carte du post */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-pink-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white font-bold">
              {post.auteure_prenom.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-800">{post.auteure_prenom}</div>
              <div className="text-xs text-sister-500">{post.auteure_pseudo}</div>
            </div>
          </div>
          <p className="text-gray-700 mb-3 whitespace-pre-line">{post.contenu}</p>
          <div className="text-xs text-gray-400">
            {formaterDate(post.date_creation)} · 💗 {post.nb_likes} likes
          </div>
        </div>

        {/* Section commentaires */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Commentaires ({post.commentaires.length})
          </h2>

          {post.commentaires.length === 0 && (
            <div className="bg-pink-50 rounded-2xl p-6 text-center text-gray-500">
              <div className="text-3xl mb-2">💬</div>
              <p>Sois la première à commenter !</p>
            </div>
          )}

          {post.commentaires.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-3 mb-2 border border-pink-50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white text-xs font-bold">
                  {c.auteure_prenom.charAt(0).toUpperCase()}
                </div>
                <div className="font-semibold text-gray-700 text-sm">{c.auteure_prenom}</div>
                <div className="text-xs text-gray-400 ml-auto">{formaterDate(c.date_creation)}</div>
              </div>
              <p className="text-gray-700 text-sm pl-9">{c.contenu}</p>
            </div>
          ))}

          <div ref={commentairesEndRef} />
        </div>
      </main>

      {/* Zone de saisie du commentaire */}
      <footer className="bg-white border-t border-pink-100 p-3 fixed bottom-16 left-0 right-0">
        <form onSubmit={handleEnvoyerCommentaire} className="max-w-2xl mx-auto flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {utilisatrice?.prenom.charAt(0).toUpperCase()}
          </div>
          <input
            type="text"
            value={nouveauCommentaire}
            onChange={(e) => setNouveauCommentaire(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="flex-1 px-4 py-2 bg-pink-50 border border-pink-100 rounded-full focus:outline-none focus:ring-2 focus:ring-sister-300"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={envoiEnCours || !nouveauCommentaire.trim()}
            className="bg-gradient-to-br from-sister-400 to-sister-500 text-white px-4 py-2 rounded-full disabled:opacity-40 hover:shadow-lg transition text-sm font-medium"
          >
            Envoyer
          </button>
        </form>
      </footer>

      <BottomNav />
    </div>
  );
}