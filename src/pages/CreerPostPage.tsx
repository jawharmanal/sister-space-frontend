// ============================================================================
// SISTER SPACE — Page Création d'un post (avec upload d'image Cloudinary)
// ============================================================================

import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import * as authService from '../services/authService';
import { uploadImage } from '../services/uploadService';

const TAGS_DISPONIBLES = [
  { id: 1, nom: 'Advice', emoji: '💡' },
  { id: 2, nom: 'Outing', emoji: '🌸' },
  { id: 3, nom: 'Question', emoji: '❓' },
  { id: 4, nom: 'Recommend', emoji: '⭐' },
];

export default function CreerPostPage() {
  const navigate = useNavigate();
  const utilisatrice = authService.getUtilisatriceConnectee();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contenu, setContenu] = useState('');
  const [tagsSelectionnes, setTagsSelectionnes] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  
  // États pour la photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoApercu, setPhotoApercu] = useState<string>('');
  const [uploadEnCours, setUploadEnCours] = useState(false);

  // Toggle un tag dans la sélection
  const toggleTag = (id: number) => {
    if (tagsSelectionnes.includes(id)) {
      setTagsSelectionnes(tagsSelectionnes.filter((t) => t !== id));
    } else {
      setTagsSelectionnes([...tagsSelectionnes, id]);
    }
  };

  // Quand l'utilisatrice sélectionne une image
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification taille (max 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
      setErreur('Image trop lourde (max 5 Mo)');
      return;
    }

    // Vérification type
    if (!file.type.startsWith('image/')) {
      setErreur('Le fichier doit être une image');
      return;
    }

    setErreur('');
    setPhotoFile(file);
    
    // Aperçu local
    const reader = new FileReader();
    reader.onload = () => setPhotoApercu(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Retirer la photo sélectionnée
  const retirerPhoto = () => {
    setPhotoFile(null);
    setPhotoApercu('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');

    if (!contenu.trim()) {
      setErreur('Le post ne peut pas être vide');
      return;
    }

    setLoading(true);
    try {
      // 1. Si une photo est sélectionnée, l'uploader d'abord
      let photos_urls: string[] = [];
      if (photoFile) {
        setUploadEnCours(true);
        const url = await uploadImage(photoFile);
        photos_urls.push(url);
        setUploadEnCours(false);
      }

      // 2. Créer le post avec l'URL de la photo
      await api.post('/posts', { 
        contenu,
        photos_urls: photos_urls.length > 0 ? photos_urls : undefined,
      });
      
      navigate('/feed'); // Retour au fil après publication
    } catch (err: any) {
      if (err.message === 'IMAGE_TROP_LOURDE') {
        setErreur('Image trop lourde (max 5 Mo)');
      } else if (err.message === 'UPLOAD_ECHEC') {
        setErreur('Échec de l\'upload de l\'image');
      } else {
        setErreur(err.response?.data?.message || 'Erreur lors de la publication');
      }
    } finally {
      setLoading(false);
      setUploadEnCours(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/feed" className="text-gray-500 text-sm hover:text-sister-500">
            ✕ Annuler
          </Link>
          <h1 className="text-lg font-semibold text-gray-800">New post</h1>
          <button
            onClick={handleSubmit}
            disabled={loading || !contenu.trim()}
            className="bg-sister-500 hover:bg-sister-600 disabled:opacity-40 text-white px-5 py-1.5 rounded-full text-sm font-semibold transition"
          >
            {uploadEnCours ? 'Upload...' : loading ? '...' : 'Post'}
          </button>
        </div>
      </header>

      {/* Formulaire */}
      <main className="max-w-2xl mx-auto px-4 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Auteur */}
          {utilisatrice && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white font-bold">
                {utilisatrice.prenom.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{utilisatrice.prenom}</div>
                <div className="text-xs text-sister-500">🌸 Public · in bloom</div>
              </div>
            </div>
          )}

          {/* Zone de texte */}
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Quoi de neuf, sister ?"
            maxLength={500}
            rows={6}
            className="w-full p-4 border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sister-300 resize-none text-gray-700"
          />
          <div className="text-right text-xs text-gray-400">
            {contenu.length} / 500
          </div>

          {/* Zone d'upload de photo */}
          {!photoApercu ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-pink-50 border-2 border-dashed border-pink-200 rounded-2xl py-8 text-center text-pink-400 hover:bg-pink-100 hover:border-sister-300 transition cursor-pointer"
            >
              <div className="text-3xl mb-2">📷</div>
              <div className="text-sm font-medium">Ajouter une photo</div>
              <div className="text-xs">Optionnel · max 5 Mo</div>
            </button>
          ) : (
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={photoApercu} 
                alt="Aperçu" 
                className="w-full max-h-96 object-cover"
              />
              <button
                type="button"
                onClick={retirerPhoto}
                className="absolute top-3 right-3 bg-black bg-opacity-60 hover:bg-opacity-80 text-white w-9 h-9 rounded-full flex items-center justify-center text-lg transition"
                title="Retirer la photo"
              >
                ✕
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />

          {/* Tags */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Tag your post
            </div>
            <div className="flex flex-wrap gap-2">
              {TAGS_DISPONIBLES.map((tag) => {
                const actif = tagsSelectionnes.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      actif
                        ? 'bg-sister-100 text-sister-700 border-2 border-sister-400'
                        : 'bg-white text-gray-500 border-2 border-pink-100 hover:border-sister-200'
                    }`}
                  >
                    {tag.emoji} {tag.nom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Erreur */}
          {erreur && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">
              ⚠️ {erreur}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}