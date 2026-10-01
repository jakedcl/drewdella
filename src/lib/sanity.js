import {createClient} from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'qcu6o4bq',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

/** Sanity CDN URL with format negotiation. Pass an image field or asset. */
export function sanityImage(source, { width, height, quality = 75 } = {}) {
  if (!source) return "";
  try {
    let image = urlFor(source).auto("format").quality(quality).fit("max");
    if (width) image = image.width(Math.round(width));
    if (height) image = image.height(Math.round(height));
    return image.url();
  } catch {
    return "";
  }
}

export async function fetchSanityData(query) {
  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Sanity query error:', error);
    throw new Error(`Failed to fetch data from Sanity: ${error.message}`);
  }
}
