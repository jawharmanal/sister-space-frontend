// ============================================================================
// SISTER SPACE — Page Inscription (refonte 2026)
// ============================================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
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

  // ----- États du formulaire (inchangés) -----
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

  const handleSubmit = async () => {
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

  // ===========================================================================
  // ÉCRAN DE SUCCÈS APRÈS INSCRIPTION
  // ===========================================================================
  if (succes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sister-50 via-cream to-sister-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-sister-200/50 p-10 max-w-md w-full text-center animate-fade-in">
          
          {/* Logo */}
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sister-400 to-sister-500 rounded-2xl flex items-center justify-center shadow-lg mb-5">
            <Sparkles className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue !
          </h1>
          <p className="text-2xl font-serif italic text-sister-500 mb-6">
            you're almost in
          </p>

          <div className="bg-sister-50 border border-sister-100 rounded-2xl p-5 mb-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              💗 Ton inscription a bien été reçue !<br />
              Notre équipe va valider ton compte rapidement et tu recevras une confirmation pour rejoindre la communauté ✨
            </p>
          </div>

          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sister-400 to-sister-500 hover:from-sister-500 hover:to-sister-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-sister-300/50 transition"
          >
            Retour à la connexion
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // FORMULAIRE D'INSCRIPTION
  // ===========================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-sister-50 via-cream to-sister-100 py-10 px-4">
      
      {/* Header */}
      <header className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sister-400 to-sister-500 flex items-center justify-center text-white font-bold shadow-md">
            s
          </div>
          <span className="text-2xl font-serif italic text-sister-600">Sister Space</span>
        </Link>
        <Link 
          to="/login" 
          className="text-sm text-gray-700 hover:text-sister-600 font-medium transition"
        >
          Déjà membre ? <span className="text-sister-500 font-semibold">Sign in</span>
        </Link>
      </header>

      {/* Carte d'inscription */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-sister-200/50 max-w-2xl mx-auto p-8 md:p-10">
        
        {/* Titre */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-sister-50 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-sister-500 rounded-full"></span>
            <span className="text-xs font-semibold text-sister-600 uppercase tracking-wider">Join Sister Space</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Crée ton compte
          </h1>
          <p className="text-2xl font-serif italic text-sister-500">
            and find your circle.
          </p>
        </div>

        {/* Formulaire */}
        <div className="space-y-5">

          {/* Prénom & Pseudo (côte à côte) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Emma"
                className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Pseudo
              </label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="@emma"
                className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emma@sisterspace.app"
              className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Min. 8 caractères : maj / min / chiffre / spécial
            </p>
          </div>

          {/* Date de naissance & Ville */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Ville
              </label>
              <select
                value={idVille}
                onChange={(e) => setIdVille(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition cursor-pointer"
              >
                {VILLES_POPULAIRES.map((v) => (
                  <option key={v.id} value={v.id}>{v.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Bio <span className="text-gray-400 normal-case font-normal">(optionnel)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Présente-toi en quelques mots..."
              maxLength={150}
              rows={3}
              className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {bio.length}/150
            </p>
          </div>

          {/* Centres d'intérêt */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Tes passions
              <span className="ml-2 normal-case font-normal text-gray-400">
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
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      actif
                        ? 'bg-gradient-to-r from-sister-400 to-sister-500 text-white border-transparent shadow-md scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-sister-300 hover:bg-sister-50'
                    }`}
                  >
                    <span className="mr-1">{c.emoji}</span>
                    {c.nom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cases RGPD */}
          <div className="space-y-3 pt-4 border-t border-sister-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Avant de continuer
            </p>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={identificationFemme}
                onChange={(e) => setIdentificationFemme(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-sister-500 focus:ring-sister-400"
              />
              <span className="text-sm text-gray-700">
                Je m'identifie comme une femme 🌸
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptationCgu}
                onChange={(e) => setAcceptationCgu(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-sister-500 focus:ring-sister-400"
              />
              <span className="text-sm text-gray-700">
                J'accepte les <a href="#" className="text-sister-500 hover:underline">CGU</a> et la <a href="#" className="text-sister-500 hover:underline">politique de confidentialité</a>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentementDonnees}
                onChange={(e) => setConsentementDonnees(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-sister-500 focus:ring-sister-400"
              />
              <span className="text-sm text-gray-700">
                Je consens au traitement de mes données (RGPD)
              </span>
            </label>
          </div>

          {/* Erreur */}
          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm flex items-start gap-2">
              <span>⚠️</span>
              <span>{erreur}</span>
            </div>
          )}

          {/* Bouton submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !identificationFemme || !acceptationCgu || !consentementDonnees}
            className="w-full bg-gradient-to-r from-sister-400 to-sister-500 hover:from-sister-500 hover:to-sister-600 text-white py-3.5 rounded-full font-semibold shadow-lg shadow-sister-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </>
            ) : (
              <>
                Créer mon compte
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </>
            )}
          </button>

          {/* Lien connexion */}
          <p className="text-center text-sm text-gray-600 pt-2">
            Déjà membre ?{' '}
            <Link to="/login" className="text-sister-500 hover:text-sister-600 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}