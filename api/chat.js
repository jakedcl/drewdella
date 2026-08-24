import { createMessage, listMessages } from "../lib/chat.js";

function noStore(res) {
  res.setHeader("Cache-Control", "no-store");
}

export default async function handler(req, res) {
  noStore(res);

  if (req.method === "GET") {
    try {
      const messages = await listMessages();
      return res.status(200).json({ messages });
    } catch (error) {
      console.error("Chat list error:", error);
      return res.status(500).json({ error: "Failed to load chat" });
    }
  }

  if (req.method === "POST") {
    try {
      const payload =
        typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const message = await createMessage({
        name: payload.name,
        body: payload.body,
      });
      return res.status(201).json({ message });
    } catch (error) {
      console.error("Chat post error:", error);
      const status = error.status || (error.message?.includes("SANITY_API_TOKEN") ? 500 : 400);
      return res.status(status).json({
        error: error.message || "Failed to post message",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
