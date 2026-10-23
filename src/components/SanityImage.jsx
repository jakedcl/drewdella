"use client";

import Image from "next/image";
import sanityImageLoader from "../lib/sanityImageLoader.js";

function hostname(src) {
  try {
    return new URL(src).hostname;
  } catch {
    return "";
  }
}

/**
 * Client wrapper so Server Components can render next/image with a loader
 * function. Sanity URLs use the Sanity CDN. Apple Music artwork is served
 * as-is. Everything else (local /public files) keeps the default optimizer.
 */
export default function SanityImage({ src, alt = "", ...props }) {
  const host = typeof src === "string" ? hostname(src) : "";
  if (host === "cdn.sanity.io") {
    return <Image {...props} src={src} alt={alt} loader={sanityImageLoader} />;
  }
  if (host === "mzstatic.com" || host.endsWith(".mzstatic.com")) {
    return <Image {...props} src={src} alt={alt} unoptimized />;
  }
  return <Image {...props} src={src} alt={alt} />;
}
