import { notFound } from "next/navigation";
import BlogPage from "@/views/BlogPage/BlogPage.jsx";
import JsonLd from "@/components/JsonLd.jsx";
import { getBlogList, getBlogPost } from "@/lib/content";
import { articleJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getBlogList().catch(() => []);
  return (posts || [])
    .map((post) => post.slug?.current || post.slug)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) {
    return pageMetadata({
      title: "Blog",
      description: "Blog posts by Drew Della.",
      path: "/blog",
    });
  }
  const description =
    String(post.preview || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160) || `${post.title} — a post by Drew Della.`;
  return pageMetadata({
    title: post.title,
    description,
    path: `/blog/${slug}`,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) notFound();
  return (
    <>
      <JsonLd data={articleJsonLd(post)} />
      <BlogPage slug={slug} initialPost={post} />
    </>
  );
}
