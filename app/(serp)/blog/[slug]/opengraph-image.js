import { ImageResponse } from "next/og";
import OgCard from "@/components/OgCard";
import { getBlogPost } from "@/lib/content";

export const alt = "Drew Della blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  const title = post?.title || "Blog";
  const sub = String(post?.preview || "Drew Della")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 110);
  return new ImageResponse(<OgCard title={title} sub={sub} kicker="Blog" />, {
    ...size,
  });
}
