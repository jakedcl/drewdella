import { safeHref } from "./safeHref.js";

/** Resolve where Store / Shopping should send people. */

export const DEFAULT_SHOP_PATH = "/shop";

function isOwnShopUrl(url) {
  if (!url) return true;
  const raw = String(url).trim();
  if (raw === "/shop" || raw.startsWith("/shop?")) return true;
  try {
    const parsed = new URL(raw, "https://drewdella.com");
    const host = parsed.hostname.replace(/^www\./, "");
    return host === "drewdella.com" && parsed.pathname.replace(/\/$/, "") === "/shop";
  } catch {
    return false;
  }
}

/**
 * @returns {{ href: string, external: boolean }}
 * Same-origin /shop → SPA path. External only if http(s).
 */
export function resolveShopDestination(sanityUrl) {
  if (!sanityUrl || isOwnShopUrl(sanityUrl)) {
    return { href: DEFAULT_SHOP_PATH, external: false };
  }
  const href = safeHref(sanityUrl);
  if (!href || href.startsWith("/")) {
    return { href: DEFAULT_SHOP_PATH, external: false };
  }
  return { href, external: true };
}
