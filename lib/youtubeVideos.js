import { createClient } from "@sanity/client";

export const VIDEO_CACHE_ID = "youtubeCache";

const SANITY = {
  projectId: "qcu6o4bq",
  dataset: "production",
  apiVersion: "2024-01-01",
};

function snippetContainsHashtag(snippet) {
  const title = snippet?.title ?? "";
  const description = snippet?.description ?? "";
  return title.includes("#") || description.includes("#");
}

function pickThumbnailUrl(thumbnails) {
  const t = thumbnails?.high || thumbnails?.medium || thumbnails?.default;
  return t?.url ?? "";
}

export function publicVideoList(videos = []) {
  return videos.map((video) => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    publishedAt: video.publishedAt,
  }));
}

export function videoIdsKey(videos = []) {
  return publicVideoList(videos)
    .map((video) => video.id)
    .join(",");
}

export async function fetchChannelVideos() {
  const { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } = process.env;

  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    throw new Error("Missing YouTube configuration");
  }

  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("YouTube API error response:", errorText);
    throw new Error(`YouTube API error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.items) {
    throw new Error("Invalid YouTube API response format");
  }

  return data.items
    .filter(
      (item) => item.id?.videoId && !snippetContainsHashtag(item.snippet)
    )
    .slice(0, 12)
    .map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: pickThumbnailUrl(item.snippet.thumbnails),
      publishedAt: item.snippet.publishedAt,
    }));
}

export function readClient() {
  return createClient({ ...SANITY, useCdn: true });
}

export function writeClient() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) return null;
  return createClient({ ...SANITY, useCdn: false, token });
}

export async function readStoredVideos() {
  const doc = await readClient().fetch(
    `*[_id == $id][0]{ videos, syncedAt }`,
    { id: VIDEO_CACHE_ID }
  );
  const videos = publicVideoList(doc?.videos);
  return {
    videos,
    syncedAt: doc?.syncedAt || null,
  };
}

export async function storeVideos(videos) {
  const client = writeClient();
  if (!client) {
    throw new Error("Missing SANITY_API_TOKEN");
  }

  const syncedAt = new Date().toISOString();
  await client.createOrReplace({
    _id: VIDEO_CACHE_ID,
    _type: "youtubeCache",
    syncedAt,
    videos: publicVideoList(videos).map((video) => ({
      _key: video.id,
      ...video,
    })),
  });

  return syncedAt;
}
