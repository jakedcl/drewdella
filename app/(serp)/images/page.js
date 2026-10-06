import { Suspense } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ImagesPage from "@/views/ImagesPage/ImagesPage.jsx";
import SerpMessage from "@/components/SerpMessage/SerpMessage.jsx";
import { getGallery } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Images",
  description: "Photos of Drew Della.",
  path: "/images",
});

export default async function Page() {
  try {
    const { images, elapsed } = await getGallery();
    return (
      <AppRouterCacheProvider>
        <Suspense fallback={null}>
          <ImagesPage images={images || []} elapsed={elapsed} />
        </Suspense>
      </AppRouterCacheProvider>
    );
  } catch (error) {
    console.error("Images page error:", error);
    return (
      <SerpMessage
        title="Images are taking a break."
        detail="Couldn’t load photos right now. Try again in a bit."
        links={[
          { to: "/", label: "All results" },
          { to: "/home", label: "Home" },
        ]}
      />
    );
  }
}
