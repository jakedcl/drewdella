const cloudinary = require('../utils/cloudinary');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await cloudinary.search
      .expression("folder:drewdella")
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();
    
    return res.status(200).json({ 
      images: result.resources.map((file) => file.secure_url) 
    });
  } catch (error) {
    console.error("Failed to retrieve images:", error);
    return res.status(500).json({ error: "Failed to retrieve images" });
  }
} 