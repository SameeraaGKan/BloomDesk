import { useEffect, useState } from 'react'

export default function WaterOverlay({ elapsed, isWorking }) {
  const [everStarted, setEverStarted] = useState(false)

  useEffect(() => {
    if (isWorking) setEverStarted(true)
  }, [isWorking])

  if (!everStarted) return null

  const intensity = Math.min(elapsed / 3600, 1)
  const height = isWorking ? `${(intensity * 100).toFixed(1)}%` : '0%'
  const mins = Math.floor(elapsed / 60)
  const desperate = mins >= 50
  const restless = mins >= 25

  return (
    <>
      {/* Animated wave surface — sits at the rising water line */}
      <div
        className="water-wave-cap"
        style={{ '--h': height }}
        aria-hidden="true"
      >
        <svg className="wcap-svg wcap-back" viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path
            d="M0,35 C120,65 240,5 360,35 C480,65 600,5 720,35 C840,65 960,5 1080,35 C1200,65 1320,5 1440,35 L1440,70 L0,70 Z"
            fill="rgba(0,100,180,0.35)"
          />
        </svg>
        <svg className="wcap-svg wcap-front" viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path
            d="M0,45 C100,15 260,60 440,38 C620,15 780,60 980,40 C1100,25 1280,55 1440,38 L1440,70 L0,70 Z"
            fill="rgba(0,150,220,0.50)"
          />
        </svg>
      </div>

      {/* Water body — rises from bottom */}
      <div
        className={[
          'water-overlay',
          restless && 'water-restless',
          desperate && 'water-desperate',
        ].filter(Boolean).join(' ')}
        style={{ '--h': height, '--intensity': intensity.toFixed(3) }}
        aria-hidden="true"
      >
        {desperate && <p className="water-demand">🌊 take a break</p>}
      </div>
    </>
  )
}
