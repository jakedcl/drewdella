let cached = null;
let pending = null;

function snippetAround(text, query, max = 90) {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  if (!raw) return "";
  const q = query.toLowerCase();
  const lower = raw.toLowerCase();
  const at = lower.indexOf(q);
  if (at === -1) {
    return raw.length <= max ? raw : `${raw.slice(0, max).replace(/\s+\S*$/, "")} …`;
  }
  const start = Math.max(0, at - 24);
  const chunk = raw.slice(start, start + max);
  const prefix = start > 0 ? "… " : "";
  const suffix = start + max < raw.length ? " …" : "";
  return `${prefix}${chunk.trim()}${suffix}`;
}

export function toSearchDoc({ id, title, href, source, internal, haystack, snippet }) {
  return {
    id,
    title,
    href,
    source,
    internal,
    haystack: `${title} ${haystack || ""}`.toLowerCase(),
    snippet: snippet || "",
  };
}

/**
 * Loads the header search index from our own route, not the Sanity API.
 * The browser keeps one copy for the tab; the route itself revalidates hourly.
 */
export async function getSearchIndex() {
  if (cached) return cached;
  if (!pending) {
    pending = fetch("/api/search")
      .then(async (res) => {
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      })
      .then((docs) => {
        if (docs.length) cached = docs;
        return docs;
      })
      .catch(() => [])
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

function scoreDoc(item, query) {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const title = item.title.toLowerCase();
  const hay = item.haystack;
  let score = 0;

  if (title === q) score += 120;
  else if (title.startsWith(q)) score += 80;
  else if (title.includes(q)) score += 50;

  if (hay.includes(q)) score += 18;
  if (item.id === "page-images" && hay.includes(q)) score += 40;

  for (const word of q.split(/\s+/).filter(Boolean)) {
    if (title.includes(word)) score += 10;
    else if (hay.includes(word)) score += 4;
  }

  return score;
}

export function searchSite(index, query, limit = 8) {
  const q = query.trim();
  if (!q || !index?.length) return [];

  return index
    .map((item) => ({
      ...item,
      score: scoreDoc(item, q),
      snippet: snippetAround(item.snippet || item.haystack, q),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}
