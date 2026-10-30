import { cache } from "react";
import { client, sanityImage } from "./sanity";
import { resolveShopDestination } from "./shopLink";
import { albumKey, slugify } from "./slug";

export { albumKey, slugify };

export const REVALIDATE_SECONDS = 3600;

export function releaseSlug(release) {
  return release?.slug || slugify(release?.title) || "";
}

export function releaseYear(release) {
  if (release?.year) return String(release.year);
  const raw = release?.date ? String(release.date) : "";
  const match = raw.match(/^(\d{4})/);
  return match ? match[1] : "";
}

function coverOf(release) {
  if (!release?.cover?.asset) return "";
  return sanityImage(release.cover, { width: 800, quality: 75 });
}

function lyricSlug(title, songs, albumTitles) {
  const keys = new Set((albumTitles || []).map((name) => albumKey(name)).filter(Boolean));
  const want = albumKey(title);
  if (!want || !keys.size) return "";
  const song = (songs || []).find(
    (item) =>
      item?.slug &&
      keys.has(albumKey(item.album)) &&
      albumKey(item.title) === want
  );
  return song?.slug || "";
}

function withLyricLinks(tracks, songs, albumTitles) {
  return (tracks || []).map((track) => ({
    title: track.title,
    duration: track.duration || "",
    slug: track.slug || lyricSlug(track.title, songs, albumTitles),
  }));
}

export function shapeRelease(release, songs = []) {
  const slug = releaseSlug(release);
  const key = albumKey(release?.title);
  const matched = (songs || [])
    .filter((song) => albumKey(song.album) === key)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((song) => ({
      title: song.title,
      slug: song.slug || "",
      duration: "",
    }));
  const authored = (release?.tracks || [])
    .filter((track) => track?.title)
    .map((track) => ({
      title: track.title,
      duration: track.duration || "",
      slug: "",
    }));
  const links = [];
  if (release?.url) links.push({ label: "Listen", url: release.url });
  for (const link of release?.links || []) {
    if (!link?.url) continue;
    if (links.some((item) => item.url === link.url)) continue;
    links.push({ label: link.label || "Listen", url: link.url });
  }
  const gallery = (release?.gallery || [])
    .filter((image) => image?.asset)
    .map((image) => ({
      alt: image.alt || release.title || "",
      caption: image.caption || "",
      src: sanityImage(image, { width: 1400, quality: 75 }),
      width: image.asset?.metadata?.dimensions?.width || 1200,
      height: image.asset?.metadata?.dimensions?.height || 1200,
    }))
    .filter((image) => image.src);

  return {
    id: release._id,
    title: release.title || "Untitled",
    description: String(release.description || "").trim(),
    subtitle: String(release.subtitle || "").trim(),
    story: String(release.story || "").trim(),
    url: release.url || "",
    date: release.date || "",
    year: releaseYear(release),
    order: release.order ?? 0,
    featured: Boolean(release.featured),
    slug,
    href: slug ? `/music/${slug}` : "/music",
    cover: coverOf(release),
    coverAlt: release?.cover?.alt || `${release.title || "Release"} cover`,
    tracks: withLyricLinks(
      authored.length ? authored : matched,
      songs,
      [release.title]
    ),
    trackSource: authored.length ? "release" : matched.length ? "lyrics" : "none",
    links,
    gallery,
  };
}

const RELEASE_FIELDS = `{
  _id,
  title,
  description,
  url,
  date,
  order,
  year,
  subtitle,
  story,
  featured,
  "slug": slug.current,
  cover { alt, asset->{_id, metadata{dimensions}} },
  links[]{ label, url },
  tracks[]{ title, duration },
  gallery[]{ alt, caption, asset->{_id, metadata{dimensions}} }
}`;

export const getSongs = cache(async () => {
  return client.fetch(
    `*[_type == "song"] | order(order asc) {
      _id, title, album, order, "slug": slug.current
    }`
  );
});

export const getReleases = cache(async () => {
  const [releases, songs] = await Promise.all([
    client
      .fetch(`*[_type == "musicRelease"] | order(order asc) ${RELEASE_FIELDS}`)
      .catch(() => []),
    getSongs().catch(() => []),
  ]);
  return (releases || [])
    .map((release) => shapeRelease(release, songs || []))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
});

export const getRelease = cache(async (slug) => {
  const releases = await getReleases();
  return releases.find((release) => release.slug === slug) || null;
});

export function featuredRelease(releases) {
  if (!releases?.length) return null;
  return releases.find((release) => release.featured) || releases[0];
}

export const getLuckyPaths = cache(async () => {
  const data = await client.fetch(`{
    "posts": *[_type == "blogPost" && defined(slug.current)].slug.current,
    "songs": *[_type == "song" && defined(slug.current)].slug.current,
    "images": *[_type == "imageGallery"][0].galleryImages[]._key,
    "releases": *[_type == "musicRelease"]{ title, "slug": slug.current }
  }`);
  const paths = [
    ...(data?.posts || []).map((slug) => `/blog/${slug}`),
    ...(data?.songs || []).map((slug) => `/lyrics/${slug}`),
    ...(data?.images || [])
      .filter(Boolean)
      .map((id) => `/images?img=${encodeURIComponent(id)}`),
    ...(data?.releases || []).map((release) => {
      const slug = release.slug || slugify(release.title);
      return slug ? `/music/${slug}` : "";
    }),
    "/maps",
  ];
  return [...new Set(paths.filter(Boolean))];
});

export const getBlogList = cache(async () => {
  return client.fetch(`*[_type == "blogPost"] | order(date desc) {
    _id, title, date, slug,
    "preview": pt::text(content),
    "imageCount": count(content[_type == "image"])
  }`);
});

