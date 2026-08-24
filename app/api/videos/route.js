import {
  fetchChannelVideos,
  readStoredVideos,
  storeVideos,
} from "../../../lib/youtubeVideos.js";

const CDN_S_MAXAGE = 60 * 60 * 6;
const CDN_SWR = 60 * 60 * 24;

export async function GET() {
  try {
    const stored = await readStoredVideos();
    if (stored.videos.length > 0) {
      return Response.json(
        { videos: stored.videos },
        {
          headers: {
            "Cache-Control": `public, s-maxage=${CDN_S_MAXAGE}, stale-while-revalidate=${CDN_SWR}`,
            "X-Cache": "SANITY",
          },
        }
      );
    }

    const videos = await fetchChannelVideos();
    try {
      await storeVideos(videos);
    } catch (error) {
      console.error("Could not persist YouTube snapshot:", error);
    }

    return Response.json(
      { videos },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CDN_S_MAXAGE}, stale-while-revalidate=${CDN_SWR}`,
          "X-Cache": "YOUTUBE",
        },
      }
    );
  } catch (error) {
    console.error("Detailed API Error:", error);
    return Response.json({ error: "Failed to load videos" }, { status: 500 });
  }
}
