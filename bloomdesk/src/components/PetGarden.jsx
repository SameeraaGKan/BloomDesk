import { useState, useEffect, useRef } from 'react'

const PET_IMAGES = {
  frog:   '/pets/frog.png',
  cat:    '/pets/cat.png',
  bunny:  '/pets/bunny.png',
  goat:   '/pets/goat.png',
  turtle: '/pets/turtle.png',
}

// CSS bob speed per pet (animation-duration)
const BOB_SPEED = { frog: '2.2s', cat: '2.8s', bunny: '1.6s', goat: '2.0s', turtle: '3.5s' }

const PET_STATS = {
  frog:   [['Focus Power', 60], ['Cheer', 80], ['Rest Skill', 40], ['Energy', 70], ['Bond', 90]],
  cat:    [['Focus Power', 50], ['Cheer', 55], ['Rest Skill', 95], ['Energy', 25], ['Bond', 78]],
  bunny:  [['Focus Power', 72], ['Cheer', 95], ['Rest Skill', 28], ['Energy', 98], ['Bond', 88]],
  goat:   [['Focus Power', 88], ['Cheer', 68], ['Rest Skill', 55], ['Energy', 82], ['Bond', 62]],
  turtle: [['Focus Power', 96], ['Cheer', 45], ['Rest Skill', 85], ['Energy', 35], ['Bond', 72]],
}

const PET_QUOTES = {
  frog:   '"Leap into focus, land in flow"',
  cat:    '"Nap hard. Work harder."',
  bunny:  '"Speed is nothing without stamina!"',
  goat:   '"No peak too high, no deadline too steep"',
  turtle: '"Consistency beats intensity. Always."',
}

const PET_MESSAGES = {
  frog:   ["🐸 Ribbit! You're on fire today!", '🐸 Every session grows the garden!', '🐸 Hop to it — one more session?'],
  cat:    ['🐱 Mochi says: focus first, nap later.', "🐱 You're purr-fectly productive!", '🐱 Time to stretch? Mochi thinks so.'],
  bunny:  ['🐰 Bun Bun is cheering for you!! 🥕', '🐰 Three sessions?? Legendary!!', "🐰 Keep hopping, you've got this!"],
  goat:   ['🐐 Cosmo says: climb every deadline!', "🐐 Nothing's too steep for you.", '🐐 Mountain goat energy — keep pushing!'],
  turtle: ['🐢 Floaty here. Slow and steady wins.', '🐢 Your consistency is genuinely impressive.', '🐢 Take breaks too. Even turtles rest. 🏠'],
}

function petLevel(sessions) { return Math.min(10, Math.floor(sessions / 5) + 1) }
function petXP(sessions)    { return ((sessions % 5) / 5) * 100 }

export default function PetGarden({ allPets, unlockedIds, sessions, isWorking, onNotify }) {
  const [hoveredPet, setHoveredPet] = useState(null)
  const [cursorPet,  setCursorPet]  = useState(null)
  const [mousePos,   setMousePos]   = useState({ x: -300, y: -300 })
  const notifRef = useRef(null)
  const idsKey   = unlockedIds.join(',')

  // Pet notifications
  useEffect(() => {
    if (!unlockedIds.length || !onNotify) return
    function fire() {
      const id   = unlockedIds[Math.floor(Math.random() * unlockedIds.length)]
      const msgs = PET_MESSAGES[id]
      if (msgs) onNotify(msgs[Math.floor(Math.random() * msgs.length)])
      notifRef.current = setTimeout(fire, (180 + Math.random() * 180) * 1000)
    }
    notifRef.current = setTimeout(fire, 120_000)
    return () => clearTimeout(notifRef.current)
  }, [idsKey]) // eslint-disable-line

  // Cursor follower
  useEffect(() => {
    if (!cursorPet) return
    const move = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [cursorPet])

  function toggleCursor(id) { setCursorPet(p => (p === id ? null : id)) }

  const level  = petLevel(sessions)
  const xpPct  = petXP(sessions)
  const unlockedPets = allPets.filter(p =>  unlockedIds.includes(p.id))
  const lockedPets   = allPets.filter(p => !unlockedIds.includes(p.id))

  return (
    <>
      <div className="card pet-card">
        <h3 className="card-title">Garden Friends</h3>

        {unlockedPets.length === 0 ? (
          <p className="habitat-empty">Complete a session to meet your first friend!</p>
        ) : null}

        <div className={`pet-scene-grid ${isWorking ? 'is-working' : ''}`}>
          {unlockedPets.map((pet, i) => {
            const isCursor = cursorPet === pet.id
            return (
              <div
                key={pet.id}
                className={`pet-scene-card ${isCursor ? 'cursor-active' : ''}`}
                onMouseEnter={() => setHoveredPet(pet.id)}
                onMouseLeave={() => setHoveredPet(null)}
                onClick={() => toggleCursor(pet.id)}
              >
                <div className="scene-card-grass" />
                <div
                  className="scene-card-pet"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <img src={PET_IMAGES[pet.id]} alt={pet.name} className="pet-img" />
                  <span className="scene-card-name">{pet.name}</span>
                </div>
                {isCursor && <span className="scene-cursor-hint">following!</span>}

                {hoveredPet === pet.id && (
                  <div className="pet-modal">
                    <div className="pet-modal-header">
                      <img src={PET_IMAGES[pet.id]} alt={pet.name} className="pet-modal-img" />
                      <div>
                        <p className="pet-modal-name">{pet.name.toUpperCase()}</p>
                        <p className="pet-modal-level">LVL {level}</p>
                      </div>
                    </div>
                    <div className="pet-modal-xp-row">
                      <span className="pet-modal-xp-label">XP</span>
                      <div className="pet-modal-xp-bar">
                        <div className="pet-modal-xp-fill" style={{ width: `${xpPct}%` }} />
                      </div>
                      <span className="pet-modal-xp-pct">{Math.round(xpPct)}%</span>
                    </div>
                    <div className="pet-modal-stats">
                      {PET_STATS[pet.id]?.map(([label, val]) => (
                        <div key={label} className="pet-modal-stat">
                          <span className="pet-modal-stat-label">{label}</span>
                          <div className="pet-modal-stat-bar">
                            <div className="pet-modal-stat-fill" style={{ width: `${val}%` }} />
                          </div>
                          <span className="pet-modal-stat-val">{val}</span>
                        </div>
                      ))}
                    </div>
                    <p className="pet-modal-quote">{PET_QUOTES[pet.id]}</p>
                    <p className="pet-modal-hint">click to {isCursor ? 'release' : 'set as cursor'}</p>
                  </div>
                )}
              </div>
            )
          })}

          {lockedPets.map(pet => {
            const left = pet.threshold - sessions
            return (
              <div key={pet.id} className="pet-scene-card locked-card">
                <div className="scene-card-grass" />
                <div className="scene-card-pet scene-locked-pet">
                  <img src={PET_IMAGES[pet.id]} alt="" className="pet-img" />
                  <span className="scene-card-name locked-count">{left > 0 ? `${left} more` : 'Soon!'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {cursorPet && (
        <img
          src={PET_IMAGES[cursorPet]}
          alt="cursor pet"
          className="cursor-pet"
          style={{ left: mousePos.x + 16, top: mousePos.y + 16 }}
        />
      )}
    </>
  )
}
