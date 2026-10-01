import { ImageResponse } from "next/og";
import OgCard from "@/components/OgCard";

export const alt = "Drew Della";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        title="Drew Della"
        sub="Music, lyrics, videos, and live shows."
      />
    ),
    { ...size }
  );
}
