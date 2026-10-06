import "server-only";
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "qcu6o4bq",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

export { urlFor, sanityImage } from "./imageUrl";
