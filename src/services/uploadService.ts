// ============================================================================
// SISTER SPACE — Service d'upload d'images vers Cloudinary
// ============================================================================

// ⚠️ REMPLACE ces valeurs par les tiennes !
const CLOUD_NAME = 'dlqr1ku21';      // Ex: 'dxxxxx12345'
const UPLOAD_PRESET = 'sister_space_unsigned'; // Le preset qu'on a créé

/**
 * Upload une image vers Cloudinary et retourne son URL publique
 */
export const uploadImage = async (file: File): Promise<string> => {
  // Vérification : taille max 5 Mo
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('IMAGE_TROP_LOURDE');
  }

  // Vérification : type d'image
  if (!file.type.startsWith('image/')) {
    throw new Error('FICHIER_NON_IMAGE');
  }

  // Préparer le FormData (format requis par Cloudinary)
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  // Envoyer à Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('UPLOAD_ECHEC');
  }

  const data = await response.json();
  return data.secure_url; // L'URL HTTPS publique de l'image
};