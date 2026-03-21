// URL de base du serveur Laravel (pour les images stockées localement)
const BACKEND_URL = 'http://localhost:8000';

/**
 * Retourne l'URL complète d'une image d'événement.
 * - Si l'URL commence par /storage/ (image uploadée localement), elle est préfixée avec l'URL du backend Laravel.
 * - Si l'URL est une URL externe complète (http/https), elle est retournée telle quelle.
 * - Si aucune image n'est disponible, une image placeholder générique est retournée.
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    // Image placeholder par défaut si aucune image n'est définie
    return 'https://placehold.co/600x400/1a1a2e/7c3aed?text=QuickTicket';
  }
  if (imageUrl.startsWith('/storage/')) {
    // Image stockée localement sur le serveur Laravel
    return `${BACKEND_URL}${imageUrl}`;
  }
  // URL externe (ex: https://...)
  return imageUrl;
};
