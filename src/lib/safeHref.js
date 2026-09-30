/**
 * Only allow http(s) URLs or same-site relative paths.
 * Blocks javascript:, data:, //evil.com, etc.
 *
 * @param {unknown} raw
 * @returns {string | null}
 */
export function safeHref(raw) {
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;

  // Same-site path only (not protocol-relative //host)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.href;
    }
  } catch {
    /* invalid */
  }

  return null;
}
