// Per-image next/image loader for Sanity URLs. Applied on SanityImage (and
// similar) only — Sanity's CDN resizes for free; local /public assets keep
// Vercel's default image optimization.
export default function sanityImageLoader({ src, width, quality }) {
  if (!src.startsWith("https://cdn.sanity.io/")) {
    // Local files in /public are served as-is.
    return src;
  }
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality || url.searchParams.get("q") || 75));
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
  if (!url.searchParams.has("auto")) url.searchParams.set("auto", "format");
  return url.toString();
}
