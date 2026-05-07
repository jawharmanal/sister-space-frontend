// ============================================================================
// SISTER SPACE — Toast de notification
// ============================================================================

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duree?: number; // en millisecondes
}

export default function Toast({ message, visible, onClose, duree = 4000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;

    // Fermer automatiquement après "duree" ms
    const timer = setTimeout(onClose, duree);
    return () => clearTimeout(timer);
  }, [visible, duree, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-pink-200 p-4 flex items-center gap-3 min-w-[280px] max-w-md">
        {/* Icône */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sister-400 to-sister-600 flex items-center justify-center text-white text-xl flex-shrink-0">
          💬
        </div>
        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800">Sister Space</div>
          <div className="text-sm text-gray-600 truncate">{message}</div>
        </div>
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg flex-shrink-0"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}