# BloomDesk — CLAUDE.md

## What this is
A focus timer web app where completing sessions waters a plant, unlocks pets, and fills the screen with rising water if you work too long without a break. Built with React + Vite, auth + persistence via Supabase, AI wellness messages via Groq.

## Stack
- **Frontend**: React 18, Vite, React Router
- **Auth + DB**: Supabase (`src/lib/supabase.js`)
- **AI**: Groq API (server-side only, never expose key client-side — no `VITE_` prefix)
- **Styling**: plain CSS (`src/App.css` for app, `src/landing.css` for landing page)
- **Deploy**: Vercel

## Key files
```
src/
  App.jsx              — root state, session logic, PET_ROSTER, toDbRow/fromDbRow
  App.css              — all app styles
  pages/LandingPage.jsx
  landing.css
  components/
    Timer.jsx
    Plant.jsx          — plant stage display, uses /plants/*.png
    PetGarden.jsx      — pet grid, hover modals, cursor follower
    Stats.jsx          — daily stats display
    WaterOverlay.jsx   — rising water effect as session time increases
    WellnessAgent.jsx  — Groq-powered AI buddy
    AuthModal.jsx
    Fireflies.jsx
  contexts/AuthContext.jsx
  lib/supabase.js
public/
  plants/              — seed.png, sprout.png, leafy.png, potted.png, flowering.png, bloom.png
  pets/                — frog.png, cat.png, bunny.png, goat.png, turtle.png
  rippling_water.mp4   — water overlay video (currently unused, kept for reference)
```

## State shape (`INITIAL_STATE` in App.jsx)
```js
{
  water: 0,          // cumulative — drives plant growth
  dailyWater: 0,     // resets daily — shown in Stats
  sessions: 0,       // total sessions ever (drives pet unlocks)
  totalMinutes: 0,   // cumulative focus minutes (used by WellnessAgent)
  dailyMinutes: 0,   // resets daily — shown in Stats
  dailyDate: null,   // 'YYYY-MM-DD' — when dailyWater/dailyMinutes were last reset
  unlockedPets: [],  // array of pet ids
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
}
```

## Supabase table: `user_stats`
Columns mirror the state. New columns added mid-project:
```sql
alter table user_stats add column daily_minutes int default 0;
alter table user_stats add column daily_date text;
alter table user_stats add column daily_water int default 0;
```
Auth uses email confirmation — Supabase Dashboard → Authentication → URL Configuration must have Site URL and Redirect URLs set.

## Pet roster (`PET_ROSTER` in App.jsx)
| id     | name    | unlock at |
|--------|---------|-----------|
| frog   | Froggo  | 1 session |
| cat    | Mochi   | 3         |
| bunny  | Bun Bun | 6         |
| goat   | Cosmo   | 10        |
| turtle | Floaty  | 15        |

## Plant stages (`STAGES` in Plant.jsx)
| water (cumulative) | stage      |
|--------------------|------------|
| 0                  | Seed       |
| 1                  | Sprout     |
| 3                  | Leafy      |
| 6                  | Potted     |
| 10                 | Flowering  |
| 15                 | Full Bloom |

## Static assets pattern
PNGs and video go in `public/` and are referenced as URL strings (`/plants/seed.png`, `/pets/frog.png`). Do NOT import them through Vite.

## Daily reset logic
`localDate()` utility in App.jsx returns `'YYYY-MM-DD'`. On session complete, compare `prev.dailyDate === today` — if different, reset both `dailyMinutes` and `dailyWater` to the new session's values. The `dailyDate` field covers both counters (no separate date field needed).

## Water overlay
`WaterOverlay.jsx` — rises from bottom of screen as `elapsed` increases (0 → 3600s = 0% → 100% height). Two SVG wave layers animate at different speeds for the water surface. Desperate state (≥50 min) deepens color and pulses. `isWorking = false` collapses height to 0 with CSS transition.

## Design aesthetic
Dark forest green theme. Primary accent: `rgba(90, 158, 111, ...)` greens. Glassmorphism on pet scene cards. Firefly particle effect in background. No purple/pink in the main app.

## CSS conventions
- Pet cards: glassmorphism — `backdrop-filter: blur(10px)`, near-transparent bg, subtle border
- Idle pet animation: `scene-idle` (0.8px over 4s). Hover: `scene-bob` (5px over 0.7s)
- Plant images: `object-fit: contain`, `10rem × 10rem` in app, responsive down to `4.5rem`
- Theme toggled via `data-theme` attribute on `<html>`, persisted in localStorage

## Security rules
- `GROQ_API_KEY` must stay server-side (no `VITE_` prefix). Never bake into client bundle.
- `.env` is gitignored — never commit it.
- Vercel env vars: `GROQ_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Pending / known issues
- Pet Garden feels limited — ideas discussed: active companion, mood system, shared scene layout, pet of the day, reactions during sessions. To be revisited.
- Supabase email confirmation redirect may need URL config update when deploying to production domain.
- Old Groq API key was exposed in client — rotate it at console.groq.com if not already done.
