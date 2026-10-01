import ConnectPage from "@/views/ConnectPage/ConnectPage.jsx";
import { getSocials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Socials",
  description: "Find Drew Della on Instagram, YouTube, Bandcamp, and more.",
  path: "/connect",
});

export default async function Page() {
  try {
    const links = await getSocials();
    return <ConnectPage initialLinks={links || []} />;
  } catch (error) {
    console.error("Socials page error:", error);
    return <ConnectPage />;
  }
}
