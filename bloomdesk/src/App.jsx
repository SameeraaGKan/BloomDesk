import { useState, useEffect, useRef } from 'react'
import Timer from './components/Timer'
import Plant from './components/Plant'
import PetGarden from './components/PetGarden'
import Stats from './components/Stats'
import WellnessAgent from './components/WellnessAgent'
import WaterOverlay from './components/WaterOverlay'
import './App.css'

const INITIAL_STATE = {
  water: 0,
  sessions: 0,
  totalMinutes: 0,
  unlockedPets: [],
}

export const PET_ROSTER = [
  { id: 'frog',    name: 'Froggo',   emoji: '🐸', threshold: 1,  mood: ['😊','😴','🎉'], desc: 'Loves rainy days' },
  { id: 'cat',     name: 'Mochi',    emoji: '🐱', threshold: 3,  mood: ['😸','😻','🐾'], desc: 'Naps professionally' },
  { id: 'bunny',   name: 'Bun Bun',  emoji: '🐰', threshold: 6,  mood: ['🥕','💨','✨'], desc: 'Extremely fluffy' },
  { id: 'penguin', name: 'Pebble',   emoji: '🐧', threshold: 10, mood: ['🐟','❄️','🎵'], desc: 'Formal but fun' },
  { id: 'dragon',  name: 'Ember',    emoji: '🐲', threshold: 15, mood: ['🔥','💎','⚡'], desc: 'Ancient garden spirit' },
]

function loadState() {
  try {
    const saved = localStorage.getItem('bloomdesk-v1')
    return saved ? { ...INITIAL_STATE, ...JSON.parse(saved) } : INITIAL_STATE
  } catch {
    return INITIAL_STATE
  }
}

export default function App() {
  const [state, setState] = useState(loadState)
  const [notification, setNotification] = useState(null)
  const [isWorking, setIsWorking] = useState(false)
  const [sessionElapsed, setSessionElapsed] = useState(0)
  const [justWatered, setJustWatered] = useState(false)
  const [justFinished, setJustFinished] = useState(0)
  const notifTimer = useRef(null)

  useEffect(() => {
    localStorage.setItem('bloomdesk-v1', JSON.stringify(state))
  }, [state])

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

      const newlyUnlocked = PET_ROSTER.filter(
        p => !prev.unlockedPets.includes(p.id) && newSessions >= p.threshold
      )

      if (newlyUnlocked.length) {
        const pet = newlyUnlocked[0]
        setTimeout(() => showNotif(`${pet.emoji} New friend! Say hi to ${pet.name}!`), 600)
      } else {
        setTimeout(() => showNotif('💧 Plant watered! Great work!'), 400)
      }

      return {
        ...prev,
        water: newWater,
        sessions: newSessions,
        totalMinutes: newMinutes,
        unlockedPets: [...prev.unlockedPets, ...newlyUnlocked.map(p => p.id)],
      }
    })
  }

  function onReset() {
    if (window.confirm('Reset all progress? Your plant and friends will start over.')) {
      setState(INITIAL_STATE)
    }
  }

  const nextPet = PET_ROSTER.find(p => !state.unlockedPets.includes(p.id))

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <span className="logo-emoji">🌿</span>
          <h1>BloomDesk</h1>
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
          <Timer onSessionComplete={onSessionComplete} onWorkingChange={setIsWorking} onElapsedChange={setSessionElapsed} />
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
          © {new Date().getFullYear()} <a href="https://sameeraagkan.github.io/" target="_blank" rel="noreferrer" className="footer-link">Sameeraa GKan</a>
        </p>
      </footer>
    </div>
  )
}
