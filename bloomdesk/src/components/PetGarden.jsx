export default function PetGarden({ allPets, unlockedIds, sessions, isWorking }) {
  return (
    <div className="card pet-card">
      <h3 className="card-title">Garden Friends</h3>
      <div className="pet-grid">
        {allPets.map(pet => {
          const unlocked = unlockedIds.includes(pet.id)
          const sessionsLeft = pet.threshold - sessions
          return (
            <div
              key={pet.id}
              className={`pet-slot ${unlocked ? 'unlocked' : 'locked'} ${unlocked && isWorking ? 'happy' : ''}`}
              title={unlocked ? `${pet.name} — ${pet.desc}` : `Unlock in ${sessionsLeft} session${sessionsLeft !== 1 ? 's' : ''}`}
            >
              {unlocked ? (
                <>
                  <span className="pet-emoji">{pet.emoji}</span>
                  <span className="pet-name">{pet.name}</span>
                </>
              ) : (
                <>
                  <span className="pet-emoji locked-emoji">?</span>
                  <span className="pet-name locked-name">
                    {sessionsLeft > 0 ? `${sessionsLeft} more` : 'Soon!'}
                  </span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