export const getBlogPost = cache(async (slug) => {
  if (!slug) return null;
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      _id, title, date, slug,
      "preview": pt::text(content),
      content[]{
        ...,
        _type == "image" => { ..., asset-> },
        _type == "block" => {
          ...,
          markDefs[]{ ..., _type == "link" => { ... } }
        }
      }
    }`,
    { slug }
  );
});

export const getLyricsList = cache(async () => {
  return client.fetch(`*[_type == "song"] | order(albumOrder asc, album asc, order asc) {
    _id, title, album, albumOrder, order, slug,
    "preview": pt::text(lyrics),
    "date": *[_type == "musicRelease" && lower(title) == lower(^.album)][0].date
  }`);
});

export const getLyric = cache(async (slug) => {
  if (!slug) return null;
  return client.fetch(
    `*[_type == "song" && slug.current == $slug][0] {
      _id, title, album, slug,
      "preview": pt::text(lyrics),
      lyrics[]{
        ...,
        _type == "block" => {
          ...,
          markDefs[]{ ..., _type == "link" => { ... } }
        }
      }
    }`,
    { slug }
  );
});

export const getShopDestination = cache(async () => {
  const data = await client.fetch(`*[_type == "shopLink"][0]{ url }`);
  return resolveShopDestination(data?.url);
});

export const getSocials = cache(async () => {
  return client.fetch(`*[_type == "socialLink"] | order(order asc) {
    _id, title, url, description
  }`);
});

export const getContactEmail = cache(async () => {
  const email = await client.fetch(`*[_type == "contact" && defined(email)][0].email`);
  return String(email || "").trim();
});

/** Sanity asset reference for sitewide og:image (1200×630 crop applied in seo.js). */
export const getSiteShareImageAsset = cache(async () => {
  const data = await client.fetch(`{
    "custom": *[_type == "contact"][0].ogImage.asset->{ _id, metadata { dimensions }, alt },
    "cover": *[_type == "musicRelease" && featured == true][0].cover.asset->{ _id, metadata { dimensions }, alt },
    "coverAny": *[_type == "musicRelease"] | order(order asc)[0].cover.asset->{ _id, metadata { dimensions }, alt },
    "header": *[_type == "imageGallery"][0].galleryImages[0].asset->{ _id, metadata { dimensions }, alt }
  }`);
  return data?.custom || data?.cover || data?.coverAny || data?.header || null;
});

export const getBlogPostShareImageAsset = cache(async (slug) => {
  if (!slug) return null;
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0].content[_type == "image"][0].asset->{
      _id, metadata { dimensions }, alt
    }`,
    { slug }
  );
});

export const getReleaseShareImageAsset = cache(async (slug) => {
  if (!slug) return null;
  return client.fetch(
    `*[_type == "musicRelease" && slug.current == $slug][0].cover.asset->{
      _id, metadata { dimensions }, alt
    }`,
    { slug }
  );
});

export const getMapLocations = cache(async () => {
  return client.fetch(`*[_type == "mapLocation"] {
    _id, venueName, address, coordinates
  }`);
});

export const getGallery = cache(async () => {
  const started = Date.now();
  const data = await client.fetch(`*[_type == "imageGallery"][0] {
    title,
    galleryImages[] {
      asset->{
        _id,
        metadata { dimensions }
      },
      alt,
      caption,
      "id": _key
    }
  }`);
  const images = (data?.galleryImages || []).filter((img) => img && img.asset);
  const elapsed = Math.max((Date.now() - started) / 1000, 0.04).toFixed(2);
  return { images, elapsed };
});

export const getAllFeed = cache(async () => {
  const started = Date.now();
  const query = `{
    "releases": *[_type == "musicRelease"] | order(order asc)[0...1] {
      _id, title, description, url, date, year, subtitle, "slug": slug.current
    },
    "posts": *[_type == "blogPost"] | order(date desc)[0...3] {
      _id, title, date, slug, "preview": pt::text(content), "imageCount": count(content[_type == "image"])
    },
    "songs": *[_type == "song"] | order(albumOrder asc, order asc)[0...3] {
      _id, title, album, slug, "preview": pt::text(lyrics),
      "date": *[_type == "musicRelease" && lower(title) == lower(^.album)][0].date
    },
    "socials": *[_type == "socialLink"] | order(order asc)[0...3] {
      _id, title, url, description
    },
    "images": *[_type == "imageGallery"][0].galleryImages[0...6] {
      asset->{_id, metadata{dimensions}},
      alt,
      "id": _key
    }
  }`;
  const { readStoredVideos } = await import("../../lib/youtubeVideos.js");
  const [data, stored] = await Promise.all([
    client.fetch(query),
    readStoredVideos().catch(() => ({ videos: [] })),
  ]);
  const elapsed = Math.max((Date.now() - started) / 1000, 0.04).toFixed(2);
  const images = (data?.images || [])
    .filter((img) => img?.asset)
    .map((img) => ({
      id: img.id,
      alt: img.alt || "",
      src: sanityImage(img.asset, { width: 240, height: 180, quality: 70 }),
    }))
    .filter((img) => img.src);
  return {
    data: { ...(data || {}), images },
    latestVideo: stored.videos?.[0] || null,
    elapsed,
  };
});

export const getSitemapEntries = cache(async () => {
  const [posts, songs, releases] = await Promise.all([
    client.fetch(`*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current, date }`),
    client.fetch(`*[_type == "song" && defined(slug.current)]{ "slug": slug.current }`),
    getReleases().catch(() => []),
  ]);
  return { posts: posts || [], songs: songs || [], releases: releases || [] };
});
