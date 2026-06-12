import { useState, useEffect, useRef } from 'react'

const MODES = {
  work:  { label: 'Focus', defaultMins: 25, color: '#5a9e6f' },
  break: { label: 'Break', defaultMins: 5,  color: '#5b9bd5' },
}

const WORK_PRESETS  = [5, 10, 25, 50, 90]
const BREAK_PRESETS = [5, 10, 15, 20]

const RADIUS = 72
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function Timer({ onSessionComplete, onWorkingChange, onElapsedChange }) {
  const [mode, setMode]           = useState('work')
  const [duration, setDuration]   = useState(MODES.work.defaultMins * 60)
  const [secondsLeft, setSeconds] = useState(MODES.work.defaultMins * 60)
  const [running, setRunning]     = useState(false)
  const [customVal, setCustomVal] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    onWorkingChange?.(running && mode === 'work')
  }, [running, mode])

  useEffect(() => {
    onElapsedChange?.(running && mode === 'work' ? duration - secondsLeft : 0)
  }, [secondsLeft, running, mode])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          if (mode === 'work') onSessionComplete(Math.round(duration / 60))
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, mode, duration])

  function switchMode(m) {
    clearInterval(intervalRef.current)
    setRunning(false)
    setMode(m)
    const secs = MODES[m].defaultMins * 60
    setDuration(secs)
    setSeconds(secs)
    setCustomVal('')
  }

  function applyPreset(mins) {
    if (running) return
    const secs = mins * 60
    setDuration(secs)
    setSeconds(secs)
    setCustomVal('')
  }

  function applyCustom(raw) {
    const m = parseInt(raw, 10)
    if (!raw || isNaN(m) || m < 1 || m > 180) return
    applyPreset(m)
  }

  function toggleRun() { setRunning(r => !r) }

  function reset() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setSeconds(duration)
  }

  const progress    = secondsLeft / duration
  const dashOffset  = CIRCUMFERENCE * (1 - progress)
  const color       = MODES[mode].color
  const mm          = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss          = String(secondsLeft % 60).padStart(2, '0')
  const hasStarted  = secondsLeft < duration
  const presets     = mode === 'work' ? WORK_PRESETS : BREAK_PRESETS
  const currentMins = duration / 60

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
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="rgba(90,158,111,0.2)" strokeWidth="10" />
          <circle
            cx="90" cy="90" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 90 90)"
            style={{ transition: running ? 'stroke-dashoffset 0.8s linear' : 'none' }}
          />
        </svg>
        <div className="ring-label">
          <span className="ring-time">{mm}:{ss}</span>
          <span className="ring-mode">{MODES[mode].label}</span>
        </div>
      </div>

      <div className="timer-controls">
        <button className="btn-primary" onClick={toggleRun} style={{ background: color }}>
          {running ? '⏸ Pause' : hasStarted ? '▶ Resume' : '▶ Start'}
        </button>
        <button className="btn-ghost" onClick={reset} disabled={running}>↺</button>
      </div>

      {!running && (
        <div className="duration-picker">
          <span className="picker-label">Duration</span>
          <div className="picker-row">
            {presets.map(m => (
              <button
                key={m}
                className={`preset-btn ${currentMins === m ? 'active' : ''}`}
                style={currentMins === m ? { background: color, color: '#fff', borderColor: color } : {}}
                onClick={() => applyPreset(m)}
              >
                {m}m
              </button>
            ))}
            <input
              className="custom-min-input"
              type="number"
              min="1"
              max="180"
              placeholder="?"
              value={customVal}
              onChange={e => setCustomVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyCustom(e.target.value)}
              onBlur={e => applyCustom(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
