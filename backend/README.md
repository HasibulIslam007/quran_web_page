# Quran App Backend

Backend API for the Quran app. It serves Surah data, search results, and a simple health check.

## Features

- Surah list and Surah-by-id endpoints
- Multilingual ayah search across English, Bangla, and Arabic
- Health check endpoint for deployment monitoring

## Requirements

- Node.js 18+ recommended

## Setup

Install dependencies:

```bash
npm install
```

## Scripts

```bash
npm run dev
npm start
```

## Development

Start the backend with:

```bash
npm run dev
```

The server listens on `http://localhost:3001` by default.

## API Endpoints

- `GET /api/health` - health check
- `GET /api/surahs` - return all Surahs
- `GET /api/surahs/:id` - return a single Surah by id
- `GET /api/search?q=...&lang=eng|ban|arb&limit=...` - search ayahs

## Project Structure

- `src/server.js` - server entry point
- `src/app.js` - Express app setup
- `src/app/controllers/` - route handlers
- `src/app/routes/` - API routes
- `src/app/utils/` - Quran data and search helpers
- `data/` - Quran JSON datasets

## Notes

- The backend is CommonJS-based.
- The frontend expects this API to be available locally at port `3001` during development.
