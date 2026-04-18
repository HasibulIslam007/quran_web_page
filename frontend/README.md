# Quran App Frontend

Frontend for a Quran reading and search experience built with Next.js, React, and Tailwind CSS.

## Features

- Homepage with Surah discovery and quick search
- Dedicated search page powered by the backend API
- Surah details page with Arabic text, translations, and settings
- About page, reusable header, footer, and settings sidebar
- Dark mode, Arabic font selection, and text-size preferences

## Requirements

- Node.js 18+ recommended
- Backend running on `http://localhost:3001` for local development

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in this folder if you need to override the backend URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Scripts

```bash
npm run dev
npm run build
npm run start
```

## Development

Start the frontend with:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app uses the Pages Router, so the main routes live in `pages/`.

## Project Structure

- `pages/` - main routes such as home, search, about, and surah details
- `components/` - shared layout and UI components
- `lib/` - frontend helpers and search logic
- `utils/` - shared fetch helpers
- `public/` - static assets

## Notes

- Keep the backend URL pointed at a real server in production; do not leave it set to localhost.
- The theme and reading preferences are stored in the browser and applied globally.

## Deployment

Build the app with `npm run build`, then deploy the `frontend` folder as the app root in your hosting provider.
