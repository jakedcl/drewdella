import SerpShell from "@/components/SerpShell";
import { getShopDestination } from "@/lib/content";

export default async function SerpLayout({ children }) {
  const shop = await getShopDestination().catch(() => undefined);
  return <SerpShell shop={shop}>{children}</SerpShell>;
}
