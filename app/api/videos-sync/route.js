import {
  fetchChannelVideos,
  readStoredVideos,
  storeVideos,
  videoIdsKey,
} from "../../../lib/youtubeVideos.js";

function isCronAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.VERCEL_ENV !== "production";
  const header = request.headers.get("authorization") || "";
  return header === `Bearer ${secret}`;
}

export async function GET(request) {
  if (!isCronAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const videos = await fetchChannelVideos();
    const stored = await readStoredVideos();
    const unchanged = videoIdsKey(videos) === videoIdsKey(stored.videos);

    if (unchanged && stored.videos.length > 0) {
      return Response.json({
        updated: false,
        count: stored.videos.length,
        syncedAt: stored.syncedAt,
      });
    }

    const syncedAt = await storeVideos(videos);
    return Response.json({
      updated: true,
      count: videos.length,
      syncedAt,
    });
  } catch (error) {
    console.error("Video sync error:", error);
    return Response.json({ error: "Failed to sync videos" }, { status: 500 });
  }
}
