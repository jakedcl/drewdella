import {createClient} from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Create a client
export const client = createClient({
  projectId: 'qcu6o4bq',
  dataset: 'production',
  useCdn: true, // set to false if you want to ensure fresh data
  apiVersion: '2023-05-03', // use the latest API version
});

// Set up image URL builder
const builder = imageUrlBuilder(client);

// Helper function to build image URLs
export function urlFor(source) {
  return builder.image(source);
} 