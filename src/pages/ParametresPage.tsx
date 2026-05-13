// ============================================================================
// SISTER SPACE — Page Paramètres
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import * as utilisatriceService from '../services/utilisatriceService';
import * as uploadService from '../services/uploadService';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';

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

  // ----------------------------------------------------------------------------
  // Reset des messages quand on change d'onglet
  // ----------------------------------------------------------------------------
  const changerOnglet = (nouvelOnglet: Onglet) => {
    setOnglet(nouvelOnglet);
    setMessageSucces('');
    setMessageErreur('');
  };

  // ----------------------------------------------------------------------------
  // Enregistrer les infos
  // ----------------------------------------------------------------------------
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

      // Mettre à jour les infos dans le storage local
      authService.mettreAJourUtilisatriceConnectee(utilisatriceModifiee);

      setMessageSucces('Tes infos ont été mises à jour ! 🌸');
    } catch (err: any) {
      setMessageErreur(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setEnChargement(false);
    }
  };

  // ----------------------------------------------------------------------------
  // Changer la photo
  // ----------------------------------------------------------------------------
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
      setMessageErreur(err.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploadEnCours(false);
    }
  };

  // ----------------------------------------------------------------------------
  // Remettre l'avatar DiceBear (supprime la photo)
  // ----------------------------------------------------------------------------
  const handleRetirerPhoto = async () => {
    if (!confirm('Remettre l\'avatar par défaut ?')) return;

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

  // ----------------------------------------------------------------------------
  // Changer le mot de passe
  // ----------------------------------------------------------------------------
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
      setMessageErreur('Le nouveau mot de passe doit être différent de l\'ancien');
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

  // ----------------------------------------------------------------------------
  // Supprimer le compte
  // ----------------------------------------------------------------------------
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

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-pink-50 to-white">
      
      {/* Header */}
      <header className="bg-gradient-to-br from-sister-500 to-sister-600 text-white px-4 py-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">⚙️ Paramètres</h1>
          <p className="text-sm opacity-90">Gère ton compte Sister Space 🌸</p>
        </div>
      </header>

      {/* Onglets */}
      <div className="bg-white border-b border-pink-100 sticky top-[88px] z-10 overflow-x-auto">
        <div className="max-w-3xl mx-auto px-4 flex gap-1 min-w-max">
          <button
            onClick={() => changerOnglet('infos')}
            className={`px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              onglet === 'infos' ? 'border-sister-500 text-sister-600' : 'border-transparent text-gray-500'
            }`}
          >
            👤 Mes infos
          </button>
          <button
            onClick={() => changerOnglet('photo')}
            className={`px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              onglet === 'photo' ? 'border-sister-500 text-sister-600' : 'border-transparent text-gray-500'
            }`}
          >
            📷 Ma photo
          </button>
          <button
            onClick={() => changerOnglet('motdepasse')}
            className={`px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              onglet === 'motdepasse' ? 'border-sister-500 text-sister-600' : 'border-transparent text-gray-500'
            }`}
          >
            🔒 Mot de passe
          </button>
          <button
            onClick={() => changerOnglet('suppression')}
            className={`px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              onglet === 'suppression' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500'
            }`}
          >
            ⚠️ Supprimer
          </button>
        </div>
      </div>

      {/* Contenu */}
      <main className="max-w-3xl mx-auto px-4 pt-6">

        {/* Messages */}
        {messageSucces && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            ✅ {messageSucces}
          </div>
        )}
        {messageErreur && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            ❌ {messageErreur}
          </div>
        )}

        {/* ============ ONGLET INFOS ============ */}
        {onglet === 'infos' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-pink-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">👤 Mes informations</h2>
            <p className="text-sm text-gray-500 mb-5">Modifie ton prénom, pseudo et bio</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={utilisatrice.email}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pseudo *</label>
                <input
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio <span className="text-gray-400 text-xs">({bio.length}/300)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={300}
                  className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-300 resize-none"
                  placeholder="Parle un peu de toi..."
                />
              </div>

              <button
                onClick={handleEnregistrerInfos}
                disabled={enChargement}
                className="w-full bg-gradient-to-r from-sister-500 to-sister-600 text-white py-3 rounded-full font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {enChargement ? 'Enregistrement...' : '💾 Enregistrer les modifications'}
              </button>
            </div>
          </div>
        )}

        {/* ============ ONGLET PHOTO ============ */}
        {onglet === 'photo' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-pink-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">📷 Ma photo de profil</h2>
            <p className="text-sm text-gray-500 mb-5">Personnalise ton avatar</p>

            <div className="flex flex-col items-center gap-4">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-100"
                />
              ) : (
                <Avatar prenom={utilisatrice.prenom} taille="xl" />
              )}

              <label className="cursor-pointer bg-gradient-to-r from-sister-500 to-sister-600 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition">
                {uploadEnCours ? 'Upload en cours...' : '📷 Choisir une photo'}
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
                  className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                  Remettre l'avatar par défaut
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============ ONGLET MOT DE PASSE ============ */}
        {onglet === 'motdepasse' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-pink-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">🔒 Changer mon mot de passe</h2>
            <p className="text-sm text-gray-500 mb-5">Pour ta sécurité, on te demande l'ancien</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel *</label>
                <input
                  type="password"
                  value={ancienMdp}
                  onChange={(e) => setAncienMdp(e.target.value)}
                  className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe *</label>
                <input
                  type="password"
                  value={nouveauMdp}
                  onChange={(e) => setNouveauMdp(e.target.value)}
                  className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-300"
                />
                <p className="text-xs text-gray-400 mt-1">Min 8 caractères, maj/min/chiffre/spécial</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe *</label>
                <input
                  type="password"
                  value={confirmMdp}
                  onChange={(e) => setConfirmMdp(e.target.value)}
                  className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sister-300"
                />
              </div>

              <button
                onClick={handleChangerMdp}
                disabled={enChargement}
                className="w-full bg-gradient-to-r from-sister-500 to-sister-600 text-white py-3 rounded-full font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {enChargement ? 'Modification...' : '🔒 Changer mon mot de passe'}
              </button>
            </div>
          </div>
        )}

        {/* ============ ONGLET SUPPRESSION ============ */}
        {onglet === 'suppression' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-1">⚠️ Supprimer mon compte</h2>
            <p className="text-sm text-gray-500 mb-5">
              Cette action est <strong>irréversible</strong>. Tous tes posts, commentaires et messages seront supprimés.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
              <p className="text-sm text-red-700">
                💔 On est tristes de te voir partir. Si tu as un problème, n'hésite pas à nous contacter avant !
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirme avec ton mot de passe *
                </label>
                <input
                  type="password"
                  value={mdpSuppression}
                  onChange={(e) => setMdpSuppression(e.target.value)}
                  className="w-full px-3 py-2 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmationSuppression}
                  onChange={(e) => setConfirmationSuppression(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  Je comprends que cette action est irréversible et supprimera définitivement mon compte et toutes mes données (droit à l'oubli RGPD).
                </span>
              </label>

              <button
                onClick={handleSupprimerCompte}
                disabled={enChargement || !confirmationSuppression}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-medium transition disabled:opacity-50"
              >
                {enChargement ? 'Suppression...' : '🗑️ Supprimer définitivement mon compte'}
              </button>
            </div>
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  );
}