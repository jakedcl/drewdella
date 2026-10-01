import BlogPage from "@/views/BlogPage/BlogPage.jsx";
import SerpMessage from "@/components/SerpMessage/SerpMessage.jsx";
import { getBlogList } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Blog",
  description: "Blog posts by Drew Della.",
  path: "/blog",
});

export default async function Page() {
  try {
    const posts = await getBlogList();
    return <BlogPage initialPosts={posts || []} />;
  } catch (error) {
    console.error("Blog list error:", error);
    return (
      <SerpMessage
        title="Blog is taking a break."
        detail="Couldn’t load the blog right now. Try again in a bit."
        links={[
          { to: "/", label: "All results" },
          { to: "/home", label: "Home" },
        ]}
      />
    );
  }
}
