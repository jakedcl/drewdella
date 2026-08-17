import {
  fetchChannelVideos,
  readStoredVideos,
  storeVideos,
} from "../lib/youtubeVideos.js";

const CDN_S_MAXAGE = 60 * 60 * 6;
const CDN_SWR = 60 * 60 * 24;

function setCacheHeaders(res) {
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${CDN_S_MAXAGE}, stale-while-revalidate=${CDN_SWR}`
  );
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const stored = await readStoredVideos();
    if (stored.videos.length > 0) {
      setCacheHeaders(res);
      res.setHeader("X-Cache", "SANITY");
      return res.status(200).json({ videos: stored.videos });
    }

    const videos = await fetchChannelVideos();
    try {
      await storeVideos(videos);
    } catch (error) {
      console.error("Could not persist YouTube snapshot:", error);
    }

    setCacheHeaders(res);
    res.setHeader("X-Cache", "YOUTUBE");
    return res.status(200).json({ videos });
  } catch (error) {
    console.error("Detailed API Error:", error);
    return res.status(500).json({ error: "Failed to load videos" });
  }
}
