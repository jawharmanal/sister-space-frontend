// ============================================================================
// SISTER SPACE — Page de détail d'un post (avec commentaires)
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Send } from 'lucide-react';
import * as postService from '../services/postService';
import * as authService from '../services/authService';
import type { Commentaire } from '../services/postService';
import Avatar from '../components/Avatar';
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
      if (post) {
        setPost({
          ...post,
          commentaires: [...post.commentaires, commentaire],
        });
      }
      setNouveauCommentaire('');
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
      <div className="min-h-screen flex flex-col items-center justify-center pb-28 gap-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-sister-400 rounded-full animate-pulse" />
          <span className="w-2 h-2 bg-sister-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 bg-sister-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        <p className="text-mauve-400 text-sm">Chargement...</p>
        <BottomNav />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-28">
        <div className="card-sister p-8 text-center">
          <div className="text-4xl mb-3">🌸</div>
          <p className="text-cocoa-800">Post introuvable</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="glass sticky top-0 z-10 border-b border-sister-100/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-sister-50 text-mauve-500 hover:text-sister-600 transition"
          >
            <ArrowLeft size={20} strokeWidth={1.75} />
          </button>
          <h1 className="font-serif text-xl text-cocoa-900">Publication</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-5 animate-fade-in-up">

        {/* Carte du post */}
        <article className="card-sister p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Avatar prenom={post.auteure_prenom} taille="md" />
            <div>
              <div className="font-semibold text-cocoa-900">{post.auteure_prenom}</div>
              <div className="text-xs text-sister-600">{post.auteure_pseudo}</div>
            </div>
          </div>

          <p className="text-cocoa-800 mb-4 whitespace-pre-line leading-relaxed">{post.contenu}</p>

          {post.photos_urls && post.photos_urls.length > 0 && (
            <div className="rounded-2xl overflow-hidden mb-4 shadow-cream">
              <img src={post.photos_urls[0]} alt="Post" className="w-full max-h-[500px] object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-sister-100/60">
            <div className="text-xs text-mauve-400">{formaterDate(post.date_creation)}</div>
            <div className="flex items-center gap-1.5 text-sister-600">
              <Heart size={16} fill="currentColor" strokeWidth={0} />
              <span className="text-sm font-medium">{post.nb_likes}</span>
            </div>
          </div>
        </article>

        {/* Section commentaires */}
        <div>
          <h2 className="font-serif text-lg text-cocoa-900 mb-4">
            Commentaires <span className="text-mauve-400 text-sm font-sans">({post.commentaires.length})</span>
          </h2>

          {post.commentaires.length === 0 && (
            <div className="card-sister p-8 text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-mauve-500">Sois la première à commenter !</p>
            </div>
          )}

          {post.commentaires.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-4 mb-2 border border-sister-100/60 shadow-cream">
              <div className="flex items-start gap-3">
                <Avatar prenom={c.auteure_prenom} taille="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <div className="font-semibold text-cocoa-900 text-sm">{c.auteure_prenom}</div>
                    <div className="text-xs text-mauve-400">{formaterDate(c.date_creation)}</div>
                  </div>
                  <p className="text-cocoa-800 text-sm leading-relaxed">{c.contenu}</p>
                </div>
              </div>
            </div>
          ))}

          <div ref={commentairesEndRef} />
        </div>
      </main>

      {/* Zone de saisie du commentaire */}
      <footer className="bg-white/85 backdrop-blur-md border-t border-sister-100 p-3 fixed bottom-20 left-0 right-0">
        <form onSubmit={handleEnvoyerCommentaire} className="max-w-2xl mx-auto flex items-center gap-2">
          {utilisatrice && <Avatar prenom={utilisatrice.prenom} taille="sm" />}
          <input
            type="text"
            value={nouveauCommentaire}
            onChange={(e) => setNouveauCommentaire(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="flex-1 px-4 py-2.5 bg-sister-50/60 border border-sister-100 rounded-full text-cocoa-900 placeholder-mauve-400 focus:outline-none focus:border-sister-400 focus:ring-4 focus:ring-sister-100 text-sm"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={envoiEnCours || !nouveauCommentaire.trim()}
            className="w-10 h-10 rounded-full bg-gradient-sister text-white flex items-center justify-center disabled:opacity-40 shadow-pink-soft hover:scale-105 active:scale-95 transition disabled:hover:scale-100"
          >
            <Send size={14} strokeWidth={2} />
          </button>
        </form>
      </footer>

      <BottomNav />
    </div>
  );
}