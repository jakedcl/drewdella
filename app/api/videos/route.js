import { readStoredVideos } from "../../../lib/youtubeVideos.js";

const CDN_S_MAXAGE = 60 * 60 * 6;
const CDN_SWR = 60 * 60 * 24;

/**
 * Public read of the Sanity snapshot only.
 * YouTube fetch + writes stay on /api/videos-sync (cron + CRON_SECRET).
 */
export async function GET() {
  try {
    const stored = await readStoredVideos();
    return Response.json(
      { videos: stored.videos },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CDN_S_MAXAGE}, stale-while-revalidate=${CDN_SWR}`,
          "X-Cache": stored.videos.length > 0 ? "SANITY" : "EMPTY",
        },
      }
    );
  } catch (error) {
    console.error("Videos API error:", error);
    return Response.json({ error: "Failed to load videos" }, { status: 500 });
  }
}
