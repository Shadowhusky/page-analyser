# AI Website Inspector

An intelligent website analysis tool powered by Cloudflare Workers AI. Analyze any website for SEO quality, performance metrics, and get **REAL Core Web Vitals** data from Google PageSpeed Insights API.

### Project Structure

```
page-analyser/
├── src/
│   ├── worker.ts              # Main Cloudflare Worker (API + static serving)
│   └── inspector-do.ts        # Durable Object for user history storage
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main React app component
│   │   ├── main.tsx          # React entry point
│   │   ├── index.css         # Tailwind CSS styles
│   │   └── components/       # React components
│   │       ├── InspectorForm.tsx
│   │       ├── ReportDisplay.tsx
│   │       └── History.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── wrangler.toml             # Cloudflare Workers configuration
├── package.json              # Root package (Worker dependencies)
├── .dev.vars.example         # Example environment variables
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- **Google PageSpeed Insights API Key** (free, for Core Web Vitals)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd page-analyser
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Authenticate with Cloudflare**
   ```bash
   wrangler login
   ```

5. **Get Google PageSpeed Insights API Key** (Optional but recommended)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "PageSpeed Insights API"
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy your API key

6. **Configure environment variables**
   
   For local development, create `.dev.vars`:
   ```bash
   cp .dev.vars.example .dev.vars
   ```
   
   Edit `.dev.vars` and add your API key:
   ```
   PAGESPEED_API_KEY=your-actual-api-key-here
   ```

   For production deployment, use Wrangler secrets:
   ```bash
   wrangler secret put PAGESPEED_API_KEY
   # Enter your API key when prompted
   ```

### Development

#### Run the frontend in development mode

```bash
npm run frontend:dev
```

This starts Vite dev server on `http://localhost:5173` with proxy to Worker API.

#### Run the Worker locally

In a separate terminal:

```bash
npm run dev
```

This starts the Cloudflare Worker on `http://localhost:8787`.

> **Note**: For local development with Workers AI, you need to have access to Cloudflare's AI features on your account.

### Deployment

#### Build and deploy everything

```bash
npm run deploy
```

This will:
1. Build the React frontend (`npm run build`)
2. Deploy the Worker with the built frontend assets (`wrangler deploy`)

#### Manual steps

```bash
# Build frontend only
npm run build

# Deploy Worker only (after building frontend)
wrangler deploy
```

## 📡 API Endpoints

### `POST /api/analyze`

Analyzes a website and returns a comprehensive report with REAL Core Web Vitals.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "id": "uuid",
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "Example description",
  "reportText": "{...structured AI analysis...}",
  "metrics": {
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "Example description",
    "h1Count": 1,
    "h2Count": 3,
    "h3Count": 5,
    "imgCount": 5,
    "imgWithAltCount": 4,
    "scriptCount": 2,
    "stylesheetCount": 3,
    "inlineStyleCount": 0,
    "htmlLength": 15234,
    "hasViewport": true,
    "hasLang": true,
    "hasCanonical": true,
    "hasRobots": true,
    "hasOpenGraph": true,
    "hasStructuredData": true,
    "hasCharset": true,
    "isHttps": true,
    "linkCount": 25,
    "internalLinkCount": 20,
    "externalLinkCount": 5,
    "hasH1": true,
    "uniqueH1": true,
    "textToHtmlRatio": 35
  },
  "createdAt": "2024-11-27T12:00:00.000Z"
}
```

### `GET /api/history`

Returns the current user's analysis history (stored in Durable Object).

**Response:**
```json
[
  {
    "id": "uuid",
    "url": "https://example.com",
    "title": "...",
    "reportText": "{...}",
    "metrics": { ... },
    "createdAt": "2024-11-27T12:00:00.000Z"
  }
]
```

## 🔧 Configuration

### `wrangler.toml`

The Worker is configured with:

- **AI Binding**: `AI` - Cloudflare Workers AI
- **Durable Object Binding**: `INSPECTOR_DO` - User history storage
- **Static Assets**: Serves React app from `frontend/dist`
- **Environment Variables**: Optional `PAGESPEED_API_KEY`

### Workers AI Model

Currently using: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`

You can change this in `src/worker.ts` in the `analyzeWithAI` function.

## 🧪 How It Works

### User Identification

- Users are identified via a `user_id` cookie
- If no cookie exists, a random UUID is generated and set
- Each user's history is stored in their own Durable Object instance

### Analysis Process

1. **Frontend** sends URL to `/api/analyze`
2. **Worker** validates and fetches the target page HTML
3. **Worker** extracts 30+ metrics using regex patterns:
   - Page title, meta description, headings (H1-H3)
   - Image count and alt text usage
   - Script tags, stylesheets, inline styles
   - Meta tags (viewport, canonical, robots, OG)
   - Link analysis (internal vs external)
   - Text-to-HTML ratio
   - HTTPS and other technical checks
4. **Worker** calls Google PageSpeed Insights API for REAL Core Web Vitals:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)
   - FCP (First Contentful Paint)
   - TTFB (Time to First Byte)
   - Overall Performance Score
5. **Worker** calls Workers AI with structured prompt requesting JSON output
6. **AI** analyzes the data and provides:
   - Scores (0-100) for SEO, Performance, Accessibility, Best Practices
   - Specific findings (positive, warnings, critical issues)
   - Prioritized recommendations with impact descriptions
   - Summary overview
7. **Worker** combines all data and stores the report in the user's Durable Object
8. **Worker** returns the complete report to frontend

### Durable Objects

The `InspectorDO` class manages per-user state:
- Stores up to 50 most recent reports per user
- Provides `/add` and `/list` endpoints
- Persists data across Worker invocations

## 📊 Metrics Tracked (30+ Data Points!)

**SEO:**
- Title, Meta Description, Canonical URL
- Headings (H1, H2, H3) + uniqueness
- Open Graph tags, Structured Data
- Language attribute, Robots meta

**Performance:**
- HTML size, Text/HTML ratio
- Script count, Stylesheet count
- Inline styles, Load time
- **REAL Core Web Vitals** (LCP, FID, CLS, FCP, TTFB)
- PageSpeed Performance Score

**Accessibility:**
- Image alt text coverage
- Viewport meta tag
- Language attribute
- Semantic HTML structure

**Best Practices:**
- HTTPS usage
- Charset declaration
- Link structure (internal/external)
- Mobile-friendly indicators

## 📝 Future Enhancements

## 📄 License

MIT

**Developed by Richard with ❤️**
