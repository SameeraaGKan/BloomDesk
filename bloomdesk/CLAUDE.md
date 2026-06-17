# BloomDesk — CLAUDE.md

## Project Overview
Focus timer web app where sessions water a plant, unlock pets, and trigger a rising water overlay — built with React + Vite, Supabase auth/DB, and Groq AI.

## Tech Stack & Environment
- React 18, Vite, React Router v6
- Supabase (auth + `user_stats` table)
- Groq API (AI wellness messages)
- Deployed on Vercel

Required env vars (in `.env`, never commit):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
GROQ_API_KEY=        # no VITE_ prefix — server-side only
```

## Key Commands
```bash
npm run dev      # start dev server (localhost:5173)
npm run build    # production build
npm run preview  # preview production build locally
```

## Code Style Rules
- **No CSS preprocessors** — plain CSS only, split between `App.css` (app) and `landing.css` (landing page)
- **Static assets in `public/`** — PNGs and video go in `public/plants/`, `public/pets/`, referenced as URL strings (`/plants/seed.png`). Never import through Vite.
- **No comments unless the why is non-obvious** — self-documenting names preferred
- **Dark forest green aesthetic** — primary accent `rgba(90, 158, 111, ...)`. No purple/pink in the main app.
- **Glassmorphism on pet cards** — `backdrop-filter: blur(10px)`, near-transparent bg, subtle border

## Project Gotchas
- **`GROQ_API_KEY` must never have the `VITE_` prefix** — doing so bakes it into the client bundle. It's used server-side only.
- **Two water counters, not one** — `water` (cumulative, drives plant growth) vs `dailyWater` (resets daily, shown in Stats). Same pattern for minutes: `totalMinutes` vs `dailyMinutes`. Stats receives the daily ones; Plant receives cumulative `water`.
- **Daily reset uses a single `dailyDate` field** — both `dailyWater` and `dailyMinutes` reset when `prev.dailyDate !== localDate()`. Don't add a separate date field for each.
- **Supabase columns for daily fields must be added manually** — `daily_minutes`, `daily_date`, `daily_water` were added after initial schema. New columns need `ALTER TABLE` before deploying features that use them.
- **Plant images use `object-fit: contain`** — don't change to `cover`; the PNGs have transparency and will be cropped incorrectly.
- **Pet animations are CSS-only** — idle bob is `scene-idle` (0.8px, 4s); hover overrides with `scene-bob` (5px, 0.7s) via `.pet-scene-card:hover .scene-card-pet`. Don't use inline `animationDuration` styles.
- **`localDate()` exists in App.jsx** — reuse it for any date comparison; don't use `new Date().toLocaleDateString()` (timezone-unsafe).
