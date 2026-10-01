import AllPage from "@/views/AllPage/AllPage.jsx";
import { getAllFeed } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Drew Della",
  absoluteTitle: true,
  description:
    "Drew Della — artist, musician, creator. Music, lyrics, videos, blog posts, photos, and live shows.",
  path: "/",
});

export default async function Page() {
  const feed = await getAllFeed().catch((error) => {
    console.error("All results error:", error);
    return null;
  });
  return <AllPage feed={feed} />;
}
