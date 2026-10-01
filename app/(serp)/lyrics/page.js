import LyricsPage from "@/views/LyricsPage/LyricsPage.jsx";
import SerpMessage from "@/components/SerpMessage/SerpMessage.jsx";
import { getLyricsList } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Lyrics",
  description: "Lyrics by Drew Della.",
  path: "/lyrics",
});

export default async function Page() {
  try {
    const songs = await getLyricsList();
    return <LyricsPage initialSongs={songs || []} />;
  } catch (error) {
    console.error("Lyrics list error:", error);
    return (
      <SerpMessage
        title="Lyrics are taking a break."
        detail="Couldn’t load lyrics right now. Try again in a bit."
        links={[
          { to: "/music", label: "Music" },
          { to: "/", label: "All results" },
        ]}
      />
    );
  }
}
