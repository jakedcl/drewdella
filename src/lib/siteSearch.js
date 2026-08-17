import axios from "axios";
import { client } from "./sanity";

const PAGES = [
  {
    id: "page-all",
    title: "Drew Della",
    href: "/",
    source: "All",
    internal: true,
    haystack: "official site home all music lyrics photos videos blog live shows",
  },
  {
    id: "page-home",
    title: "Drew Della homepage",
    href: "/home",
    source: "All",
    internal: true,
    haystack: "search homepage logo",
  },
  {
    id: "page-music",
    title: "Music",
    href: "/music",
    source: "Music",
    internal: true,
    haystack: "discography albums singles listen",
  },
  {
    id: "page-images",
    title: "Images",
    href: "/images",
    source: "Images",
    internal: true,
    haystack: "photos gallery pictures",
  },
  {
    id: "page-videos",
    title: "Videos",
    href: "/videos",
    source: "Videos",
    internal: true,
    haystack: "youtube clips",
  },
  {
    id: "page-blog",
    title: "Blog",
    href: "/blog",
    source: "Blog",
    internal: true,
    haystack: "posts writing journal",
  },
  {
    id: "page-connect",
    title: "Socials",
    href: "/connect",
    source: "Socials",
    internal: true,
    haystack: "instagram twitter follow connect",
  },
  {
    id: "page-lyrics",
    title: "Lyrics",
    href: "/lyrics",
    source: "Lyrics",
    internal: true,
    haystack: "songs words",
  },
  {
    id: "page-shop",
    title: "Shop",
    href: "/shop",
    source: "Shopping",
    internal: true,
    haystack: "merch store coming soon",
  },
  {
    id: "page-maps",
    title: "Live shows",
    href: "/maps",
    source: "Maps",
    internal: true,
    haystack: "venues map tour dates places hosted",
  },
];

let cached = null;
let pending = null;

function slugOf(item) {
  return item?.slug?.current || item?.slug || "";
}

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

function doc({ id, title, href, source, internal, haystack, snippet }) {
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

async function loadIndex() {
  const query = `{
    "releases": *[_type == "musicRelease"] {
      _id, title, description, url
    },
    "posts": *[_type == "blogPost"] {
      _id, title, slug, "body": pt::text(content)
    },
    "songs": *[_type == "song"] {
      _id, title, album, slug, "lyrics": pt::text(lyrics)
    },
    "socials": *[_type == "socialLink"] {
      _id, title, url, description
    },
    "venues": *[_type == "mapLocation"] {
      _id, venueName, address
    },
    "images": *[_type == "imageGallery"][0].galleryImages[] {
      alt, caption, "id": _key
    }
  }`;

  const [data, videosRes] = await Promise.all([
    client.fetch(query).catch(() => ({})),
    axios.get("/api/videos").catch(() => null),
  ]);

  const docs = [...PAGES];

  for (const item of data?.releases || []) {
    docs.push(
      doc({
        id: item._id,
        title: item.title,
        href: item.url,
        source: "Music",
        internal: false,
        haystack: item.description || "",
        snippet: item.description || "",
      })
    );
  }

  for (const item of data?.posts || []) {
    const slug = slugOf(item);
    if (!slug) continue;
    docs.push(
      doc({
        id: item._id,
        title: item.title,
        href: `/blog/${slug}`,
        source: "Blog",
        internal: true,
        haystack: item.body || "",
        snippet: item.body || "",
      })
    );
  }

  for (const item of data?.songs || []) {
    const slug = slugOf(item);
    if (!slug) continue;
    docs.push(
      doc({
        id: item._id,
        title: item.title,
        href: `/lyrics/${slug}`,
        source: "Lyrics",
        internal: true,
        haystack: `${item.album || ""} ${item.lyrics || ""}`,
        snippet: item.album ? `Lyrics from ${item.album}` : "Single",
      })
    );
  }

  for (const item of data?.socials || []) {
    docs.push(
      doc({
        id: item._id,
        title: item.title,
        href: item.url,
        source: "Socials",
        internal: false,
        haystack: item.description || "",
        snippet: item.description || "",
      })
    );
  }

  for (const item of data?.venues || []) {
    docs.push(
      doc({
        id: item._id,
        title: item.venueName,
        href: "/maps",
        source: "Maps",
        internal: true,
        haystack: item.address || "",
        snippet: item.address || "Live show venue",
      })
    );
  }

  for (const item of data?.images || []) {
    const label = item.caption || item.alt;
    if (!label) continue;
    docs.push(
      doc({
        id: item.id || label,
        title: label,
        href: "/images",
        source: "Images",
        internal: true,
        haystack: `${item.caption || ""} ${item.alt || ""}`,
        snippet: "Photo",
      })
    );
  }

  for (const video of videosRes?.data?.videos || []) {
    docs.push(
      doc({
        id: video.id,
        title: video.title,
        href: `https://www.youtube.com/watch?v=${video.id}`,
        source: "Videos",
        internal: false,
        haystack: "",
        snippet: "YouTube",
      })
    );
  }

  return docs;
}

export async function getSearchIndex() {
  if (cached) return cached;
  if (!pending) {
    pending = loadIndex()
      .then((docs) => {
        cached = docs;
        return docs;
      })
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
