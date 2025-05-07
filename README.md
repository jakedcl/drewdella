# Drew Della Website

A modern, Google-inspired website built with React, Vite, and Next.js, featuring a clean design with custom creative elements. The site integrates YouTube content, image galleries, and uses Sanity as a headless CMS.

## 🚀 Features

- **Modern UI/UX**: Clean, Google-inspired design with custom creative elements
- **Responsive Design**: Mobile-first approach with optimized layouts
- **Content Management**: Sanity CMS integration for dynamic content
- **Video Integration**: YouTube API integration for video content
- **Image Gallery**: Responsive masonry grid layout with lazy loading
- **Search Functionality**: Google-style search with suggestions
- **Performance Optimized**: Fast loading and smooth interactions

## 🛠 Tech Stack

- **Frontend**:
  - React 18 with Hooks and Context
  - Vite for fast development and optimized builds
  - Material-UI v5 for component library
  - React Router v6 for client-side routing
  - Tailwind CSS for utility-first styling
  - Axios for API requests

- **Backend**:
  - Vercel Serverless Functions for API endpoints
  - Sanity CMS for content management
  - YouTube Data API v3 for video content
  - Cloudinary for image optimization

- **Development**:
  - ESLint with React plugins
  - Node.js 18.x runtime
  - Express for development server
  - Environment variable management
  - Development logging

## 📦 Project Structure

```
drewdella/
├── api/                    # API endpoints
│   ├── utils/             # API utilities
│   │   └── apiHelpers.js  # Common API utilities
│   ├── videos.js          # YouTube integration
│   ├── images.js          # Image handling
│   ├── health.js          # Health checks
│   └── dev.js            # Development server
├── src/
│   ├── components/        # React components
│   │   ├── Layout/       # Layout components
│   │   ├── HeaderHome/   # Homepage header
│   │   ├── NavTabs/      # Navigation
│   │   ├── SearchBar/    # Search functionality
│   │   └── Footer/       # Footer component
│   ├── pages/            # Page components
│   │   ├── HomePage/     # Landing page
│   │   ├── VideosPage/   # Video gallery
│   │   ├── ImagesPage/   # Image gallery
│   │   └── ...          # Other pages
│   ├── lib/              # Utilities
│   │   └── sanity.js     # Sanity client
│   └── App.jsx           # Main application
├── public/               # Static assets
└── studio/              # Sanity studio
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x
- npm or yarn
- Sanity account
- YouTube API key
- Cloudinary account (optional)

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials:
   ```
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # YouTube API Configuration
   YOUTUBE_API_KEY=your_youtube_api_key
   YOUTUBE_CHANNEL_ID=your_channel_id

   # Sanity Configuration
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=production

   # Environment
   NODE_ENV=development
   ```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Start API development server:
   ```bash
   npm run dev:api
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🎨 Key Components

### Navigation
- `NavTabs`: Main navigation component with dynamic routing
  ```jsx
  const pages = [
    { label: "All", path: "/all" },
    { label: "Images", path: "/images" },
    { label: "Videos", path: "/videos" },
    { label: "Socials", path: "/connect" },
    { label: "Shopping", path: shopUrl },
    { label: "Maps", path: "/maps" },
  ];
  ```

- `HeaderHome`: Homepage-specific header with dynamic shop link
- `SearchBar`: Google-style search with suggestions
  ```jsx
  <SearchBar
    feelingLucky={true}
    suggestions={[
      { name: "drew della discography", path: "/all" },
      { name: "della photos", path: "/images" },
      { name: "@thedrewdella", path: "/connect" },
      { name: "live shows nyc+", path: "/maps" },
      { name: "drew della merch", path: shopUrl },
    ]}
  />
  ```

### Pages
- `HomePage`: Landing page with search functionality
- `VideosPage`: YouTube video grid with lazy loading
- `ImagesPage`: Masonry grid image gallery with Sanity integration
- `ConnectPage`: Social media connections
- `MapPage`: Location-based features
- `AllPage`: Combined content view

### API Endpoints
- `/api/videos`: YouTube video fetching
  ```javascript
  // Example API response
  {
    videos: [
      {
        id: "video_id",
        title: "Video Title",
        thumbnail: "thumbnail_url",
        publishedAt: "2024-01-01T00:00:00Z"
      }
    ]
  }
  ```

- `/api/images`: Image gallery management
- `/api/health`: System health monitoring
- `/api/test`: Development testing

## 🔧 Development

### API Development
The project uses Vercel serverless functions for API endpoints. Development server available at:
```bash
npm run dev:api
```

Example API endpoint structure:
```javascript
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // API logic here
    return res.status(200).json({ data: 'success' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

### Sanity Studio
Access the Sanity Studio at `/studio` to manage content:
- Image galleries
- Shop links
- Other dynamic content

Example Sanity query:
```javascript
const query = `*[_type == "imageGallery"][0] {
  title,
  galleryImages[] {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt,
    caption
  }
}`;
```

### Styling
- Material-UI components with custom theme
- Custom CSS modules for specific styling
- Responsive design patterns
- Mobile-first approach

Example Material-UI theme:
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a0dab',
    },
    secondary: {
      main: '#70757a',
    },
  },
  typography: {
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
});
```

## 🚀 Deployment

The project is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy

Vercel configuration (`vercel.json`):
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "api/*.js": {
      "runtime": "@vercel/node@2.0.0"
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 📱 Mobile Optimization

- Responsive layouts with Material-UI breakpoints
- Touch-friendly interfaces
- Mobile-specific components
- Optimized images with lazy loading
- Performance considerations

Example responsive component:
```jsx
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

<Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'flex-start' },
  mb: { xs: 3, sm: 4 },
}}>
```

## 🔒 Security

- Environment variable protection
- API key management
- CORS configuration
- Error message sanitization
- Secure routing

Example CORS configuration:
```javascript
const commonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};
```

## 🧪 Testing

- API health checks
- Environment validation
- Response formatting
- Error handling
- Development logging

Example health check:
```javascript
const results = {
  timestamp: new Date().toISOString(),
  services: {
    environment: {
      status: 'ok',
      details: {
        sanity: true,
        youtube: true
      }
    }
  }
};
```

## 📈 Performance

- Lazy loading for images and components
- Image optimization with Sanity
- Build optimization with Vite
- Cache control headers
- API response optimization

Example lazy loading:
```jsx
<img
  src={urlFor(image.asset)
    .width(800)
    .auto('format')
    .url()}
  alt={image.alt}
  loading="lazy"
/>
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Contact

For questions or support, contact:
- Email: drewdella@gmail.com
- Website: https://www.drewdella.com
