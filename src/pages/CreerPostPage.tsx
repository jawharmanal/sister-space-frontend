// ============================================================================
// SISTER SPACE — Page Création d'un post (avec upload d'image Cloudinary)
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, ImagePlus } from 'lucide-react';
import api from '../services/api';
import * as authService from '../services/authService';
import { uploadImage } from '../services/uploadService';
import Avatar from '../components/Avatar';

const TAGS_DISPONIBLES = [
  { id: 1, nom: 'Conseil',     emoji: '💡' },
  { id: 2, nom: 'Sortie',      emoji: '🌸' },
  { id: 3, nom: 'Question',    emoji: '❓' },
  { id: 4, nom: 'Recommandation', emoji: '⭐' },
];

export default function CreerPostPage() {
  const navigate = useNavigate();
  const utilisatrice = authService.getUtilisatriceConnectee();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contenu, setContenu] = useState('');
  const [tagsSelectionnes, setTagsSelectionnes] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoApercu, setPhotoApercu] = useState<string>('');
  const [uploadEnCours, setUploadEnCours] = useState(false);

  const toggleTag = (id: number) => {
    if (tagsSelectionnes.includes(id)) {
      setTagsSelectionnes(tagsSelectionnes.filter((t) => t !== id));
    } else {
      setTagsSelectionnes([...tagsSelectionnes, id]);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErreur('Image trop lourde (max 5 Mo)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErreur('Le fichier doit être une image');
      return;
    }

    setErreur('');
    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = () => setPhotoApercu(reader.result as string);
    reader.readAsDataURL(file);
  };

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
      let photos_urls: string[] = [];
      if (photoFile) {
        setUploadEnCours(true);
        const url = await uploadImage(photoFile);
        photos_urls.push(url);
        setUploadEnCours(false);
      }

      await api.post('/posts', {
        contenu,
        photos_urls: photos_urls.length > 0 ? photos_urls : undefined,
      });

      navigate('/feed');
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
    <div className="min-h-screen pb-10">

      {/* Header */}
      <header className="glass sticky top-0 z-10 border-b border-sister-100/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            to="/feed"
            className="text-mauve-500 hover:text-sister-600 text-sm font-medium flex items-center gap-1 transition"
          >
            <X size={18} strokeWidth={1.75} />
            Annuler
          </Link>
          <h1 className="font-serif text-lg text-cocoa-900">Nouvelle publication</h1>
          <button
            onClick={handleSubmit}
            disabled={loading || !contenu.trim()}
            className="btn-sister text-sm px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploadEnCours ? 'Upload...' : loading ? '...' : 'Publier'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-6 animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Auteur */}
          {utilisatrice && (
            <div className="flex items-center gap-3 mb-2">
              <Avatar prenom={utilisatrice.prenom} taille="md" />
              <div>
                <div className="font-semibold text-cocoa-900">{utilisatrice.prenom}</div>
                <div className="text-xs text-sister-600 flex items-center gap-1">
                  🌸 Publication publique
                </div>
              </div>
            </div>
          )}

          {/* Zone de texte */}
          <div className="relative">
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Quoi de neuf, sister ? Partage une bonne adresse, une recommandation, une humeur..."
              maxLength={500}
              rows={6}
              className="input-sister resize-none"
            />
            <div className="text-right text-xs text-mauve-400 mt-1 pr-1">
              {contenu.length} / 500
            </div>
          </div>

          {/* Zone d'upload de photo */}
          {!photoApercu ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-sister-50/60 border-2 border-dashed border-sister-200 rounded-3xl py-10 text-center text-sister-500 hover:bg-sister-50 hover:border-sister-400 transition cursor-pointer group"
            >
              <ImagePlus size={36} strokeWidth={1.5} className="mx-auto mb-2 group-hover:scale-110 transition" />
              <div className="text-sm font-medium text-cocoa-800">Ajouter une photo</div>
              <div className="text-xs text-mauve-500 mt-1">Optionnel · max 5 Mo</div>
            </button>
          ) : (
            <div className="relative rounded-3xl overflow-hidden shadow-pink-soft">
              <img src={photoApercu} alt="Aperçu" className="w-full max-h-[500px] object-cover" />
              <button
                type="button"
                onClick={retirerPhoto}
                className="absolute top-3 right-3 bg-cocoa-900/70 hover:bg-cocoa-900 text-white w-9 h-9 rounded-full flex items-center justify-center transition backdrop-blur-sm"
                title="Retirer la photo"
              >
                <X size={16} strokeWidth={2} />
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
            <div className="text-xs font-medium text-mauve-700 mb-2.5 uppercase tracking-wider">
              Catégorise ton post
            </div>
            <div className="flex flex-wrap gap-2">
              {TAGS_DISPONIBLES.map((tag) => {
                const actif = tagsSelectionnes.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      actif
                        ? 'bg-gradient-sister text-white shadow-pink-soft scale-105'
                        : 'bg-white text-mauve-500 border border-sister-200 hover:border-sister-400 hover:bg-sister-50'
                    }`}
                  >
                    <span className="mr-1">{tag.emoji}</span>
                    {tag.nom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Erreur */}
          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-sm flex items-start gap-2">
              <span>⚠️</span>
              <span>{erreur}</span>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}