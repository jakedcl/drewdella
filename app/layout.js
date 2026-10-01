import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import JsonLd from "@/components/JsonLd.jsx";
import { getSocials } from "@/lib/content";
import { siteJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://drewdella.com"),
  title: {
    default: "Drew Della",
    template: "%s — Drew Della",
  },
  description:
    "Drew Della — artist, musician, creator. Explore music, lyrics, videos, blog posts, and more.",
  applicationName: "Drew Della",
  authors: [{ name: "Drew Della", url: "https://drewdella.com" }],
  openGraph: {
    type: "website",
    siteName: "Drew Della",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }) {
  const socials = await getSocials().catch(() => []);
  const sameAs = (socials || []).map((item) => item.url).filter(Boolean);

  return (
    <html lang="en">
      <body>
        {children}
        <JsonLd data={siteJsonLd(sameAs)} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
