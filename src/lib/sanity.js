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

export async function fetchSanityData(query) {
  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Sanity query error:', error);
    throw new Error(`Failed to fetch data from Sanity: ${error.message}`);
  }
}
