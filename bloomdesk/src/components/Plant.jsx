const STAGES = [
  { min: 0,  emoji: '🌰', name: 'Seed',        sub: 'Complete a session to sprout!' },
  { min: 1,  emoji: '🌱', name: 'Sprout',       sub: 'Something tiny is growing...' },
  { min: 3,  emoji: '🌿', name: 'Leafy',        sub: 'Leaves unfurling nicely!' },
  { min: 6,  emoji: '🪴', name: 'Potted',       sub: 'Growing proud in its pot!' },
  { min: 10, emoji: '🌸', name: 'Flowering',    sub: 'Beautiful blooms appearing!' },
  { min: 15, emoji: '🌺', name: 'Full Bloom',   sub: 'Your garden is magnificent!' },
]

export default function Plant({ water, justWatered }) {
  const stage = [...STAGES].reverse().find(s => water >= s.min) ?? STAGES[0]
  const stageIdx = STAGES.indexOf(stage)
  const nextStage = STAGES[stageIdx + 1]
  const pct = nextStage
    ? Math.round(((water - stage.min) / (nextStage.min - stage.min)) * 100)
    : 100

  return (
    <div className="card plant-card">
      <div className={`plant-emoji-wrap ${justWatered ? 'watered' : ''}`}>
        <div className="plant-emoji">{stage.emoji}</div>
        {justWatered && <div className="water-splash">💧💧💧</div>}
      </div>

      <div className="plant-info">
        <span className="plant-name">{stage.name}</span>
        <span className="plant-sub">{stage.sub}</span>
      </div>

      {nextStage && (
        <div className="plant-progress">
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="prog-label">
            {water}/{nextStage.min} 💧 → {nextStage.name}
          </span>
        </div>
      )}

      {!nextStage && (
        <div className="plant-maxed">🏆 Garden fully bloomed!</div>
      )}

      <div className="water-count">
        {'💧'.repeat(Math.min(water, 10))}{water > 10 ? ` +${water - 10}` : ''}
      </div>
    </div>
  )
}
