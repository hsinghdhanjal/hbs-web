// Shared upload constraints for the Site Images CMS. Pure constants/helpers
// only (no server-only imports) so this can be imported from both client
// components (ImageUploader) and server code (actions/lib).

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_BYTES = 20 * 1024 * 1024; // 20 MB — keep hero clips short + compressed

// Slots that may hold a background video instead of a still image. Extend
// this list to open video uploads up to other slots later — no migration
// needed, it's just a code-level allowlist.
const VIDEO_CAPABLE_SLOTS = new Set(["hero-image"]);

export function slotAllowsVideo(slotKey) {
  return VIDEO_CAPABLE_SLOTS.has(slotKey);
}

export function maxBytesForSlot(slotKey) {
  return slotAllowsVideo(slotKey) ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
}

export function acceptForSlot(slotKey) {
  return slotAllowsVideo(slotKey) ? "image/*,video/mp4" : "image/*";
}

export function isVideoMime(mime) {
  return typeof mime === "string" && mime.startsWith("video/");
}

export function isAllowedUpload(file, slotKey) {
  if (file.type.startsWith("image/")) return true;
  return slotAllowsVideo(slotKey) && file.type === "video/mp4";
}

export function formatMB(bytes) {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}
