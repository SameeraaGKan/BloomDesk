const STAGES = [
  { min: 0,  img: '/plants/seed.png',      name: 'Seed',        sub: 'Complete a session to sprout!' },
  { min: 1,  img: '/plants/sprout.png',    name: 'Sprout',      sub: 'Something tiny is growing...' },
  { min: 3,  img: '/plants/leafy.png',     name: 'Leafy',       sub: 'Leaves unfurling nicely!' },
  { min: 6,  img: '/plants/potted.png',    name: 'Potted',      sub: 'Growing proud in its pot!' },
  { min: 10, img: '/plants/flowering.png', name: 'Flowering',   sub: 'Beautiful blooms appearing!' },
  { min: 15, img: '/plants/bloom.png',     name: 'Full Bloom',  sub: 'Your garden is magnificent!' },
]

const STAGE_GLOW = [
  'rgba(167,139,250,0.35)',
  'rgba(52,211,153,0.35)',
  'rgba(5,150,105,0.35)',
  'rgba(5,150,105,0.35)',
  'rgba(244,114,182,0.35)',
  'rgba(251,113,133,0.38)',
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
      <div className="plant-scene">
        <div
          className="plant-glow"
          style={{ background: `radial-gradient(circle, ${STAGE_GLOW[stageIdx]} 0%, transparent 68%)` }}
        />
        <div className={`plant-emoji-wrap ${justWatered ? 'watered' : ''}`}>
          <img src={stage.img} alt={stage.name} className="plant-img" />
          {justWatered && <div className="water-splash">💧💧💧</div>}
        </div>
      </div>

      <div className="plant-info">
        <span className="plant-name">{stage.name}</span>
        <span className="plant-sub">{stage.sub}</span>
      </div>

      <div className="stage-trail">
        {STAGES.map((s, i) => (
          <div
            key={s.name}
            className={`stage-dot${i < stageIdx ? ' done' : ''}${i === stageIdx ? ' current' : ''}`}
            title={s.name}
          >
            <img src={s.img} alt={s.name} className="stage-dot-img" />
          </div>
        ))}
      </div>

      {nextStage ? (
        <div className="plant-progress">
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="prog-label">
            {water} / {nextStage.min} 💧 &rarr; {nextStage.name}
          </span>
        </div>
      ) : (
        <div className="plant-maxed">🏆 Garden fully bloomed!</div>
      )}
    </div>
  )
}
