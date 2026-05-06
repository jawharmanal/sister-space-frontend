// ============================================================================
// SISTER SPACE — Page Inscription
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

interface Ville {
  id: number;
  nom: string;
}

interface CentreInteret {
  id: number;
  nom: string;
  emoji: string;
}

const CENTRES_INTERET: CentreInteret[] = [
  { id: 1, nom: 'Restos', emoji: '🍴' },
  { id: 2, nom: 'Cinéma', emoji: '🎬' },
  { id: 3, nom: 'Shopping', emoji: '🛍️' },
  { id: 4, nom: 'Culture', emoji: '🎨' },
  { id: 5, nom: 'Sport', emoji: '💪' },
  { id: 6, nom: 'Bien-être', emoji: '🌿' },
  { id: 7, nom: 'Musique', emoji: '🎵' },
  { id: 8, nom: 'Voyages', emoji: '✈️' },
];

const VILLES_POPULAIRES: Ville[] = [
  { id: 1, nom: 'Paris' },
  { id: 2, nom: 'Lyon' },
  { id: 3, nom: 'Marseille' },
  { id: 4, nom: 'Toulouse' },
  { id: 5, nom: 'Bordeaux' },
  { id: 6, nom: 'Nice' },
  { id: 7, nom: 'Nantes' },
  { id: 8, nom: 'Strasbourg' },
  { id: 9, nom: 'Montpellier' },
  { id: 10, nom: 'Lille' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  
  // ----- États du formulaire -----
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [prenom, setPrenom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [idVille, setIdVille] = useState<number>(1);
  const [bio, setBio] = useState('');
  const [interetsSelectionnes, setInteretsSelectionnes] = useState<number[]>([]);
  const [identificationFemme, setIdentificationFemme] = useState(false);
  const [acceptationCgu, setAcceptationCgu] = useState(false);
  const [consentementDonnees, setConsentementDonnees] = useState(false);

  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleInteret = (id: number) => {
    if (interetsSelectionnes.includes(id)) {
      setInteretsSelectionnes(interetsSelectionnes.filter((i) => i !== id));
    } else {
      if (interetsSelectionnes.length < 5) {
        setInteretsSelectionnes([...interetsSelectionnes, id]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');

    if (interetsSelectionnes.length < 3) {
      setErreur('Choisis au moins 3 centres d\'intérêt');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        email,
        mot_de_passe: motDePasse,
        prenom,
        pseudo,
        date_naissance: dateNaissance,
        id_ville: idVille,
        bio,
        centres_interet: interetsSelectionnes,
        identification_femme: identificationFemme,
        acceptation_cgu: acceptationCgu,
        consentement_donnees: consentementDonnees,
      });
      setSucces(true);
    } catch (err: any) {
      setErreur(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  // Écran de succès après inscription
  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center">
          <div className="text-6xl mb-4">🌸</div>
          <h1 className="text-2xl font-bold text-sister-600 mb-4">
            Inscription réussie !
          </h1>
          <p className="text-gray-600 mb-6">
            Ton compte est en attente de validation par notre équipe.
            Tu recevras un email dès qu'il sera activé. 💕
          </p>
          <Link
            to="/login"
            className="inline-block bg-sister-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-sister-600 transition"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md mx-auto">
        
        {/* En-tête */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌸</div>
          <h1 className="text-2xl font-bold text-sister-600">
            Rejoins Sister Space
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            La communauté rien que pour nous 💕
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Prénom */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Prénom</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-400"
            />
          </div>

          {/* Pseudo */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Pseudo (@username)</label>
            <input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="@toi"
              required
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-400"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="Min. 8 caractères : maj/min/chiffre/spécial"
              required
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-400"
            />
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Date de naissance</label>
            <input
              type="date"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              required
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-400"
            />
          </div>

          {/* Ville */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Ville</label>
            <select
              value={idVille}
              onChange={(e) => setIdVille(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-400 bg-white"
            >
              {VILLES_POPULAIRES.map((v) => (
                <option key={v.id} value={v.id}>{v.nom}</option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Bio (optionnel)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Présente-toi en quelques mots..."
              maxLength={150}
              rows={2}
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-400 resize-none"
            />
          </div>

          {/* Centres d'intérêt */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
              Centres d'intérêt ({interetsSelectionnes.length}/5 — min. 3)
            </label>
            <div className="flex flex-wrap gap-2">
              {CENTRES_INTERET.map((c) => {
                const actif = interetsSelectionnes.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleInteret(c.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      actif
                        ? 'bg-sister-100 text-sister-700 border-2 border-sister-400'
                        : 'bg-white text-gray-500 border-2 border-pink-100'
                    }`}
                  >
                    {c.emoji} {c.nom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cases à cocher RGPD */}
          <div className="space-y-2 pt-2">
            <label className="flex items-start gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={identificationFemme}
                onChange={(e) => setIdentificationFemme(e.target.checked)}
                required
                className="mt-1 w-4 h-4 accent-sister-500"
              />
              <span className="text-gray-600">Je m'identifie comme une femme 🌸</span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={acceptationCgu}
                onChange={(e) => setAcceptationCgu(e.target.checked)}
                required
                className="mt-1 w-4 h-4 accent-sister-500"
              />
              <span className="text-gray-600">J'accepte les CGU et la politique de confidentialité</span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={consentementDonnees}
                onChange={(e) => setConsentementDonnees(e.target.checked)}
                required
                className="mt-1 w-4 h-4 accent-sister-500"
              />
              <span className="text-gray-600">Je consens au traitement de mes données personnelles (RGPD)</span>
            </label>
          </div>

          {/* Erreur */}
          {erreur && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">
              ⚠️ {erreur}
            </div>
          )}

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sister-500 hover:bg-sister-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? 'Inscription en cours...' : 'Créer mon compte'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Déjà membre ?{' '}
            <Link to="/login" className="text-sister-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}