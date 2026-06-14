# 🌿 BloomDesk

A cozy garden-themed productivity app where every focus session waters your plant. Built with React + Vite.

**Live:** [bloom-desk-ruby.vercel.app](https://bloom-desk-ruby.vercel.app)

![BloomDesk](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white) ![Groq](https://img.shields.io/badge/AI-Groq-F55036?logo=groq&logoColor=white) ![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)

## What it does

**Focus Timer** — Pomodoro-style timer with customizable session lengths. Complete a session and your plant gets watered.

**Living Plant** — Your plant grows through 6 stages (Seed → Sprout → Leafy → Potted → Flowering → Full Bloom) as you accumulate focus sessions. Each stage has a glow effect and progress bar to the next stage.

**Pet Garden** — Unlock companion pets (Froggo, Mochi, Bun Bun, Pebble, Ember) as milestones hit. Pets animate while you're in a focus session.

**Stats** — Session count, total focus minutes, water drops collected, and a streak toward your next pet unlock.

**Bloom Buddy** — An AI wellness companion (powered by Groq) that gives personalized break suggestions after each session and responds to freeform questions. Full multi-turn chat with conversation memory.

## The Bloom Recovery Protocol

When a focus session ends, BloomDesk automatically calculates a personalized break using a tiered algorithm grounded in three bodies of cognitive research:

| Research Source | Principle |
|---|---|
| **Pomodoro Technique** (Francesco Cirillo) | 25 min focus → 5 min break; short bursts with fixed recovery |
| **DeskTime 52/17 Study** | The most productive workers work 52 min then rest 17 — a ~33% recovery ratio |
| **Ultradian Basic Rest-Activity Cycle** (Kleitman) | The brain naturally cycles in ~90-min waves; ignoring this degrades performance |

These are blended into a single step function:

| Focus session | Recommended break | Basis |
|---|---|---|
| ≤ 15 min | 3 min | ~20% recovery ratio |
| 16 – 30 min | 5 min | Pomodoro (25:5) |
| 31 – 52 min | 10 min | DeskTime blend |
| 53 – 75 min | 15 min | DeskTime 52/17 |
| 76 – 90 min | 20 min | Ultradian BRAC cycle |
| > 90 min | 25 min | Extended deep-work recovery |

When the timer reaches zero, BloomDesk switches to break mode, pre-fills the recommended duration, and shows the reasoning. You can start the break immediately, adjust the duration, or skip it.

## Stack

- **React 19** + **Vite 8**
- **Groq SDK** (`llama-3.1-8b-instant`) for the AI companion
- Pure CSS glassmorphism — no UI library
- `localStorage` for persistence across sessions

## Getting started

```bash
git clone https://github.com/SameeraaGKan/BloomDesk.git
cd BloomDesk/bloomdesk
npm install
```

Create a `.env` file in the `bloomdesk/` directory:

```
VITE_GROQ_API_KEY=your_groq_key_here
```

Get a free API key at [console.groq.com](https://console.groq.com). The app works without it — Bloom Buddy will just be dormant.

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project structure

```
bloomdesk/
├── src/
│   ├── components/
│   │   ├── Timer.jsx          # Focus timer with session controls
│   │   ├── Plant.jsx          # Growing plant with stage progression
│   │   ├── PetGarden.jsx      # Unlockable companion pets
│   │   ├── Stats.jsx          # Session statistics
│   │   └── WellnessAgent.jsx  # Bloom Buddy AI chat
│   ├── App.jsx                # Root state, session logic
│   ├── App.css                # All layout and component styles
│   └── index.css              # Global tokens and body background
└── .env                       # VITE_GROQ_API_KEY (not committed)
```

## Deploying

The app is a static Vite build. To deploy on Vercel:

1. Import the GitHub repo at [vercel.com](https://vercel.com)
2. Set **Root Directory** to `bloomdesk`
3. Add `VITE_GROQ_API_KEY` under Environment Variables
4. Deploy — every push to `main` auto-redeploys

> **Note:** The Groq API key is embedded in the client bundle (standard for browser-only apps). Set a spend limit on your key at console.groq.com.
