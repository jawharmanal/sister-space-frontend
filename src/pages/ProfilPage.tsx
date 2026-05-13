// ============================================================================
// SISTER SPACE — Page Profil (avec posts en grille + photos)
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Heart } from 'lucide-react';
import api from '../services/api';
import * as authService from '../services/authService';
import BottomNav from '../components/BottomNav';
import Avatar from '../components/Avatar';

interface PostUtilisatrice {
  id: number;
  contenu: string;
  date_creation: string;
  nb_likes: string;
  photos_urls: string[] | null;
}

export default function ProfilPage() {
  const navigate = useNavigate();
  const utilisatrice = authService.getUtilisatriceConnectee();

  const [mesPosts, setMesPosts] = useState<PostUtilisatrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!utilisatrice) {
      navigate('/login');
      return;
    }

    const chargerMesPosts = async () => {
      try {
        const response = await api.get('/posts');
        const tousLesPosts = response.data.data;
        const filtres = tousLesPosts.filter(
          (p: any) => p.id_auteure === utilisatrice.id
        );
        setMesPosts(filtres);
      } catch (err) {
        console.error('Erreur chargement profil :', err);
      } finally {
        setLoading(false);
      }
    };
    chargerMesPosts();
  }, []);

  if (!utilisatrice) return null;

  return (
    <div className="min-h-screen pb-28">

      {/* Header avec glassmorphism */}
      <header className="glass sticky top-0 z-10 border-b border-sister-100/50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/feed"
            className="p-2 -ml-2 rounded-full hover:bg-sister-50 text-mauve-500 hover:text-sister-600 transition"
          >
            <ArrowLeft size={20} strokeWidth={1.75} />
          </Link>
          <h1 className="font-serif text-lg text-cocoa-900">{utilisatrice.pseudo}</h1>
          <Link
            to="/parametres"
            className="p-2 -mr-2 rounded-full hover:bg-sister-50 text-mauve-500 hover:text-sister-600 transition"
          >
            <Settings size={20} strokeWidth={1.75} />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-8 animate-fade-in-up">

        {/* Avatar + nom + pseudo */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4 p-1 bg-gradient-sister rounded-full shadow-pink-glow">
            <div className="bg-white rounded-full p-1">
              <Avatar prenom={utilisatrice.prenom} taille="2xl" photoUrl={(utilisatrice as any).photoUrl} />
            </div>
          </div>
          <h2 className="font-serif text-3xl text-cocoa-900">{utilisatrice.prenom}</h2>
          <p className="text-sister-600 text-sm mt-0.5">{utilisatrice.pseudo}</p>
          {(utilisatrice as any).bio && (
            <p className="text-mauve-600 text-sm text-center mt-3 max-w-xs italic">
              "{(utilisatrice as any).bio}"
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="font-serif text-2xl text-cocoa-900">{mesPosts.length}</div>
            <div className="text-xs text-mauve-500 uppercase tracking-wider mt-0.5">
              {mesPosts.length > 1 ? 'posts' : 'post'}
            </div>
          </div>
          <div className="w-px bg-sister-200" />
          <div className="text-center">
            <div className="font-serif text-2xl text-cocoa-900">0</div>
            <div className="text-xs text-mauve-500 uppercase tracking-wider mt-0.5">sisters</div>
          </div>
        </div>

        {/* Bouton éditer */}
        <div className="text-center mb-10">
          <Link
            to="/parametres"
            className="btn-sister-outline inline-flex items-center gap-2 text-sm"
          >
            <Settings size={14} strokeWidth={1.75} />
            Modifier mon profil
          </Link>
        </div>

        {/* Mes posts en grille */}
        <div>
          <h3 className="font-serif text-xl text-cocoa-900 mb-4 text-center">
            Mes publications
          </h3>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-sister-400 rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-sister-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-sister-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <p className="text-mauve-400 text-sm">Chargement...</p>
            </div>
          )}

          {!loading && mesPosts.length === 0 && (
            <div className="card-sister p-10 text-center">
              <div className="text-5xl mb-3">🌸</div>
              <p className="font-serif text-lg text-cocoa-900 mb-1">Pas encore de post</p>
              <p className="text-mauve-500 text-sm mb-5">Partage ta première bonne adresse !</p>
              <Link to="/creer-post" className="btn-sister inline-block text-sm">
                Publier ✨
              </Link>
            </div>
          )}

          {!loading && mesPosts.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5">
              {mesPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer shadow-pink-soft hover:shadow-pink-md transition-shadow"
                >
                  {post.photos_urls && post.photos_urls.length > 0 ? (
                    <>
                      <img
                        src={post.photos_urls[0]}
                        alt="Post"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center pb-3">
                        <div className="text-white text-sm font-medium flex items-center gap-1">
                          <Heart size={14} fill="white" strokeWidth={0} />
                          {post.nb_likes}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sister-100 to-champagne-100 p-3 flex flex-col justify-between">
                      <p className="text-xs text-cocoa-800 line-clamp-5 leading-tight">{post.contenu}</p>
                      <div className="text-xs text-sister-600 font-medium flex items-center gap-1">
                        <Heart size={12} fill="currentColor" strokeWidth={0} />
                        {post.nb_likes}
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}