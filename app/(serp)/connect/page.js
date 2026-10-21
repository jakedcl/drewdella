import ConnectPage from "@/views/ConnectPage/ConnectPage.jsx";
import SerpMessage from "@/components/SerpMessage/SerpMessage.jsx";
import { getContactEmail, getSocials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Socials",
  description: "Find Drew Della on Instagram, YouTube, Bandcamp, and more.",
  path: "/connect",
});

export default async function Page() {
  try {
    const [links, email] = await Promise.all([getSocials(), getContactEmail()]);
    return <ConnectPage initialLinks={links || []} email={email || ""} />;
  } catch (error) {
    console.error("Socials page error:", error);
    return (
      <SerpMessage
        title="Socials are taking a break."
        detail="Couldn’t load socials right now. Try again in a bit."
        links={[
          { to: "/", label: "All results" },
          { to: "/home", label: "Home" },
        ]}
      />
    );
  }
}
