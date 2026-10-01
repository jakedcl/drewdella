import { revalidatePath } from "next/cache";

export async function POST(request) {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  const secret = request.headers.get("x-sanity-secret") || "";
  if (!expected || secret !== expected) {
    return Response.json(
      { error: "Invalid secret" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  revalidatePath("/", "layout");
  return Response.json(
    { revalidated: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
