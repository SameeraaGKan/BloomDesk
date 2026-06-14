import { useState, useEffect, useRef } from 'react'

const PET_IMAGES = {
  frog:   '/pets/frog.png',
  cat:    '/pets/cat.png',
  bunny:  '/pets/bunny.png',
  goat:   '/pets/goat.png',
  turtle: '/pets/turtle.png',
}

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
  turtle: ['🐢 Sheldon here. Slow and steady wins.', '🐢 Your consistency is genuinely impressive.', '🐢 Take breaks too. Even turtles rest. 🏠'],
}

// px moved per 50ms tick (base speed, multiplied when working)
const BASE_SPEED = { frog: 1.4, cat: 1.0, bunny: 2.2, goat: 1.6, turtle: 0.5 }
const PET_W    = 48   // rendered pet width
const MODAL_W  = 210  // modal width

function petLevel(sessions) { return Math.min(10, Math.floor(sessions / 5) + 1) }
function petXP(sessions)    { return ((sessions % 5) / 5) * 100 }

export default function PetGarden({ allPets, unlockedIds, sessions, isWorking, onNotify }) {
  const [hoveredPet, setHoveredPet] = useState(null)
  const [cursorPet,  setCursorPet]  = useState(null)
  const [mousePos,   setMousePos]   = useState({ x: -300, y: -300 })
  const [positions,  setPositions]  = useState({})
  const habitatRef = useRef(null)
  const hoveredRef = useRef(null)
  const notifRef   = useRef(null)
  const idsKey     = unlockedIds.join(',')

  // Keep a ref in sync so the walk loop can read it without stale closure
  useEffect(() => { hoveredRef.current = hoveredPet }, [hoveredPet])

  // Initialise position for any newly unlocked pet
  useEffect(() => {
    setPositions(prev => {
      const width = habitatRef.current?.offsetWidth || 280
      const next  = { ...prev }
      unlockedIds.forEach((id, i) => {
        if (!next[id]) {
          const maxX = Math.max(0, width - PET_W)
          next[id] = {
            x:         Math.min(16 + i * 64, maxX),
            vx:        (i % 2 === 0 ? 1 : -1) * BASE_SPEED[id],
            idleTicks: 0,
          }
        }
      })
      return next
    })
  }, [idsKey])

  // Walk loop — 20fps
  useEffect(() => {
    if (!unlockedIds.length) return
    const timer = setInterval(() => {
      setPositions(prev => {
        const width = habitatRef.current?.offsetWidth || 280
        const maxX  = Math.max(0, width - PET_W)
        const next  = {}
        for (const id of unlockedIds) {
          const p = prev[id]
          if (!p) continue
          // Freeze while hovered so the stat modal doesn't jitter
          if (id === hoveredRef.current) { next[id] = p; continue }
          // Tick down idle counter
          if (p.idleTicks > 0) { next[id] = { ...p, idleTicks: p.idleTicks - 1 }; continue }

          const mult = isWorking ? 2.2 : 1.0
          let { x, vx } = p
          x += vx * mult
          if (x <= 0)    { x = 0;    vx =  Math.abs(vx) }
          if (x >= maxX) { x = maxX; vx = -Math.abs(vx) }

          // Random idle pause (rare when working, more common when resting)
          const chance   = isWorking ? 0.003 : 0.014
          const idleTicks = Math.random() < chance ? 20 + Math.floor(Math.random() * 60) : 0
          next[id] = { x, vx, idleTicks }
        }
        return next
      })
    }, 50)
    return () => clearInterval(timer)
  }, [idsKey, isWorking])

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

        <div className="pet-habitat" ref={habitatRef}>
          <div className="habitat-ground" />

          {unlockedPets.length === 0 && (
            <p className="habitat-empty">Complete a session to meet your first friend!</p>
          )}

          {unlockedPets.map(pet => {
            const pos        = positions[pet.id]
            const isIdle     = !pos || pos.idleTicks > 0
            const facingLeft = pos ? pos.vx < 0 : false
            const isCursor   = cursorPet === pet.id

            // Clamp modal so it doesn't overflow habitat edges
            const habitatW = habitatRef.current?.offsetWidth || 280
            const petCX    = (pos?.x ?? 0) + PET_W / 2
            const halfM    = MODAL_W / 2
            const modalDx  = petCX - halfM < 0
              ? halfM - petCX
              : petCX + halfM > habitatW
                ? habitatW - halfM - petCX
                : 0

            return (
              <div
                key={pet.id}
                className={`roaming-pet ${isCursor ? 'cursor-active' : ''}`}
                style={{ left: pos?.x ?? 0 }}
                onMouseEnter={() => setHoveredPet(pet.id)}
                onMouseLeave={() => setHoveredPet(null)}
                onClick={() => toggleCursor(pet.id)}
              >
                {/* Flip wrapper — scaleX doesn't conflict with img's translateY animation */}
                <div style={{ transform: facingLeft ? 'scaleX(-1)' : 'none' }}>
                  <img
                    src={PET_IMAGES[pet.id]}
                    alt={pet.name}
                    className={`pet-img ${isIdle ? 'pet-idle-anim' : 'pet-walk-anim'}`}
                  />
                </div>
                <span className="roaming-name">{pet.name}</span>
                {isCursor && <span className="cursor-hint">following!</span>}

                {hoveredPet === pet.id && (
                  <div
                    className="pet-modal"
                    style={{ left: `calc(50% + ${modalDx}px)` }}
                  >
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
        </div>

        {lockedPets.length > 0 && (
          <div className="locked-pets-row">
            {lockedPets.map(pet => {
              const left = pet.threshold - sessions
              return (
                <div key={pet.id} className="locked-pet-slot">
                  <span className="locked-emoji">?</span>
                  <span className="locked-name">{left > 0 ? `${left} more` : 'Soon!'}</span>
                </div>
              )
            })}
          </div>
        )}
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
