/**
 * cloudinary.ts
 * Utilities for transforming Cloudinary URLs before they hit the UI.
 *
 * Transformation applied to profile avatars:
 *   c_fill,g_face,w_300,h_300   — fill a 300×300 square centred on the face
 *                                  (less aggressive than c_crop — shows more context)
 *   z_0.75                       — zoom out 25% so head + shoulders are visible
 *   r_max                        — circular mask
 *   co_rgb:3b82f6,e_outline:outer:3  — thin primary-blue outline
 *   f_auto,q_auto                — best format/quality automatically
 */

const AVATAR_TRANSFORMS =
  "c_fill,g_face,w_300,h_300,z_0.75/r_max/co_rgb:3b82f6,e_outline:outer:3/f_auto,q_auto";

/**
 * Takes a raw Cloudinary secure_url and injects the avatar transformation chain.
 * Returns the original URL unchanged if it is not a Cloudinary URL.
 */
export function getAvatarUrl(rawUrl: string | undefined | null): string | null {
  if (!rawUrl) return null;

  // Only transform Cloudinary URLs
  if (!rawUrl.includes("res.cloudinary.com")) return rawUrl;

  // Insert transforms after /upload/
  // e.g. https://res.cloudinary.com/<cloud>/image/upload/<transforms>/<public_id>
  return rawUrl.replace("/upload/", `/upload/${AVATAR_TRANSFORMS}/`);
}
