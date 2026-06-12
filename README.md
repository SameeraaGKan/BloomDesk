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
