import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import '../landing.css'

const FEATURES = [
  {
    icon: '🌿',
    title: 'A plant that grows with you',
    desc: 'Every completed focus session waters your plant. Watch it evolve from a seedling into a towering tree.',
  },
  {
    icon: '🐾',
    title: 'Collect garden companions',
    desc: 'Unlock adorable pets — frogs, cats, bunnies, penguins, and a legendary dragon — as your session count climbs.',
  },
  {
    icon: '🌊',
    title: 'Water that reminds you to breathe',
    desc: 'Push too long without a break? A pool of water rises across your screen until you rest. Gorgeous and relentless.',
  },
  {
    icon: '🤖',
    title: 'An AI wellness companion',
    desc: 'Bloom Buddy checks in after every session with encouragement, micro-challenges, and honest mood insights.',
  },
]

const STEPS = [
  { icon: '⏱️', title: 'Set your timer', desc: 'Pick any duration from 5 minutes to a deep 90-minute block.' },
  { icon: '🧠', title: 'Focus fully', desc: 'BloomDesk sits quietly while you do your best work.' },
  { icon: '🌸', title: 'Watch it bloom', desc: 'Finish the session, water your plant, and catch up with Bloom Buddy.' },
]

const STREAK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [authTab, setAuthTab] = useState('signup')

  function openSignup() { setAuthTab('signup'); setShowAuth(true) }
  function openSignin() { setAuthTab('signin'); setShowAuth(true) }

  return (
    <div className="landing">

      {/* ── Nav ── */}
      <nav className="land-nav">
        <div className="land-logo">🌿 BloomDesk</div>
        <button className="land-nav-btn" onClick={openSignin}>Sign In</button>
      </nav>

      {/* ── Hero ── */}
      <section className="land-hero">
        <div className="land-hero-bg">
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
          <div className="hero-orb orb3" />
        </div>

        <div className="land-hero-content">
          <div className="hero-badge">🌱 your garden grows with your focus</div>
          <h1 className="hero-title">
            Focus, flow,<br />
            <span className="hero-title-accent">watch things bloom.</span>
          </h1>
          <p className="hero-sub">
            BloomDesk turns your work sessions into a living garden — complete timers,
            grow your plant, collect pets, and let rising water tell you when it's time
            to breathe.
          </p>
          <div className="hero-cta-row">
            <button className="btn-hero-primary" onClick={openSignup}>
              Start your garden
            </button>
            <button className="btn-hero-ghost" onClick={openSignin}>
              I have an account
            </button>
          </div>
        </div>

        <div className="hero-visual">
          {/* SVG filter for the hero water caustic preview */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <filter id="wc-hero" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                <feTurbulence type="turbulence" baseFrequency="0.022 0.038" numOctaves="3" seed="3" result="turb">
                  <animate
                    attributeName="baseFrequency"
                    values="0.022 0.038;0.026 0.032;0.019 0.042;0.022 0.038"
                    dur="9s"
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

          <div className="hero-visuals-stack">
            {/* Live water caustic pool */}
            <div className="hero-water-pool">
              <div className="hero-pool-caustic" />
              <p className="hero-pool-label">🌊 take a break</p>
            </div>

            {/* Floating plant */}
            <div className="hero-plant-wrap">
              <span className="hero-plant">🌳</span>
              <div className="hero-ring r1" />
              <div className="hero-ring r2" />
              <div className="hero-ring r3" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="land-features">
        <h2 className="land-section-title">More than a timer</h2>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Streak ── */}
      <section className="land-streak">
        <div className="streak-content">
          <span className="streak-flame">🔥</span>
          <h2>Build your streak</h2>
          <p>
            Come back every day and keep the chain going. BloomDesk tracks your
            consecutive days of focused work — and saves your all-time best.
          </p>
          <div className="streak-demo">
            {STREAK_DAYS.map((d, i) => (
              <div key={i} className={`streak-day ${i < 5 ? 'active' : ''}`}>
                {d}
              </div>
            ))}
          </div>
          <p className="streak-demo-caption">5-day streak — keep it going!</p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="land-how">
        <h2 className="land-section-title">How it works</h2>
        <div className="how-steps">
          {STEPS.map((s, i) => (
            <div key={i} className="how-step">
              <div className="step-num">{i + 1}</div>
              <span className="step-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="land-cta">
        <div className="cta-orb-bg" />
        <h2>Your garden is waiting.</h2>
        <p>Free to start. No credit card needed.</p>
        <button className="btn-hero-primary btn-cta-large" onClick={openSignup}>
          Plant your first seed 🌱
        </button>
      </section>

      <footer className="land-footer">
        <p>
          © {new Date().getFullYear()}{' '}
          <a href="https://sameeraagkan.github.io/" target="_blank" rel="noreferrer">
            Sameeraa GKan
          </a>
        </p>
      </footer>

      {showAuth && <AuthModal initialTab={authTab} onClose={() => setShowAuth(false)} />}
    </div>
  )
}
