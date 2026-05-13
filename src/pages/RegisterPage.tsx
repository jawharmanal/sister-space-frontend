// ============================================================================
// SISTER SPACE — Page Inscription
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useState } from 'react';
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
    } else if (interetsSelectionnes.length < 5) {
      setInteretsSelectionnes([...interetsSelectionnes, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');

    if (interetsSelectionnes.length < 3) {
      setErreur('Choisis au moins 3 centres d\'intérêt 🌸');
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

  // ============================================================================
  // ÉCRAN DE SUCCÈS APRÈS INSCRIPTION
  // ============================================================================
  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-sister-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-champagne-100 rounded-full opacity-40 blur-3xl pointer-events-none" />

        <div className="relative glass p-10 rounded-4xl shadow-pink-md max-w-md w-full text-center animate-fade-in-up">
          {/* Logo */}
          <div className="inline-block mb-5">
            <div className="w-20 h-20 mx-auto bg-gradient-sister rounded-full flex items-center justify-center shadow-pink-glow">
              <span className="text-4xl">🌸</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl text-cocoa-900 mb-2">
            Bienvenue dans la team !
          </h1>
          <p className="font-serif text-lg text-sister-600 italic mb-5">
            Ton compte est presque prêt
          </p>

          <div className="bg-sister-50/60 border border-sister-100 rounded-2xl p-4 mb-6">
            <p className="text-mauve-700 text-sm leading-relaxed">
              💗 Ton inscription a bien été reçue !<br />
              Notre équipe va valider ton compte rapidement et tu recevras une confirmation pour rejoindre la communauté ✨
            </p>
          </div>

          <Link to="/login" className="btn-sister inline-block">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================================
  // FORMULAIRE D'INSCRIPTION
  // ============================================================================
  return (
    <div className="min-h-screen py-10 px-4 relative overflow-hidden">

      {/* Cercles décoratifs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-sister-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-champagne-100 rounded-full opacity-40 blur-3xl pointer-events-none" />

      <div className="relative glass p-8 rounded-4xl shadow-pink-md w-full max-w-md mx-auto animate-fade-in-up">

        {/* En-tête */}
        <div className="text-center mb-7">
          <div className="inline-block mb-3">
            <div className="w-14 h-14 mx-auto bg-gradient-sister rounded-full flex items-center justify-center shadow-pink-md">
              <span className="text-2xl">🌸</span>
            </div>
          </div>
          <h1 className="font-serif text-3xl text-cocoa-900 mb-1">
            Rejoins-nous
          </h1>
          <p className="font-serif text-lg text-sister-600 italic mb-2">
            chez Sister Space
          </p>
          <p className="text-mauve-500 text-sm">
            La communauté rien que pour nous ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ---------- INFOS PERSO ---------- */}

          {/* Prénom */}
          <div>
            <label className="block text-xs font-medium text-mauve-700 mb-1.5 uppercase tracking-wider">
              Prénom
            </label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              className="input-sister"
            />
          </div>

          {/* Pseudo */}
          <div>
            <label className="block text-xs font-medium text-mauve-700 mb-1.5 uppercase tracking-wider">
              Pseudo
            </label>
            <input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="@toi"
              required
              className="input-sister"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-mauve-700 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              required
              className="input-sister"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-medium text-mauve-700 mb-1.5 uppercase tracking-wider">
              Mot de passe
            </label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              required
              className="input-sister"
            />
            <p className="text-[11px] text-mauve-400 mt-1.5 pl-1">
              Min. 8 caractères : maj / min / chiffre / spécial
            </p>
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-xs font-medium text-mauve-700 mb-1.5 uppercase tracking-wider">
              Date de naissance
            </label>
            <input
              type="date"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              required
              className="input-sister"
            />
          </div>

          {/* Ville */}
          <div>
            <label className="block text-xs font-medium text-mauve-700 mb-1.5 uppercase tracking-wider">
              Ville
            </label>
            <select
              value={idVille}
              onChange={(e) => setIdVille(parseInt(e.target.value))}
              className="input-sister cursor-pointer"
            >
              {VILLES_POPULAIRES.map((v) => (
                <option key={v.id} value={v.id}>{v.nom}</option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-mauve-700 mb-1.5 uppercase tracking-wider">
              Bio <span className="text-mauve-400 normal-case">(optionnel)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Présente-toi en quelques mots..."
              maxLength={150}
              rows={3}
              className="input-sister resize-none"
            />
            <p className="text-[11px] text-mauve-400 mt-1 text-right pr-1">
              {bio.length}/150
            </p>
          </div>

          {/* ---------- CENTRES D'INTÉRÊT ---------- */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-mauve-700 mb-2 uppercase tracking-wider">
              Tes passions
              <span className="ml-2 normal-case text-mauve-400">
                ({interetsSelectionnes.length}/5 — min. 3)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CENTRES_INTERET.map((c) => {
                const actif = interetsSelectionnes.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleInteret(c.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      actif
                        ? 'bg-gradient-sister text-white shadow-pink-soft scale-105'
                        : 'bg-white text-mauve-500 border border-sister-200 hover:border-sister-400 hover:bg-sister-50'
                    }`}
                  >
                    <span className="mr-1">{c.emoji}</span>
                    {c.nom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ---------- CASES RGPD ---------- */}
          <div className="space-y-2.5 pt-3 border-t border-sister-100">
            <p className="text-xs font-medium text-mauve-700 uppercase tracking-wider mb-2">
              Avant de continuer
            </p>

            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={identificationFemme}
                onChange={(e) => setIdentificationFemme(e.target.checked)}
                required
                className="mt-0.5 w-4 h-4 rounded border-sister-300 accent-sister-500"
              />
              <span className="text-sm text-mauve-700 group-hover:text-cocoa-900 transition">
                Je m'identifie comme une femme 🌸
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptationCgu}
                onChange={(e) => setAcceptationCgu(e.target.checked)}
                required
                className="mt-0.5 w-4 h-4 rounded border-sister-300 accent-sister-500"
              />
              <span className="text-sm text-mauve-700 group-hover:text-cocoa-900 transition">
                J'accepte les CGU et la politique de confidentialité
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={consentementDonnees}
                onChange={(e) => setConsentementDonnees(e.target.checked)}
                required
                className="mt-0.5 w-4 h-4 rounded border-sister-300 accent-sister-500"
              />
              <span className="text-sm text-mauve-700 group-hover:text-cocoa-900 transition">
                Je consens au traitement de mes données (RGPD)
              </span>
            </label>
          </div>

          {/* Erreur */}
          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-sm flex items-start gap-2 animate-fade-in">
              <span>⚠️</span>
              <span>{erreur}</span>
            </div>
          )}

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-sister w-full text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </span>
            ) : (
              'Créer mon compte 🌸'
            )}
          </button>

          {/* Séparateur */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-sister-200" />
            <span className="text-xs text-mauve-400 uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-sister-200" />
          </div>

          {/* Lien connexion */}
          <p className="text-center text-sm text-mauve-500">
            Déjà membre ?{' '}
            <Link to="/login" className="text-sister-600 hover:text-sister-700 font-semibold hover:underline">
              Connecte-toi ✨
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}