import ShopPage from "@/views/ShopPage/ShopPage.jsx";
import { pageMetadataAsync } from "@/lib/seo";

export async function generateMetadata() {
  return pageMetadataAsync({
    title: "Store",
    description: "Drew Della store. Merch is on the way.",
    path: "/shop",
  });
}

export default function Page() {
  return <ShopPage />;
}
