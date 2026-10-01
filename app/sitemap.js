import { getSitemapEntries } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

const STATIC_PATHS = [
  "/",
  "/home",
  "/music",
  "/images",
  "/videos",
  "/blog",
  "/connect",
  "/lyrics",
  "/shop",
  "/maps",
];

export default async function sitemap() {
  const now = new Date();
  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/music" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  let posts = [];
  let songs = [];
  let releases = [];
  try {
    const data = await getSitemapEntries();
    posts = data.posts;
    songs = data.songs;
    releases = data.releases;
  } catch (error) {
    console.error("Sitemap content error:", error);
  }

  return [
    ...staticEntries,
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...songs.map((song) => ({
      url: `${SITE_URL}/lyrics/${song.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    })),
    ...releases
      .filter((release) => release.slug)
      .map((release) => ({
        url: `${SITE_URL}${release.href}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      })),
  ];
}
