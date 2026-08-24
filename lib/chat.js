import { createClient } from "@sanity/client";

const SANITY = {
  projectId: "qcu6o4bq",
  dataset: "production",
  apiVersion: "2024-01-01",
};

export const MAX_NAME = 24;
export const MAX_BODY = 280;
export const MESSAGE_LIMIT = 100;

function readClient() {
  return createClient({ ...SANITY, useCdn: false });
}

function writeClient() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) return null;
  return createClient({ ...SANITY, useCdn: false, token });
}

export function publicMessage(doc) {
  if (!doc?._id) return null;
  return {
    id: doc._id,
    name: String(doc.name || "").trim(),
    body: String(doc.body || "").trim(),
    createdAt: doc._createdAt || null,
  };
}

export function cleanName(raw) {
  return String(raw || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME);
}

export function cleanBody(raw) {
  return String(raw || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, MAX_BODY);
}

export async function listMessages(limit = MESSAGE_LIMIT) {
  const docs = await readClient().fetch(
    `*[_type == "chatMessage"] | order(_createdAt desc)[0...100]{
      _id,
      name,
      body,
      _createdAt
    }`
  );
  const messages = (docs || []).map(publicMessage).filter(Boolean).reverse();
  const safe = Math.min(Math.max(Number(limit) || MESSAGE_LIMIT, 1), MESSAGE_LIMIT);
  return messages.slice(-safe);
}

export async function createMessage({ name, body }) {
  const client = writeClient();
  if (!client) {
    throw new Error("Missing SANITY_API_TOKEN");
  }

  const cleanedName = cleanName(name);
  const cleanedBody = cleanBody(body);
  if (!cleanedName) {
    const err = new Error("Name is required");
    err.status = 400;
    throw err;
  }
  if (!cleanedBody) {
    const err = new Error("Message is required");
    err.status = 400;
    throw err;
  }

  const doc = await client.create({
    _type: "chatMessage",
    name: cleanedName,
    body: cleanedBody,
  });

  return publicMessage(doc);
}
