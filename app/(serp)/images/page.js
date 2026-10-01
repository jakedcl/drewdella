import { Suspense } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ImagesPage from "@/views/ImagesPage/ImagesPage.jsx";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Images",
  description: "Photos of Drew Della.",
  path: "/images",
});

export default function Page() {
  return (
    <AppRouterCacheProvider>
      <Suspense fallback={null}>
        <ImagesPage />
      </Suspense>
    </AppRouterCacheProvider>
  );
}
