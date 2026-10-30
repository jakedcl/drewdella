import AllPage from "@/views/AllPage/AllPage.jsx";
import { getAllFeed } from "@/lib/content";
import { pageMetadataAsync } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return pageMetadataAsync({
    title: "All results",
    description:
      "Drew Della — artist, musician, creator. Music, lyrics, videos, blog posts, photos, and live shows.",
    path: "/",
  });
}

const EMPTY_FEED = {
  data: {
    releases: [],
    posts: [],
    songs: [],
    socials: [],
    images: [],
  },
  latestVideo: null,
  elapsed: "0.12",
};

export default async function Page() {
  const feed = await getAllFeed().catch((error) => {
    console.error("All results error:", error);
    return EMPTY_FEED;
  });
  return <AllPage feed={feed || EMPTY_FEED} />;
}
