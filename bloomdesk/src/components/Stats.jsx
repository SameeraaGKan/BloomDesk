export default function Stats({ sessions, water, totalMinutes, nextPet }) {
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  return (
    <div className="card stats-card">
      <h3 className="card-title">Today's Stats</h3>
      <div className="stat-list">
        <div className="stat-row">
          <span className="stat-icon">⏱</span>
          <span className="stat-label">Sessions</span>
          <span className="stat-val">{sessions}</span>
        </div>
        <div className="stat-row">
          <span className="stat-icon">💧</span>
          <span className="stat-label">Water drops</span>
          <span className="stat-val">{water}</span>
        </div>
        <div className="stat-row">
          <span className="stat-icon">🎯</span>
          <span className="stat-label">Focus time</span>
          <span className="stat-val">{totalMinutes > 0 ? timeStr : '—'}</span>
        </div>
      </div>

      {nextPet && (
        <div className="next-pet">
          <span className="next-pet-label">
            Next friend: {nextPet.emoji} {nextPet.name} in {nextPet.threshold - sessions} session{nextPet.threshold - sessions !== 1 ? 's' : ''}
          </span>
          <div className="prog-bar">
            <div
              className="prog-fill accent"
              style={{ width: `${Math.min((sessions / nextPet.threshold) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {!nextPet && sessions > 0 && (
        <div className="next-pet">
          <span className="next-pet-label">🏆 All friends unlocked!</span>
        </div>
      )}
    </div>
  )
}
