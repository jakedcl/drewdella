import { createMessage, listMessages } from "../../../lib/chat.js";
import { clientIp, rateLimit } from "../../../lib/rateLimit.js";

const POST_LIMIT = { limit: 8, windowMs: 60_000 };
const GET_LIMIT = { limit: 45, windowMs: 60_000 };

function jsonError(status, message, extraHeaders = {}) {
  return Response.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store", ...extraHeaders } }
  );
}

export async function GET(request) {
  const ip = clientIp(request);
  const limited = rateLimit(`chat:get:${ip}`, GET_LIMIT);
  if (!limited.ok) {
    return jsonError(429, "Too many requests. Try again shortly.", {
      "Retry-After": String(limited.retryAfter),
    });
  }

  try {
    const messages = await listMessages();
    return Response.json(
      { messages },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Chat list error:", error);
    return jsonError(500, "Failed to load chat");
  }
}

export async function POST(request) {
  const ip = clientIp(request);
  const limited = rateLimit(`chat:post:${ip}`, POST_LIMIT);
  if (!limited.ok) {
    return jsonError(429, "Too many messages. Slow down.", {
      "Retry-After": String(limited.retryAfter),
    });
  }

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
    const status = error.status === 400 ? 400 : 500;
    const message =
      status === 400
        ? error.message || "Invalid message"
        : "Failed to post message";
    return jsonError(status, message);
  }
}
