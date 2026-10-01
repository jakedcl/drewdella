import { ImageResponse } from "next/og";
import OgCard from "@/components/OgCard";
import { getRelease } from "@/lib/content";

export const alt = "Drew Della release";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const release = await getRelease(slug).catch(() => null);
  const title = release?.title || "Drew Della";
  const sub = (release?.subtitle || release?.description || "Music").slice(0, 90);
  return new ImageResponse(<OgCard title={title} sub={sub} kicker="Music" />, {
    ...size,
  });
}
