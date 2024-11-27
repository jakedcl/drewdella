import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await cloudinary.search
      .expression("folder:drewdella")
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();
    
    const images = result.resources.map((file) => ({
      url: file.secure_url,
      publicId: file.public_id,
      width: file.width,
      height: file.height,
      format: file.format,
    }));

    return res.status(200).json({ images });
  } catch (error) {
    console.error("Failed to retrieve images:", error);
    return res.status(500).json({ 
      error: "Failed to retrieve images",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 