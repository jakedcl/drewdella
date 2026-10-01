import VideosPage from "@/views/VideosPage/VideosPage.jsx";
import { readStoredVideos } from "../../../lib/youtubeVideos.js";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Videos",
  description: "Videos by Drew Della.",
  path: "/videos",
});

export default async function Page() {
  try {
    const started = Date.now();
    const stored = await readStoredVideos();
    const elapsed = Math.max((Date.now() - started) / 1000, 0.04).toFixed(2);
    return (
      <VideosPage initialVideos={stored.videos || []} initialElapsed={elapsed} />
    );
  } catch (error) {
    console.error("Videos page error:", error);
    return <VideosPage />;
  }
}
