import MapPage from "@/views/MapPage/MapPage.jsx";
import { getMapLocations } from "@/lib/content";
import { pageMetadataAsync } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return pageMetadataAsync({
    title: "Maps",
    description: "Venues that have hosted Drew Della.",
    path: "/maps",
  });
}

export default async function Page() {
  try {
    const locations = await getMapLocations();
    return <MapPage locations={locations || []} />;
  } catch (error) {
    console.error("Maps page error:", error);
    return (
      <MapPage
        locations={[]}
        loadError="Couldn’t load venues right now. Try again in a bit."
      />
    );
  }
}