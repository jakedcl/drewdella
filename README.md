# Drew Della Website

A custom Google parody website for artist Drew Della, built with React, Vite, and Sanity CMS.

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Styling**: CSS (Google parody aesthetic), Material-UI
- **CMS**: Sanity (headless CMS)
- **Hosting**: Vercel
- **APIs**: YouTube API, Mapbox, Sanity

## Project Structure

```
drewdella/
├── api/                    # Vercel serverless functions
│   └── videos.js          # YouTube videos API
├── src/
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities (Sanity client, etc.)
│   └── main.jsx           # App entry point
├── studio/                # Sanity Studio configuration
│   └── schemaTypes/       # Sanity content schemas
├── public/                # Static assets
└── scripts/               # Development scripts
```

## Getting Started

### Prerequisites

- Node.js 22.x
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

See `.env.example` for required environment variables:
- `VITE_SANITY_PROJECT_ID` - Your Sanity project ID
- `VITE_SANITY_DATASET` - Sanity dataset (usually "production")
- `VITE_SANITY_API_TOKEN` - Sanity API token
- `VITE_MAPBOX_TOKEN` - Mapbox access token
- `YOUTUBE_API_KEY` - YouTube Data API key
- `YOUTUBE_CHANNEL_ID` - YouTube channel ID

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Sanity Studio

The Sanity Studio is located in the `studio/` directory. To run it:

```bash
cd studio
npm install
npm run dev
```

Then deploy the studio:
```bash
npm run deploy
```

## Deployment

The project is configured for automatic deployment on Vercel. Push to the `main` branch to trigger a deployment.

### Vercel Configuration

- Node.js version: 22.x
- Build command: `npm run build`
- Output directory: `dist`

## API Endpoints

The project uses Vercel Serverless Functions for the backend API. All API endpoints are located in the `api/` folder and automatically become serverless functions when deployed.

- `/api/videos` - Fetch YouTube videos (used by VideosPage)

**Note:** Most content (images, blog posts, music releases, social links) is fetched directly from Sanity CMS in the frontend, not through API endpoints.

## License

Private project for Drew Della

