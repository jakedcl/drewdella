import HomePage from "@/views/HomePage/HomePage.jsx";
import { getLuckyPaths, getShopDestination } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Drew Della",
  absoluteTitle: true,
  description:
    "Drew Della — artist, musician, creator. Music, lyrics, videos, blog posts, and live shows.",
  path: "/home",
});

export default async function Page() {
  const [luckyPaths, shop] = await Promise.all([
    getLuckyPaths().catch(() => []),
    getShopDestination().catch(() => undefined),
  ]);
  return <HomePage luckyPaths={luckyPaths} shop={shop} />;
}
