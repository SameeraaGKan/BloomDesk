import { useState, useEffect, useRef } from 'react'

const MODES = {
  work:  { label: 'Focus', minutes: 25, color: '#5a9e6f' },
  break: { label: 'Break', minutes: 5,  color: '#5b9bd5' },
}

const RADIUS = 58
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function Timer({ onSessionComplete, onWorkingChange }) {
  const [mode, setMode] = useState('work')
  const [secondsLeft, setSecondsLeft] = useState(MODES.work.minutes * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    onWorkingChange?.(running && mode === 'work')
  }, [running, mode])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          if (mode === 'work') onSessionComplete(MODES.work.minutes)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  function switchMode(m) {
    clearInterval(intervalRef.current)
    setRunning(false)
    setMode(m)
    setSecondsLeft(MODES[m].minutes * 60)
  }

  function toggleRun() { setRunning(r => !r) }

  function reset() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setSecondsLeft(MODES[mode].minutes * 60)
  }

  const totalSecs = MODES[mode].minutes * 60
  const progress = secondsLeft / totalSecs
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const color = MODES[mode].color
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const hasStarted = secondsLeft < totalSecs

  return (
    <div className="card timer-card">
      <div className="mode-tabs">
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            className={`mode-tab ${mode === key ? 'active' : ''}`}
            style={mode === key ? { background: val.color } : {}}
            onClick={() => switchMode(key)}
          >
            {val.label}
          </button>
        ))}
      </div>

      <div className="ring-wrap">
        <svg width="148" height="148" viewBox="0 0 148 148">
          <circle cx="74" cy="74" r={RADIUS} fill="none" stroke="#e8e0d5" strokeWidth="9" />
          <circle
            cx="74" cy="74" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 74 74)"
            style={{ transition: running ? 'stroke-dashoffset 0.8s linear' : 'none' }}
          />
        </svg>
        <div className="ring-label">
          <span className="ring-time">{mm}:{ss}</span>
          <span className="ring-mode">{MODES[mode].label}</span>
        </div>
      </div>

      <div className="timer-controls">
        <button
          className="btn-primary"
          onClick={toggleRun}
          style={{ background: color }}
        >
          {running ? '⏸ Pause' : hasStarted ? '▶ Resume' : '▶ Start'}
        </button>
        <button className="btn-ghost" onClick={reset}>↺</button>
      </div>
    </div>
  )
}
