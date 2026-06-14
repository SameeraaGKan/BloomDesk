import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Timer from './components/Timer'
import Plant from './components/Plant'
import PetGarden from './components/PetGarden'
import Stats from './components/Stats'
import WellnessAgent from './components/WellnessAgent'
import WaterOverlay from './components/WaterOverlay'
import Fireflies from './components/Fireflies'
import { useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
import './App.css'

const INITIAL_STATE = {
  water: 0,
  sessions: 0,
  totalMinutes: 0,
  unlockedPets: [],
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
}

export const PET_ROSTER = [
  { id: 'frog',    name: 'Froggo',   emoji: '🐸', threshold: 1,  mood: ['😊','😴','🎉'], desc: 'Loves rainy days' },
  { id: 'cat',     name: 'Mochi',    emoji: '🐱', threshold: 3,  mood: ['😸','😻','🐾'], desc: 'Naps professionally' },
  { id: 'bunny',   name: 'Bun Bun',  emoji: '🐰', threshold: 6,  mood: ['🥕','💨','✨'], desc: 'Extremely fluffy' },
  { id: 'penguin', name: 'Pebble',   emoji: '🐧', threshold: 10, mood: ['🐟','❄️','🎵'], desc: 'Formal but fun' },
  { id: 'dragon',  name: 'Ember',    emoji: '🐲', threshold: 15, mood: ['🔥','💎','⚡'], desc: 'Ancient garden spirit' },
]

function toDbRow(id, s) {
  return {
    id,
    sessions: s.sessions,
    total_minutes: s.totalMinutes,
    water: s.water,
    unlocked_pets: s.unlockedPets,
    current_streak: s.currentStreak,
    longest_streak: s.longestStreak,
    last_session_date: s.lastSessionDate,
    updated_at: new Date().toISOString(),
  }
}

function fromDbRow(row) {
  return {
    water: row.water,
    sessions: row.sessions,
    totalMinutes: row.total_minutes,
    unlockedPets: row.unlocked_pets ?? [],
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    lastSessionDate: row.last_session_date,
  }
}

function calcStreak(prev) {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const last = prev.lastSessionDate

  let next
  if (last === today)      next = prev.currentStreak        // already counted
  else if (last === yesterday) next = prev.currentStreak + 1 // consecutive
  else                     next = 1                          // reset

  return {
    currentStreak: next,
    longestStreak: Math.max(next, prev.longestStreak),
    lastSessionDate: today,
  }
}

export default function App() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [state, setState] = useState(INITIAL_STATE)
  const [notification, setNotification] = useState(null)
  const [isWorking, setIsWorking] = useState(false)
  const [sessionElapsed, setSessionElapsed] = useState(0)
  const [justWatered, setJustWatered] = useState(false)
  const [justFinished, setJustFinished] = useState(0)
  const notifTimer = useRef(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('bd-theme') || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('bd-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  // Load stats from Supabase on mount
  useEffect(() => {
    if (!user) return

    // Optimistic load from localStorage cache
    const cached = localStorage.getItem(`bd-${user.id}`)
    if (cached) {
      try { setState({ ...INITIAL_STATE, ...JSON.parse(cached) }) } catch {}
    }

    supabase
      .from('user_stats')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const loaded = fromDbRow(data)
          setState(loaded)
          localStorage.setItem(`bd-${user.id}`, JSON.stringify(loaded))
        }
      })
  }, [user])

  function showNotif(msg) {
    setNotification(msg)
    clearTimeout(notifTimer.current)
    notifTimer.current = setTimeout(() => setNotification(null), 4000)
  }

  function onSessionComplete(minutes) {
    setJustWatered(true)
    setJustFinished(n => n + 1)
    setTimeout(() => setJustWatered(false), 1500)

    setState(prev => {
      const newWater = prev.water + 1
      const newSessions = prev.sessions + 1
      const newMinutes = prev.totalMinutes + minutes
      const streak = calcStreak(prev)

      const newlyUnlocked = PET_ROSTER.filter(
        p => !prev.unlockedPets.includes(p.id) && newSessions >= p.threshold
      )

      if (newlyUnlocked.length) {
        const pet = newlyUnlocked[0]
        setTimeout(() => showNotif(`${pet.emoji} New friend! Say hi to ${pet.name}!`), 600)
      } else if (streak.currentStreak > prev.currentStreak) {
        setTimeout(() => showNotif(`🔥 ${streak.currentStreak}-day streak! Keep going!`), 400)
      } else {
        setTimeout(() => showNotif('💧 Plant watered! Great work!'), 400)
      }

      const next = {
        ...prev,
        water: newWater,
        sessions: newSessions,
        totalMinutes: newMinutes,
        unlockedPets: [...prev.unlockedPets, ...newlyUnlocked.map(p => p.id)],
        ...streak,
      }

      // Persist
      localStorage.setItem(`bd-${user.id}`, JSON.stringify(next))
      supabase.from('user_stats').upsert(toDbRow(user.id, next))

      return next
    })
  }

  function onReset() {
    if (window.confirm('Reset all progress? Your plant and friends will start over.')) {
      setState(INITIAL_STATE)
      localStorage.removeItem(`bd-${user.id}`)
      supabase.from('user_stats').delete().eq('id', user.id)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const nextPet = PET_ROSTER.find(p => !state.unlockedPets.includes(p.id))

  return (
    <div className="app">
      <Fireflies />
      <header className="app-header">
        <div className="header-top">
          <div className="header-title">
            <span className="logo-emoji">🌿</span>
            <h1>BloomDesk</h1>
          </div>
          <div className="header-right">
            {state.currentStreak > 0 && (
              <div className="streak-badge" title={`Longest: ${state.longestStreak} days`}>
                🔥 {state.currentStreak}
              </div>
            )}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="sign-out-btn" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>
        <p className="tagline">every session waters your garden</p>
      </header>

      {notification && (
        <div className="notification" key={notification}>
          {notification}
        </div>
      )}

      <main className="main-grid">
        <section className="cell-timer">
          <Timer
            onSessionComplete={onSessionComplete}
            onWorkingChange={setIsWorking}
            onElapsedChange={setSessionElapsed}
          />
        </section>

        <section className="cell-plant">
          <Plant water={state.water} justWatered={justWatered} />
        </section>

        <section className="cell-buddy">
          <WellnessAgent
            sessions={state.sessions}
            totalMinutes={state.totalMinutes}
            justFinishedSession={justFinished}
          />
        </section>

        <section className="cell-stats">
          <Stats
            sessions={state.sessions}
            water={state.water}
            totalMinutes={state.totalMinutes}
            nextPet={nextPet}
            currentStreak={state.currentStreak}
            longestStreak={state.longestStreak}
          />
        </section>

        <section className="cell-pets">
          <PetGarden
            allPets={PET_ROSTER}
            unlockedIds={state.unlockedPets}
            sessions={state.sessions}
            isWorking={isWorking}
          />
        </section>
      </main>

      <WaterOverlay elapsed={sessionElapsed} isWorking={isWorking} />

      <footer className="app-footer">
        <button className="reset-link" onClick={onReset}>reset garden</button>
        <p className="footer-copy">
          © {new Date().getFullYear()}{' '}
          <a href="https://sameeraagkan.github.io/" target="_blank" rel="noreferrer" className="footer-link">
            Sameeraa GKan
          </a>
        </p>
      </footer>
    </div>
  )
}
