# Quran Web App

A web application for exploring, reading, and searching the Quran with multilingual support and customizable reading preferences.

---

## Table of Contents

* [Features](#features)
* [Technologies](#technologies)
* [Setup](#setup)
* [Backend](#backend)
* [Frontend](#frontend)
* [API Endpoints](#api-endpoints)
* [Project Structure](#project-structure)
* [Notes](#notes)
* [Deployment](#deployment)
* [Screenshots](#screenshots)

---

## Features

* **Homepage** with Surah discovery and quick search
* **Surah Details Page** showing Arabic text with English and Bangla translations
* **Multilingual ayah search** powered by the backend API
* **Settings Panel** for font selection, font sizes, and reading preferences
* **Language toggle** for translations (English/Bangla/Arabic)
* **Responsive Shadcn UI cards** for Surahs and search results
* **Dark mode support**
* **Persistent user settings** stored in browser localStorage

---

## Technologies

* **Frontend:** Next.js, React, Tailwind CSS, shadcn/ui
* **Backend:** Node.js, Express
* **Data:** JSON Quran datasets (Arabic, English, Bangla)

---

## Setup

### Prerequisites

* Node.js 18+
* Git installed

### Clone the Repository

```bash
git clone <your-repo-url>
cd quran_app
```

---

## Backend

### Install Dependencies

```bash
cd backend
npm install
```

### Development

```bash
npm run dev
```

* Runs the backend on `http://localhost:3001`
* Serves API endpoints for Surahs, Ayahs, and search

### Scripts

```bash
npm start       # Run backend in production
npm run dev     # Run backend in development
```

### API Endpoints

* `GET /api/health` – health check
* `GET /api/surahs` – return all Surahs
* `GET /api/surahs/:id` – return a single Surah by ID
* `GET /api/search?q=...&lang=eng|ban|arb&limit=...` – search ayahs

### Project Structure

```text
backend/
├─ src/
│  ├─ server.js        # Backend entry point
│  ├─ app.js           # Express app setup
│  ├─ controllers/     # Route handlers
│  ├─ routes/          # API routes
│  └─ utils/           # Quran data and search helpers
├─ data/               # Quran JSON datasets
```

---

## Frontend

### Install Dependencies

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env.local` file:

```text
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
```

### Project Structure

```text
frontend/
├─ pages/             # Main routes: home, search, about, surah details
├─ components/        # Shared UI components (cards, navbar, settings panel)
├─ lib/               # Frontend helpers and search logic
├─ utils/             # Shared fetch helpers
├─ public/            # Static assets (images, icons)
```

---

## Notes

* Keep the backend URL pointed at a real server in production; do not leave it as `localhost`.
* Theme and reading preferences (font, size, language) are stored in **localStorage** and applied globally.
* Pages Router is used for main routes; homepage and Surah pages are fully dynamic.
* Settings panel slides out from the navbar cog icon and controls font and language settings for the entire app.

---

## Deployment

1. Build the frontend:

```bash
cd frontend
npm run build
```


