import {createClient} from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Create a client
export const client = createClient({
  projectId: 'qcu6o4bq',
  dataset: 'production',
  useCdn: false, // Changed to false to ensure fresh data and better error handling
  apiVersion: '2024-01-01', // Updated to latest API version
  token: import.meta.env.VITE_SANITY_API_TOKEN, // Use Vite env variable for frontend
  ignoreBrowserTokenWarning: true, // Suppress browser token warning
});

// Set up image URL builder
const builder = imageUrlBuilder(client);

// Helper function to build image URLs
export function urlFor(source) {
  return builder.image(source);
}

// Helper function to handle Sanity queries with error handling
export async function fetchSanityData(query) {
  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Sanity query error:', error);
    throw new Error(`Failed to fetch data from Sanity: ${error.message}`);
  }
} 