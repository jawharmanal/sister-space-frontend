// ============================================================================
// SISTER SPACE — Page Paramètres (refonte 2026)
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Lock, AlertTriangle, Save, Trash2, Check } from 'lucide-react';
import * as authService from '../services/authService';
import * as utilisatriceService from '../services/utilisatriceService';
import * as uploadService from '../services/uploadService';
import Sidebar from '../components/Sidebar';

type Onglet = 'infos' | 'photo' | 'motdepasse' | 'suppression';

export default function ParametresPage() {
  const navigate = useNavigate();
  const utilisatrice = authService.getUtilisatriceConnectee();

  const [onglet, setOnglet] = useState<Onglet>('infos');
  const [enChargement, setEnChargement] = useState(false);
  const [messageSucces, setMessageSucces] = useState('');
  const [messageErreur, setMessageErreur] = useState('');

  // -------- Section Infos --------
  const [prenom, setPrenom] = useState(utilisatrice?.prenom || '');
  const [pseudo, setPseudo] = useState(utilisatrice?.pseudo || '');
  const [bio, setBio] = useState(utilisatrice?.bio || '');

  // -------- Section Photo --------
  const [photoUrl, setPhotoUrl] = useState(utilisatrice?.photoUrl || '');
  const [uploadEnCours, setUploadEnCours] = useState(false);

  // -------- Section Mot de passe --------
  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmMdp, setConfirmMdp] = useState('');

  // -------- Section Suppression --------
  const [mdpSuppression, setMdpSuppression] = useState('');
  const [confirmationSuppression, setConfirmationSuppression] = useState(false);

  if (!utilisatrice) {
    navigate('/login');
    return null;
  }

  const initiale = utilisatrice.prenom?.charAt(0).toUpperCase() || '?';

  // Reset des messages quand on change d'onglet
  const changerOnglet = (nouvelOnglet: Onglet) => {
    setOnglet(nouvelOnglet);
    setMessageSucces('');
    setMessageErreur('');
  };

  // -------------------------------------------------------------------------
  // Enregistrer les infos
  // -------------------------------------------------------------------------
  const handleEnregistrerInfos = async () => {
    setMessageSucces('');
    setMessageErreur('');

    if (prenom.length < 2) {
      setMessageErreur('Le prénom doit faire au moins 2 caractères');
      return;
    }
    if (pseudo.length < 3) {
      setMessageErreur('Le pseudo doit faire au moins 3 caractères');
      return;
    }
    if (bio.length > 300) {
      setMessageErreur('La bio ne peut pas dépasser 300 caractères');
      return;
    }

    setEnChargement(true);
    try {
      const utilisatriceModifiee = await utilisatriceService.modifierMonProfil({
        prenom,
        pseudo,
        bio,
      });
      authService.mettreAJourUtilisatriceConnectee(utilisatriceModifiee);
      setMessageSucces('Tes infos ont été mises à jour ! 🌸');
    } catch (err: any) {
      setMessageErreur(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setEnChargement(false);
    }
  };

  // -------------------------------------------------------------------------
  // Changer la photo
  // -------------------------------------------------------------------------
  const handleChangerPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;

    setMessageSucces('');
    setMessageErreur('');
    setUploadEnCours(true);

    try {
      const url = await uploadService.uploadImage(fichier);
      const utilisatriceModifiee = await utilisatriceService.modifierMonProfil({
        photo_url: url,
      });
      setPhotoUrl(url);
      authService.mettreAJourUtilisatriceConnectee(utilisatriceModifiee);
      setMessageSucces('Photo de profil mise à jour ! 📷✨');
    } catch (err: any) {
      setMessageErreur(err.response?.data?.message || "Erreur lors de l'upload");
    } finally {
      setUploadEnCours(false);
    }
  };

  // -------------------------------------------------------------------------
  // Retirer la photo
  // -------------------------------------------------------------------------
  const handleRetirerPhoto = async () => {
    if (!confirm("Remettre l'avatar par défaut ?")) return;

    setEnChargement(true);
    try {
      const utilisatriceModifiee = await utilisatriceService.modifierMonProfil({
        photo_url: '',
      });
      setPhotoUrl('');
      authService.mettreAJourUtilisatriceConnectee(utilisatriceModifiee);
      setMessageSucces('Avatar par défaut remis 🌸');
    } catch (err: any) {
      setMessageErreur(err.response?.data?.message || 'Erreur');
    } finally {
      setEnChargement(false);
    }
  };

  // -------------------------------------------------------------------------
  // Changer le mot de passe
  // -------------------------------------------------------------------------
  const handleChangerMdp = async () => {
    setMessageSucces('');
    setMessageErreur('');

    if (!ancienMdp || !nouveauMdp || !confirmMdp) {
      setMessageErreur('Tous les champs sont obligatoires');
      return;
    }
    if (nouveauMdp.length < 8) {
      setMessageErreur('Le nouveau mot de passe doit faire au moins 8 caractères');
      return;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    if (!regex.test(nouveauMdp)) {
      setMessageErreur('Le mot de passe doit contenir maj/min/chiffre/caractère spécial');
      return;
    }
    if (nouveauMdp !== confirmMdp) {
      setMessageErreur('Les mots de passe ne correspondent pas');
      return;
    }
    if (ancienMdp === nouveauMdp) {
      setMessageErreur("Le nouveau mot de passe doit être différent de l'ancien");
      return;
    }

    setEnChargement(true);
    try {
      await utilisatriceService.changerMonMotDePasse(ancienMdp, nouveauMdp);
      setMessageSucces('Mot de passe changé avec succès ! 🔒✨');
      setAncienMdp('');
      setNouveauMdp('');
      setConfirmMdp('');
    } catch (err: any) {
      setMessageErreur(err.response?.data?.message || 'Erreur');
    } finally {
      setEnChargement(false);
    }
  };

  // -------------------------------------------------------------------------
  // Supprimer le compte
  // -------------------------------------------------------------------------
  const handleSupprimerCompte = async () => {
    setMessageSucces('');
    setMessageErreur('');

    if (!mdpSuppression) {
      setMessageErreur('Mot de passe requis pour confirmer');
      return;
    }
    if (!confirmationSuppression) {
      setMessageErreur('Coche la case de confirmation');
      return;
    }
    if (!confirm('Es-tu VRAIMENT sûre ? Cette action est irréversible 😢')) return;

    setEnChargement(true);
    try {
      await utilisatriceService.supprimerMonCompte(mdpSuppression);
      authService.logout();
      alert('Ton compte a été supprimé. À bientôt 🌸');
      navigate('/login');
    } catch (err: any) {
      setMessageErreur(err.response?.data?.message || 'Erreur lors de la suppression');
      setEnChargement(false);
    }
  };

  // -------------------------------------------------------------------------
  // Liste des onglets (pour boucler proprement)
  // -------------------------------------------------------------------------
  const ONGLETS = [
    { id: 'infos' as const, label: 'Mes infos', Icon: User },
    { id: 'photo' as const, label: 'Photo', Icon: Camera },
    { id: 'motdepasse' as const, label: 'Mot de passe', Icon: Lock },
    { id: 'suppression' as const, label: 'Supprimer', Icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sister-50 via-cream to-sister-100">
      
      <Sidebar />

      <main className="ml-64 px-8 py-6 max-w-4xl">
        
        {/* Header de page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Paramètres</h1>
          <p className="text-gray-500 text-sm">Gère ton compte Sister Space 🌸</p>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-2xl shadow-sm border border-sister-100 p-2 mb-6 inline-flex gap-1">
          {ONGLETS.map(({ id, label, Icon }) => {
            const actif = onglet === id;
            const danger = id === 'suppression';
            return (
              <button
                key={id}
                onClick={() => changerOnglet(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  actif
                    ? danger
                      ? 'bg-red-50 text-red-600'
                      : 'bg-sister-100 text-sister-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages */}
        {messageSucces && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
            <Check className="w-4 h-4" strokeWidth={2} />
            <span>{messageSucces}</span>
          </div>
        )}
        {messageErreur && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            ⚠️ {messageErreur}
          </div>
        )}

        {/* ============ ONGLET INFOS ============ */}
        {onglet === 'infos' && (
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-sister-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Mes informations</h2>
            <p className="text-sm text-gray-500 mb-6">Modifie ton prénom, pseudo et bio</p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={utilisatrice.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pseudo *</label>
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Bio <span className="text-gray-400 font-normal normal-case">({bio.length}/300)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={300}
                  placeholder="Parle un peu de toi..."
                  className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition resize-none"
                />
              </div>

              <button
                onClick={handleEnregistrerInfos}
                disabled={enChargement}
                className="flex items-center gap-2 bg-gradient-to-r from-sister-400 to-sister-500 hover:from-sister-500 hover:to-sister-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-sister-300/50 disabled:opacity-50 transition"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                <span>{enChargement ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ============ ONGLET PHOTO ============ */}
        {onglet === 'photo' && (
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-sister-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Ma photo de profil</h2>
            <p className="text-sm text-gray-500 mb-6">Personnalise ton avatar</p>

            <div className="flex flex-col items-center gap-6 py-6">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Avatar"
                  className="w-40 h-40 rounded-full object-cover ring-4 ring-sister-100 shadow-lg"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-sister-300 to-sister-500 flex items-center justify-center text-white text-6xl font-bold ring-4 ring-sister-100 shadow-lg">
                  {initiale}
                </div>
              )}

              <label className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-sister-400 to-sister-500 hover:from-sister-500 hover:to-sister-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-sister-300/50 transition">
                <Camera className="w-4 h-4" strokeWidth={2} />
                <span>{uploadEnCours ? 'Upload en cours...' : 'Choisir une photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChangerPhoto}
                  disabled={uploadEnCours}
                  className="hidden"
                />
              </label>

              {photoUrl && (
                <button
                  onClick={handleRetirerPhoto}
                  disabled={enChargement}
                  className="text-sm text-gray-500 underline hover:text-gray-700 transition"
                >
                  Remettre l'avatar par défaut
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============ ONGLET MOT DE PASSE ============ */}
        {onglet === 'motdepasse' && (
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-sister-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Changer mon mot de passe</h2>
            <p className="text-sm text-gray-500 mb-6">Pour ta sécurité, on te demande l'ancien</p>

            <div className="space-y-5 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mot de passe actuel *</label>
                <input
                  type="password"
                  value={ancienMdp}
                  onChange={(e) => setAncienMdp(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nouveau mot de passe *</label>
                <input
                  type="password"
                  value={nouveauMdp}
                  onChange={(e) => setNouveauMdp(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
                />
                <p className="text-xs text-gray-400 mt-1">Min 8 caractères, maj/min/chiffre/spécial</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Confirmer le nouveau mot de passe *</label>
                <input
                  type="password"
                  value={confirmMdp}
                  onChange={(e) => setConfirmMdp(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-sister-50 border border-transparent rounded-xl focus:outline-none focus:border-sister-300 focus:bg-white transition"
                />
              </div>

              <button
                onClick={handleChangerMdp}
                disabled={enChargement}
                className="flex items-center gap-2 bg-gradient-to-r from-sister-400 to-sister-500 hover:from-sister-500 hover:to-sister-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-sister-300/50 disabled:opacity-50 transition"
              >
                <Lock className="w-4 h-4" strokeWidth={2} />
                <span>{enChargement ? 'Modification...' : 'Changer mon mot de passe'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ============ ONGLET SUPPRESSION ============ */}
        {onglet === 'suppression' && (
          <div className="bg-white rounded-3xl shadow-sm p-8 border-2 border-red-200">
            <h2 className="text-xl font-bold text-red-600 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" strokeWidth={2} />
              Supprimer mon compte
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Cette action est <strong>irréversible</strong>. Tous tes posts, commentaires et messages seront supprimés.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-red-700">
                💔 On est tristes de te voir partir. Si tu as un problème, n'hésite pas à nous contacter avant !
              </p>
            </div>

            <div className="space-y-5 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Confirme avec ton mot de passe *
                </label>
                <input
                  type="password"
                  value={mdpSuppression}
                  onChange={(e) => setMdpSuppression(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-xl focus:outline-none focus:border-red-400 focus:bg-white transition"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmationSuppression}
                  onChange={(e) => setConfirmationSuppression(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-red-500 focus:ring-red-400"
                />
                <span className="text-sm text-gray-700">
                  Je comprends que cette action est irréversible et supprimera définitivement mon compte et toutes mes données (droit à l'oubli RGPD).
                </span>
              </label>

              <button
                onClick={handleSupprimerCompte}
                disabled={enChargement || !confirmationSuppression}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-red-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
                <span>{enChargement ? 'Suppression...' : 'Supprimer définitivement mon compte'}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}