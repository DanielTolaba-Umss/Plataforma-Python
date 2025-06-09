/**
 * Convierte cualquier URL válida de YouTube al formato embed.
 * Soporta: watch?v=, youtu.be/, shorts/, y ya embebidas.
 *
 * @param {string} youtubeUrl - La URL original del video de YouTube.
 * @returns {string|null} - URL embebida o null si no se pudo convertir.
 */

export function convertToEmbedUrl(youtubeUrl) {
  try {
    const url = new URL(youtubeUrl);
    let videoId = null;

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") {
        // https://www.youtube.com/watch?v=VIDEO_ID
        videoId = url.searchParams.get("v");
      } else if (url.pathname.startsWith("/embed/")) {
        // https://www.youtube.com/embed/VIDEO_ID (ya es embed)
        return youtubeUrl;
      } else if (url.pathname.startsWith("/shorts/")) {
        // https://www.youtube.com/shorts/VIDEO_ID
        videoId = url.pathname.split("/")[2];
      }
    } else if (url.hostname === "youtu.be") {
      // https://youtu.be/VIDEO_ID
      videoId = url.pathname.slice(1);
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return null;
  } catch (error) {
    console.error("Error en la conversion del video: ", error);
  }
}
