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
    <>
      <svg style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="wc" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.015 0.025"
              numOctaves="3"
              seed="7"
              result="turb"
            >
              <animate
                attributeName="baseFrequency"
                values="0.015 0.025;0.019 0.021;0.013 0.029;0.017 0.023;0.015 0.025"
                dur="13s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feColorMatrix
              in="turb"
              type="matrix"
              values="0 0 0 0 0.15
                      0 0 0 0 0.88
                      0 0 0 0 1
                      28 0 0 0 -12"
            />
          </filter>
        </defs>
      </svg>

      <div
        className={[
          'water-overlay',
          restless && 'water-restless',
          desperate && 'water-desperate',
        ].filter(Boolean).join(' ')}
        style={{ '--r': radius, '--intensity': intensity.toFixed(3) }}
        aria-hidden="true"
      >
        <div className="water-caustics" />
        {desperate && <p className="water-demand">🌊 take a break</p>}
      </div>
    </>
  )
}
