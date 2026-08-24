import { createMessage, listMessages } from "../../../lib/chat.js";

export async function GET() {
  try {
    const messages = await listMessages();
    return Response.json(
      { messages },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Chat list error:", error);
    return Response.json(
      { error: "Failed to load chat" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const message = await createMessage({
      name: payload.name,
      body: payload.body,
    });
    return Response.json(
      { message },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Chat post error:", error);
    const status =
      error.status ||
      (error.message?.includes("SANITY_API_TOKEN") ? 500 : 400);
    return Response.json(
      { error: error.message || "Failed to post message" },
      { status, headers: { "Cache-Control": "no-store" } }
    );
  }
}
