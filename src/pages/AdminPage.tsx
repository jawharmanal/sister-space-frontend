// ============================================================================
// SISTER SPACE — Page Admin (réservée aux ADMIN)
// Vibe : Glossier / Pinterest pastel
// ============================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
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
      alert(`✨ Compte de ${prenom} validé !`);
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
      case 'ACTIF':       return 'bg-emerald-100 text-emerald-700';
      case 'EN_ATTENTE':  return 'bg-amber-100 text-amber-700';
      case 'REFUSE':      return 'bg-red-100 text-red-700';
      case 'BANNI':       return 'bg-gray-200 text-gray-700';
      default:            return 'bg-sister-100 text-sister-700';
    }
  };

  const liste = onglet === 'en_attente' ? inscriptions : toutes;

  return (
    <div className="min-h-screen pb-28">

      {/* Header */}
      <header className="bg-gradient-sister text-white px-5 py-7 sticky top-0 z-10 shadow-pink-md">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl mb-1">🌸 Gestion de la communauté</h1>
          <p className="text-sm text-white/90">Valider les inscriptions et veiller sur les sisters</p>
        </div>
      </header>

      {/* Onglets */}
      <div className="glass border-b border-sister-100/50 sticky top-[108px] z-10">
        <div className="max-w-3xl mx-auto px-5 flex gap-1">
          <button
            onClick={() => setOnglet('en_attente')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              onglet === 'en_attente'
                ? 'border-sister-500 text-sister-600'
                : 'border-transparent text-mauve-500 hover:text-cocoa-800'
            }`}
          >
            🟡 En attente ({inscriptions.length})
          </button>
          <button
            onClick={() => setOnglet('toutes')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              onglet === 'toutes'
                ? 'border-sister-500 text-sister-600'
                : 'border-transparent text-mauve-500 hover:text-cocoa-800'
            }`}
          >
            👥 Toutes ({toutes.length})
          </button>
        </div>
      </div>

      {/* Liste */}
      <main className="max-w-3xl mx-auto px-4 pt-4 animate-fade-in-up">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-sister-400 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-sister-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-sister-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <p className="text-mauve-400 text-sm">Chargement...</p>
          </div>
        )}

        {!loading && liste.length === 0 && (
          <div className="card-sister p-10 text-center mt-4">
            <div className="text-5xl mb-3">✨</div>
            <p className="font-serif text-lg text-cocoa-900">
              {onglet === 'en_attente'
                ? 'Aucune inscription en attente'
                : 'Aucune utilisatrice'}
            </p>
          </div>
        )}

        {!loading && liste.map((u) => (
          <div key={u.id} className="card-sister p-5 mb-3">
            <div className="flex items-start gap-3">
              <Avatar prenom={u.prenom} taille="lg" />

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <div className="font-semibold text-cocoa-900">{u.prenom}</div>
                  <div className="text-xs text-sister-600">{u.pseudo}</div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getCouleurStatut(u.statut)}`}>
                    {u.statut}
                  </span>
                  {u.role === 'ADMIN' && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sister-100 text-sister-700 font-medium">
                      🌸 ADMIN
                    </span>
                  )}
                </div>
                <div className="text-xs text-mauve-400 mt-1">{u.email}</div>
                {u.bio && (
                  <div className="text-sm text-cocoa-700 mt-2 italic line-clamp-2">"{u.bio}"</div>
                )}
                <div className="text-xs text-mauve-400 mt-2">
                  Inscrite le {formaterDate(u.date_creation)}
                </div>
                {u.motif_refus && (
                  <div className="text-xs text-red-600 mt-2 bg-red-50 border border-red-100 rounded-xl p-2">
                    ❌ Motif refus : {u.motif_refus}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {u.statut === 'EN_ATTENTE' && (
              <div className="flex gap-2 mt-4 pt-3 border-t border-sister-100/60">
                <button
                  onClick={() => handleValider(u.id, u.prenom)}
                  disabled={actionEnCours === u.id}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-full font-medium transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Check size={16} strokeWidth={2.5} />
                  Valider
                </button>
                <button
                  onClick={() => handleRefuser(u.id, u.prenom)}
                  disabled={actionEnCours === u.id}
                  className="flex-1 bg-white border border-red-300 text-red-500 hover:bg-red-50 py-2.5 rounded-full font-medium transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <X size={16} strokeWidth={2.5} />
                  Refuser
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