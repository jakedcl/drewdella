import { clientIp, rateLimit } from "../../../lib/rateLimit.js";

const LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(status, body, extra = {}) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extra },
  });
}

export async function POST(request) {
  const ip = clientIp(request);
  const limited = rateLimit(`contact:${ip}`, LIMIT);
  if (!limited.ok) {
    return json(
      429,
      { error: "Too many messages. Try again later." },
      { "Retry-After": String(limited.retryAfter) }
    );
  }

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return json(400, { error: "That message didn’t come through." });
  }

  if (String(payload.company || "").trim()) {
    return json(200, { ok: true });
  }

  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const message = String(payload.message || "").trim();
  const mailingList = Boolean(payload.mailingList);

  if (name.length < 1 || name.length > 80) {
    return json(400, { error: "Add a name (80 characters max)." });
  }
  if (!EMAIL.test(email) || email.length > 200) {
    return json(400, { error: "That email doesn’t look right." });
  }
  if (message.length < 10 || message.length > 2000) {
    return json(400, { error: "Write a message between 10 and 2000 characters." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return json(503, { error: "Email isn’t set up yet." });
  }

  const text = [
    `From: ${name} <${email}>`,
    `Mailing list: ${mailingList ? "yes" : "no"}`,
    "",
    message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Drew Della site — ${name}`,
        text,
      }),
    });
    if (!res.ok) {
      console.error("Contact provider error:", res.status);
      return json(502, { error: "Couldn’t send that. Try again in a bit." });
    }
  } catch (error) {
    console.error("Contact send error:", error);
    return json(502, { error: "Couldn’t send that. Try again in a bit." });
  }

  return json(200, { ok: true });
}
