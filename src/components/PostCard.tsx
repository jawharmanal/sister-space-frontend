// ============================================================================
// SISTER SPACE — Composant PostCard (une carte de post)
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../services/postService';
import * as postService from '../services/postService';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [nbLikes, setNbLikes] = useState(parseInt(post.nb_likes));
  const [estLike, setEstLike] = useState(false);

  // Première lettre du prénom pour l'avatar
  const initiale = post.auteure_prenom.charAt(0).toUpperCase();

  // Format de la date relative (ex: "12 min ago")
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
    // Empêcher le clic du like de déclencher la navigation vers /post/:id
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
    <Link to={`/post/${post.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 border border-pink-100 hover:shadow-md transition">
        
        {/* En-tête : avatar + prénom + date */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white font-bold">
            {initiale}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{post.auteure_prenom}</div>
            <div className="text-xs text-gray-400">{formaterDate(post.date_creation)}</div>
          </div>
        </div>

        {/* Contenu du post */}
        <p className="text-gray-700 leading-relaxed mb-3">{post.contenu}</p>

        {/* Photos (si présentes) */}
        {post.photos_urls && post.photos_urls.length > 0 && (
          <div className="bg-pink-50 rounded-xl p-8 mb-3 text-center text-pink-300 text-sm">
            📷 {post.photos_urls.length} photo(s)
          </div>
        )}

        {/* Actions : like + commentaire */}
        <div className="flex items-center gap-4 pt-2 border-t border-pink-50">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-gray-500 hover:text-sister-500 transition"
          >
            <span className="text-lg">{estLike ? '❤️' : '🤍'}</span>
            <span className="text-sm font-medium">{nbLikes}</span>
          </button>
          
          <button 
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-gray-500 hover:text-sister-500 transition"
          >
            <span className="text-lg">💬</span>
            <span className="text-sm font-medium">{post.nb_commentaires}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}