import { useState, useEffect, useRef } from 'react'
import Groq from 'groq-sdk'

const API_KEY = import.meta.env.VITE_GROQ_API_KEY
const MODEL = 'llama-3.1-8b-instant'

const SYSTEM = `You are Bloom Buddy — a witty, warm, slightly-quirky wellness companion living inside BloomDesk, a cozy garden productivity app. You have a distinct voice: playful but grounded, enthusiastic without being annoying, and genuinely caring.

Rules:
- Keep every response to 2-3 sentences MAX. Never longer.
- Be specific and actionable, not generic.
- Use garden/nature metaphors naturally when they fit — never forced.
- React to prior messages in the conversation when relevant.
- Occasionally be funny or surprising. You're allowed to have opinions.
- Never start a response with "Of course" or "Great question".`

function makeClient() {
  if (!API_KEY) return null
  return new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true })
}

export default function WellnessAgent({ sessions, totalMinutes, justFinishedSession }) {
  const [messages, setMessages] = useState([])
  const [apiHistory, setApiHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  useEffect(() => {
    if (justFinishedSession > 0 && API_KEY) autoBreakTip()
  }, [justFinishedSession])

  async function callApi(userContent) {
    const next = [...apiHistory, { role: 'user', content: userContent }]
    const resp = await makeClient().chat.completions.create({
      model: MODEL,
      max_tokens: 160,
      messages: [
        { role: 'system', content: SYSTEM },
        ...next.slice(-10),
      ]
    })
    const reply = resp.choices[0].message.content.trim()
    setApiHistory([...next, { role: 'assistant', content: reply }])
    return reply
  }

  async function autoBreakTip() {
    setLoading(true)
    try {
      const fatigue = sessions >= 8 ? 'high' : sessions >= 4 ? 'moderate' : 'low'
      const prompt = `User just finished session #${sessions} (${totalMinutes} total focus minutes today, fatigue level: ${fatigue}). Give them one specific break suggestion.`
      const reply = await callApi(prompt)
      setMessages(prev => [...prev, { role: 'buddy', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'buddy', text: 'Solid session! Your plant just had a drink — now it\'s your turn. Step away for a few minutes.' }])
    }
    setLoading(false)
  }

  async function send(text) {
    setMessages(prev => [...prev, { role: 'user', text }])
    setLoading(true)
    try {
      const reply = await callApi(text)
      setMessages(prev => [...prev, { role: 'buddy', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'buddy', text: "Can't reach the garden network right now. But seriously — breathe." }])
    }
    setLoading(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const val = chatInput.trim()
    if (!val || loading) return
    setChatInput('')
    send(val)
  }

  const SUGGESTIONS = [
    'Quick stretch for my neck?',
    'Eye rest exercise',
    'How do I beat afternoon slump?',
  ]

  if (!API_KEY) {
    return (
      <div className="card agent-card">
        <div className="agent-top">
          <span className="agent-title">🌿 Bloom Buddy</span>
        </div>
        <div className="agent-messages" ref={scrollRef}>
          <div className="agent-empty">
            <span className="agent-empty-icon">🔑</span>
            <p>Add <code>VITE_GROQ_API_KEY</code> to <code>.env</code> to wake me up.</p>
          </div>
        </div>
        <div className="agent-bottom">
          <form className="agent-chat" onSubmit={e => e.preventDefault()}>
            <input className="chat-input" placeholder="Set up API key to chat…" disabled />
            <button className="chat-send" disabled>→</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="card agent-card">
      <div className="agent-top">
        <span className="agent-title">🌿 Bloom Buddy</span>
        <span className="agent-status">{loading ? 'thinking…' : sessions > 0 ? `${sessions} session${sessions > 1 ? 's' : ''} today` : 'ready'}</span>
      </div>

      <div className="agent-messages" ref={scrollRef}>
        {messages.length === 0 && !loading && (
          <div className="agent-empty">
            <span className="agent-empty-icon">🌱</span>
            <p>{sessions === 0 ? 'Finish a session and I\'ll pop up with a tip!' : 'Ask me anything about staying sharp.'}</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.role}`}>
            {msg.role === 'buddy' && <span className="msg-avatar">🌿</span>}
            <div className="msg-bubble">{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="msg-row buddy">
            <span className="msg-avatar">🌿</span>
            <div className="msg-bubble loading-bubble">
              <span className="dot-bounce">●</span>
              <span className="dot-bounce delay1">●</span>
              <span className="dot-bounce delay2">●</span>
            </div>
          </div>
        )}
      </div>

      <div className="agent-bottom">
        <div className="agent-suggestions">
          {SUGGESTIONS.map(s => (
            <button key={s} className="suggestion-chip" onClick={() => send(s)} disabled={loading}>
              {s}
            </button>
          ))}
        </div>
        <form className="agent-chat" onSubmit={handleSubmit}>
          <input
            className="chat-input"
            type="text"
            placeholder="Ask Bloom Buddy anything…"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            disabled={loading}
          />
          <button className="chat-send" type="submit" disabled={loading || !chatInput.trim()}>→</button>
        </form>
      </div>
    </div>
  )
}
