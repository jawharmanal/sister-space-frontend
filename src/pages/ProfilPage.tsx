// ============================================================================
// SISTER SPACE — Page Profil (avec posts en grille + photos)
// ============================================================================

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!utilisatrice) return null;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-pink-50 to-white">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/feed" className="text-sister-500 hover:text-sister-700 text-xl">←</Link>
          <h1 className="font-semibold text-gray-800">{utilisatrice.pseudo}</h1>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-sister-500"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-8">
        
        {/* Avatar + nom + pseudo */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3 ring-4 ring-pink-100 rounded-full">
            <Avatar prenom={utilisatrice.prenom} taille="xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{utilisatrice.prenom}</h2>
          <p className="text-sister-500 text-sm">{utilisatrice.pseudo}</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{mesPosts.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">0</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">friends</div>
          </div>
        </div>

        {/* Bouton éditer */}
        <div className="text-center mb-8">
          <button className="bg-white border-2 border-sister-200 text-sister-600 px-6 py-2 rounded-full font-medium text-sm hover:bg-sister-50 transition">
            ✏️ Edit profile
          </button>
        </div>

        {/* Mes posts en grille */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 uppercase text-sm tracking-wide">
            Mes posts
          </h3>
          
          {loading && (
            <div className="text-center text-gray-400 py-8">Chargement... 🌸</div>
          )}

          {!loading && mesPosts.length === 0 && (
            <div className="bg-pink-50 rounded-2xl p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🌸</div>
              <p>Tu n'as pas encore publié de post</p>
              <Link
                to="/creer-post"
                className="inline-block mt-3 bg-sister-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-sister-600"
              >
                Publier mon premier post
              </Link>
            </div>
          )}

          {!loading && mesPosts.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {mesPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
                >
                  {/* Si le post a une photo, on l'affiche */}
                  {post.photos_urls && post.photos_urls.length > 0 ? (
                    <>
                      <img 
                        src={post.photos_urls[0]} 
                        alt="Post" 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {/* Overlay au hover avec le nb de likes */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="text-white font-bold flex items-center gap-1 text-sm">
                          ❤️ {post.nb_likes}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Sinon : carte avec le texte du post */
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 p-3 flex flex-col justify-between">
                      <p className="text-xs text-gray-700 line-clamp-4 leading-tight">{post.contenu}</p>
                      <div className="text-xs text-sister-600 font-semibold flex items-center gap-1">
                        ❤️ {post.nb_likes}
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