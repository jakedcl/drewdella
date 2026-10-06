import { buildSearchIndex } from "@/lib/searchIndex";

export const revalidate = 3600;

export async function GET() {
  try {
    const docs = await buildSearchIndex();
    return Response.json(docs);
  } catch (error) {
    console.error("Search index error:", error);
    return Response.json({ error: "Failed to load search" }, { status: 500 });
  }
}
