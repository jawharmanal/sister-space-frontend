// ============================================================================
// SISTER SPACE — Composant PostCard (une carte de post)
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import type { Post } from '../services/postService';
import * as postService from '../services/postService';
import Avatar from './Avatar';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [nbLikes, setNbLikes] = useState(parseInt(post.nb_likes));
  const [estLike, setEstLike] = useState(false);

  // Format de la date relative
  const formaterDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const maintenant = new Date();
    const diffMin = Math.floor((maintenant.getTime() - date.getTime()) / 60000);

    if (diffMin < 1) return 'à l\'instant';
    if (diffMin < 60) return `il y a ${diffMin} min`;
    const diffHeures = Math.floor(diffMin / 60);
    if (diffHeures < 24) return `il y a ${diffHeures}h`;
    const diffJours = Math.floor(diffHeures / 24);
    if (diffJours < 7) return `il y a ${diffJours}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (estLike) {
        await postService.unlikerPost(post.id);
        setNbLikes(nbLikes - 1);
        setEstLike(false);
      } else {
        await postService.likerPost(post.id);
        setNbLikes(nbLikes + 1);
        setEstLike(true);
      }
    } catch (err) {
      console.error('Erreur like :', err);
    }
  };

  return (
    <Link to={`/post/${post.id}`} className="block group">
      <article className="card-sister p-6 mb-5 animate-fade-in">

        {/* En-tête : avatar + prénom + date */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar prenom={post.auteure_prenom} taille="md" />
          <div className="flex-1">
            <div className="font-semibold text-cocoa-900 group-hover:text-sister-600 transition">
              {post.auteure_prenom}
            </div>
            <div className="text-xs text-mauve-400">{formaterDate(post.date_creation)}</div>
          </div>
        </div>

        {/* Contenu du post */}
        <p className="text-cocoa-800 leading-relaxed mb-4 whitespace-pre-line">
          {post.contenu}
        </p>

        {/* Photos (si présentes) */}
        {post.photos_urls && post.photos_urls.length > 0 && (
          <div className="rounded-2xl overflow-hidden mb-4 shadow-cream">
            <img
              src={post.photos_urls[0]}
              alt="Post"
              className="w-full max-h-[500px] object-cover hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        )}

        {/* Actions : like + commentaire */}
        <div className="flex items-center gap-2 pt-3 border-t border-sister-100/60">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              estLike
                ? 'bg-sister-100 text-sister-600'
                : 'text-mauve-500 hover:bg-sister-50 hover:text-sister-500'
            }`}
          >
            <Heart
              size={18}
              fill={estLike ? 'currentColor' : 'none'}
              strokeWidth={estLike ? 0 : 1.75}
              className={estLike ? 'animate-fade-in' : ''}
            />
            <span className="text-sm font-medium">{nbLikes}</span>
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-mauve-500 hover:bg-sister-50 hover:text-sister-500 transition-all"
          >
            <MessageCircle size={18} strokeWidth={1.75} />
            <span className="text-sm font-medium">{post.nb_commentaires}</span>
          </button>
        </div>
      </article>
    </Link>
  );
}