// ============================================================================
// SISTER SPACE — Créer un post (modal style, refonte 2026)
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, Camera, Tag } from 'lucide-react';
import * as postService from '../services/postService';
import * as uploadService from '../services/uploadService';
import * as authService from '../services/authService';
import Sidebar from '../components/Sidebar';

const CATEGORIES = [
  { id: 'advice', label: 'Advice', emoji: '💡' },
  { id: 'going-out', label: 'Going out', emoji: '🎉' },
  { id: 'recommendation', label: 'Recommendation', emoji: '⭐' },
];

export default function CreerPostPage() {
  const navigate = useNavigate();
  const utilisatrice = authService.getUtilisatriceConnectee();
  
  const [contenu, setContenu] = useState('');
  const [categorie, setCategorie] = useState<string>('advice');
  const [photo, setPhoto] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  // Gestion du choix d'image
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    
    if (fichier.size > 5 * 1024 * 1024) {
      setErreur('La photo ne doit pas dépasser 5 Mo');
      return;
    }
    
    setPhoto(fichier);
    setApercu(URL.createObjectURL(fichier));
    setErreur('');
  };

  // Retirer la photo
  const retirerPhoto = () => {
    setPhoto(null);
    setApercu(null);
  };

  // Soumettre le post
  const handleSubmit = async () => {
    if (!contenu.trim()) {
      setErreur('Le contenu ne peut pas être vide');
      return;
    }
    if (contenu.length > 500) {
      setErreur('Le contenu ne peut pas dépasser 500 caractères');
      return;
    }
    
    setLoading(true);
    setErreur('');
    
    try {
      let photos_urls: string[] = [];
      
      // Upload Cloudinary si photo présente
      if (photo) {
        const url = await uploadService.uploadImage(photo);
        photos_urls = [url];
      }
      
      // Créer le post
      await postService.creerPost(contenu, photos_urls);
      
      // Rediriger vers le feed
      navigate('/feed');
    } catch (err: any) {
      setErreur(err.response?.data?.message || 'Erreur lors de la création du post');
    } finally {
      setLoading(false);
    }
  };

  // Initiale du prénom
  const initiale = utilisatrice?.prenom?.charAt(0).toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sister-50 via-cream to-sister-100">
      
      {/* Sidebar gauche */}
      <Sidebar />

      {/* Overlay sombre */}
      <div className="ml-64 min-h-screen flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
        
        {/* Modal Create post */}
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in">
          
          {/* Header du modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-sister-100">
            <h2 className="text-xl font-bold text-gray-900">Create post</h2>
            <button
              onClick={() => navigate('/feed')}
              className="w-8 h-8 rounded-full bg-sister-50 hover:bg-sister-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* Contenu du modal */}
          <div className="p-6 space-y-5">
            
            {/* Header utilisatrice */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sister-400 to-sister-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {initiale}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{utilisatrice?.prenom}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-1.5 h-1.5 bg-sister-500 rounded-full"></span>
                  <span>Public · in Sister Space</span>
                </div>
              </div>
            </div>

            {/* Textarea contenu */}
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="What's on your mind? Ask for advice, share an outing, recommend a spot..."
              rows={4}
              maxLength={500}
              className="w-full bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none resize-none text-base leading-relaxed"
            />

            {/* Zone d'upload photo */}
            {!apercu ? (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-sister-200 bg-gradient-to-br from-sister-50 to-cream rounded-2xl p-8 text-center hover:border-sister-400 hover:bg-sister-50 transition">
                  <ImageIcon className="w-10 h-10 text-sister-400 mx-auto mb-2" strokeWidth={1.5} />
                  <p className="text-sm font-semibold text-sister-600">Drag photos here or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">Optional · up to 4 images</p>
                </div>
              </label>
            ) : (
              <div className="relative">
                <img src={apercu} alt="Aperçu" className="w-full max-h-80 object-cover rounded-2xl" />
                <button
                  onClick={retirerPhoto}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            )}

            {/* Choix de catégorie */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Choose a category
              </p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategorie(cat.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition ${
                      categorie === cat.id
                        ? 'bg-peach-100 text-sister-700 border-peach-300'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-sister-300'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Erreur */}
            {erreur && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
                ⚠️ {erreur}
              </div>
            )}
          </div>

          {/* Footer du modal */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-sister-100">
            <div className="flex items-center gap-3">
              {/* Bouton ajouter image (alternatif) */}
              <label className="cursor-pointer text-gray-400 hover:text-sister-500 transition">
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                <ImageIcon className="w-5 h-5" strokeWidth={2} />
              </label>
              <button className="text-gray-400 hover:text-sister-500 transition">
                <Camera className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {contenu.length} / 500
              </span>
              <button
                onClick={handleSubmit}
                disabled={loading || !contenu.trim()}
                className="bg-gradient-to-r from-sister-400 to-sister-500 hover:from-sister-500 hover:to-sister-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Publication...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}