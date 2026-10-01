import { notFound } from "next/navigation";
import { MusicReleasePage } from "@/views/MusicPage/MusicPage.jsx";
import JsonLd from "@/components/JsonLd.jsx";
import SerpMessage from "@/components/SerpMessage/SerpMessage.jsx";
import { getRelease, getReleases } from "@/lib/content";
import { albumJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const releases = await getReleases().catch(() => []);
  return (releases || []).filter((release) => release.slug).map((release) => ({
    slug: release.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const release = await getRelease(slug).catch(() => null);
  if (!release) {
    return pageMetadata({
      title: "Music",
      description: "Music by Drew Della.",
      path: "/music",
    });
  }
  const description =
    release.subtitle ||
    release.description ||
    `${release.title} by Drew Della.`;
  return pageMetadata({
    title: release.title,
    description,
    path: release.href,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  try {
    const releases = await getReleases();
    const release = releases.find((item) => item.slug === slug);
    if (!release) notFound();
    const others = releases.filter((item) => item.slug !== slug);
    return (
      <>
        <JsonLd data={albumJsonLd(release)} />
        <MusicReleasePage release={release} others={others} />
      </>
    );
  } catch (error) {
    console.error("Release page error:", error);
    return (
      <SerpMessage
        title="Music is taking a break."
        detail="Couldn’t load this release right now. Try again in a bit."
        links={[
          { to: "/music", label: "Music" },
          { to: "/", label: "All results" },
        ]}
      />
    );
  }
}
