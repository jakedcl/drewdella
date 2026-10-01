import MapPage from "@/views/MapPage/MapPage.jsx";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Maps",
  description: "Venues that have hosted Drew Della.",
  path: "/maps",
});

export default function Page() {
  return <MapPage />;
}