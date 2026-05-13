// ============================================================================
// SISTER SPACE — Page Admin (réservée aux ADMIN)
// ============================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as adminService from '../services/adminService';
import * as authService from '../services/authService';
import type { UtilisatriceAdmin } from '../services/adminService';
import BottomNav from '../components/BottomNav';
import Avatar from '../components/Avatar';

export default function AdminPage() {
  const navigate = useNavigate();
  const utilisatriceConnectee = authService.getUtilisatriceConnectee();

  const [onglet, setOnglet] = useState<'en_attente' | 'toutes'>('en_attente');
  const [inscriptions, setInscriptions] = useState<UtilisatriceAdmin[]>([]);
  const [toutes, setToutes] = useState<UtilisatriceAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionEnCours, setActionEnCours] = useState<number | null>(null);

  // Vérifier que l'utilisatrice est ADMIN
  useEffect(() => {
    if (utilisatriceConnectee && utilisatriceConnectee.role !== 'ADMIN') {
      navigate('/feed');
      return;
    }
    charger();
  }, [onglet]);

  const charger = async () => {
    setLoading(true);
    try {
      if (onglet === 'en_attente') {
        const data = await adminService.getInscriptionsEnAttente();
        setInscriptions(data);
      } else {
        const data = await adminService.getToutesUtilisatrices();
        setToutes(data);
      }
    } catch (err) {
      console.error('Erreur chargement admin :', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValider = async (id: number, prenom: string) => {
    if (!confirm(`Valider le compte de ${prenom} ?`)) return;
    setActionEnCours(id);
    try {
      await adminService.validerCompte(id);
      alert(`✅ Compte de ${prenom} validé !`);
      charger();
    } catch (err) {
      alert('Erreur lors de la validation');
    } finally {
      setActionEnCours(null);
    }
  };

  const handleRefuser = async (id: number, prenom: string) => {
    const motif = prompt(`Motif du refus pour ${prenom} :`);
    if (!motif) return;
    setActionEnCours(id);
    try {
      await adminService.refuserCompte(id, motif);
      alert(`Compte de ${prenom} refusé.`);
      charger();
    } catch (err) {
      alert('Erreur lors du refus');
    } finally {
      setActionEnCours(null);
    }
  };

  const formaterDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCouleurStatut = (statut: string) => {
    switch (statut) {
      case 'ACTIF': return 'bg-green-100 text-green-700';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-700';
      case 'REFUSE': return 'bg-red-100 text-red-700';
      case 'BANNI': return 'bg-gray-200 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const liste = onglet === 'en_attente' ? inscriptions : toutes;

  return (
    <div className="min-h-screen pb-24">
      
      {/* Header */}
      <header className="bg-gradient-to-br from-sister-500 to-sister-600 text-white px-4 py-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">🌸 Gestion de la communauté</h1>
          <p className="text-sm opacity-90">Valider les inscriptions et veiller sur les sisters</p>
        </div>
      </header>

      {/* Onglets */}
      <div className="bg-white border-b border-pink-100 sticky top-[88px] z-10">
        <div className="max-w-3xl mx-auto px-4 flex gap-1">
          <button
            onClick={() => setOnglet('en_attente')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              onglet === 'en_attente'
                ? 'border-sister-500 text-sister-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🟡 En attente ({inscriptions.length})
          </button>
          <button
            onClick={() => setOnglet('toutes')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              onglet === 'toutes'
                ? 'border-sister-500 text-sister-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            👥 Toutes ({toutes.length})
          </button>
        </div>
      </div>

      {/* Liste */}
      <main className="max-w-3xl mx-auto px-4 pt-4">
        {loading && (
          <div className="text-center text-gray-400 py-12">Chargement... 🌸</div>
        )}

        {!loading && liste.length === 0 && (
          <div className="bg-pink-50 rounded-2xl p-8 text-center text-gray-500 mt-4">
            <div className="text-4xl mb-3">✨</div>
            <p>
              {onglet === 'en_attente'
                ? 'Aucune inscription en attente'
                : 'Aucune utilisatrice'}
            </p>
          </div>
        )}

        {!loading && liste.map((u) => (
          <div key={u.id} className="bg-white rounded-2xl shadow-sm p-4 mb-3 border border-pink-100">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <Avatar prenom={u.prenom} taille="lg" />

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <div className="font-semibold text-gray-800">{u.prenom}</div>
                  <div className="text-xs text-sister-500">{u.pseudo}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getCouleurStatut(u.statut)}`}>
                    {u.statut}
                  </span>
                  {u.role === 'ADMIN' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      👮 ADMIN
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">{u.email}</div>
                {u.bio && (
                  <div className="text-sm text-gray-600 mt-2 italic line-clamp-2">"{u.bio}"</div>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  Inscrite le {formaterDate(u.date_creation)}
                </div>
                {u.motif_refus && (
                  <div className="text-xs text-red-600 mt-1 bg-red-50 rounded p-2">
                    ❌ Motif refus : {u.motif_refus}
                  </div>
                )}
              </div>
            </div>

            {/* Actions (uniquement pour les EN_ATTENTE) */}
            {u.statut === 'EN_ATTENTE' && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-pink-50">
                <button
                  onClick={() => handleValider(u.id, u.prenom)}
                  disabled={actionEnCours === u.id}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-full font-medium transition disabled:opacity-50"
                >
                  ✅ Valider
                </button>
                <button
                  onClick={() => handleRefuser(u.id, u.prenom)}
                  disabled={actionEnCours === u.id}
                  className="flex-1 bg-red-400 hover:bg-red-500 text-white py-2 rounded-full font-medium transition disabled:opacity-50"
                >
                  ❌ Refuser
                </button>
              </div>
            )}
          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}