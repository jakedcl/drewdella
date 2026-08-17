import {
  fetchChannelVideos,
  readStoredVideos,
  storeVideos,
  videoIdsKey,
} from "../lib/youtubeVideos.js";

function isCronAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.VERCEL_ENV !== "production";
  const header = req.headers.authorization || "";
  return header === `Bearer ${secret}`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isCronAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const videos = await fetchChannelVideos();
    const stored = await readStoredVideos();
    const unchanged = videoIdsKey(videos) === videoIdsKey(stored.videos);

    if (unchanged && stored.videos.length > 0) {
      return res.status(200).json({
        updated: false,
        count: stored.videos.length,
        syncedAt: stored.syncedAt,
      });
    }

    const syncedAt = await storeVideos(videos);
    return res.status(200).json({
      updated: true,
      count: videos.length,
      syncedAt,
    });
  } catch (error) {
    console.error("Video sync error:", error);
    return res.status(500).json({ error: "Failed to sync videos" });
  }
}
