import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";

export const metadata = {
  title: "Drew Della",
  description:
    "Drew Della - Artist, musician, creator. Explore music, lyrics, videos, blog posts, and more.",
  keywords: ["Drew Della", "music", "artist", "lyrics", "songs"],
  openGraph: {
    title: "Drew Della",
    description:
      "Artist, musician, and creator. Explore music, lyrics, videos, blog posts, and more.",
    type: "website",
    url: "https://drewdella.com",
    images: [
      {
        url: "https://drewdella.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "Drew Della",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://drewdella.com/og.jpg"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
