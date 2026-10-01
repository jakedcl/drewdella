import ShopPage from "@/views/ShopPage/ShopPage.jsx";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Store",
  description: "Drew Della store. Merch is on the way.",
  path: "/shop",
});

export default function Page() {
  return <ShopPage />;
}
