import MusicPage from "@/views/MusicPage/MusicPage.jsx";
import JsonLd from "@/components/JsonLd.jsx";
import SerpMessage from "@/components/SerpMessage/SerpMessage.jsx";
import { getReleases, featuredRelease } from "@/lib/content";
import { albumJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Music",
  description:
    "Music by Drew Della. Albums, EPs, tracklists, and listen links, including Thx4itall.",
  path: "/music",
});

export default async function Page() {
  try {
    const started = Date.now();
    const releases = await getReleases();
    const elapsed = Math.max((Date.now() - started) / 1000, 0.04).toFixed(2);
    const feature = featuredRelease(releases);
    return (
      <>
        {feature ? <JsonLd data={albumJsonLd(feature)} /> : null}
        <MusicPage releases={releases} elapsed={elapsed} />
      </>
    );
  } catch (error) {
    console.error("Music page error:", error);
    return (
      <SerpMessage
        title="Music is taking a break."
        detail="Couldn’t load music right now. Try again in a bit."
        links={[
          { to: "/", label: "All results" },
          { to: "/home", label: "Home" },
        ]}
      />
    );
  }
}
