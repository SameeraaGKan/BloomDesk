import { useEffect, useState } from 'react'

export default function WaterOverlay({ elapsed, isWorking }) {
  const [everStarted, setEverStarted] = useState(false)

  useEffect(() => {
    if (isWorking) setEverStarted(true)
  }, [isWorking])

  if (!everStarted) return null

  const intensity = Math.min(elapsed / 3600, 1)
  const radius = isWorking ? `${(2 + intensity * 148).toFixed(1)}vmax` : '0px'
  const mins = Math.floor(elapsed / 60)
  const desperate = mins >= 50
  const restless = mins >= 25

  return (
    <div
      className={[
        'water-overlay',
        restless && 'water-restless',
        desperate && 'water-desperate',
      ].filter(Boolean).join(' ')}
      style={{ '--r': radius, '--intensity': intensity.toFixed(3) }}
      aria-hidden="true"
    >
      <div className="water-shimmer" />
      <div className="water-ripple wr1" />
      <div className="water-ripple wr2" />
      <div className="water-ripple wr3" />
      {desperate && <p className="water-demand">🌊 take a break</p>}
    </div>
  )
}
