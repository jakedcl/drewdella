import HomePage from "@/views/HomePage/HomePage.jsx";
import { getLuckyPaths, getShopDestination } from "@/lib/content";
import { pageMetadataAsync } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return pageMetadataAsync({
    title: "Drew Della",
    absoluteTitle: true,
    description:
      "Drew Della — artist, musician, creator. Music, lyrics, videos, blog posts, and live shows.",
    path: "/home",
  });
}

export default async function Page() {
  const [luckyPaths, shop] = await Promise.all([
    getLuckyPaths().catch(() => []),
    getShopDestination().catch(() => undefined),
  ]);
  return <HomePage luckyPaths={luckyPaths} shop={shop} />;
}
