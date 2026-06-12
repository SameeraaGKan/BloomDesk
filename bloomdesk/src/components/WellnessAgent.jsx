import { useState, useEffect } from 'react'
import Anthropic from '@anthropic-ai/sdk'

export default function WellnessAgent({ sessions, totalMinutes, justFinishedSession, apiKey, onApiKeyChange }) {
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [keyDraft, setKeyDraft] = useState(apiKey || '')

  useEffect(() => {
    if (justFinishedSession && apiKey) {
      generateBreakTip()
    }
  }, [justFinishedSession])

  async function generateBreakTip() {
    if (!apiKey) return
    setLoading(true)
    setMessage(null)
    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
      const fatigueLevel = sessions >= 8 ? 'high' : sessions >= 4 ? 'moderate' : 'low'
      const resp = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 120,
        messages: [{
          role: 'user',
          content: `You are a warm, fun wellness buddy in a cute garden productivity app called BloomDesk.
The user just completed session #${sessions} (${totalMinutes} total focus minutes today, fatigue level: ${fatigueLevel}).
Give them ONE specific, actionable break tip in 1-2 short sentences. Be playful and encouraging. Mention the garden/plants/pets vibe if it fits naturally. No emojis in the tip itself.`
        }]
      })
      setMessage(resp.content[0].text.trim())
    } catch (e) {
      setMessage('Great session! Step away from your screen for a few minutes — your garden will be here when you return.')
    }
    setLoading(false)
  }

  async function askAgent(question) {
    if (!apiKey || !question.trim()) return
    setLoading(true)
    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
      const resp = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: `You are a caring wellness buddy in a garden productivity app called BloomDesk.
The user has done ${sessions} sessions today (${totalMinutes} min of focus). They ask: "${question}"
Answer warmly in 2-3 sentences. Be specific and practical. Garden/plant metaphors welcome but not forced.`
        }]
      })
      setMessage(resp.content[0].text.trim())
    } catch (e) {
      setMessage("I couldn't connect right now, but you're doing great! Remember to breathe.")
    }
    setLoading(false)
  }

  function handleChat(e) {
    e.preventDefault()
    if (!chatInput.trim()) return
    askAgent(chatInput)
    setChatInput('')
  }

  function saveKey() {
    onApiKeyChange(keyDraft.trim())
    setShowSettings(false)
  }

  return (
    <div className="card agent-card">
      <div className="agent-header">
        <span className="agent-title">🤖 Bloom Buddy</span>
        <button className="agent-settings-btn" onClick={() => setShowSettings(s => !s)} title="Settings">
          ⚙
        </button>
      </div>

      {showSettings && (
        <div className="agent-settings">
          <p className="settings-hint">Add your Anthropic API key for personalized break tips.</p>
          <input
            className="api-key-input"
            type="password"
            placeholder="sk-ant-..."
            value={keyDraft}
            onChange={e => setKeyDraft(e.target.value)}
          />
          <button className="btn-primary small" style={{ background: '#5a9e6f' }} onClick={saveKey}>
            Save
          </button>
        </div>
      )}

      {!apiKey && !showSettings && (
        <p className="agent-hint">
          Add an API key above to get AI-powered break reminders after each session.
        </p>
      )}

      {loading && (
        <div className="agent-loading">
          <span className="dot-bounce">●</span>
          <span className="dot-bounce delay1">●</span>
          <span className="dot-bounce delay2">●</span>
        </div>
      )}

      {message && !loading && (
        <div className="agent-message">
          <span className="agent-emoji">🌿</span>
          <p>{message}</p>
        </div>
      )}

      {!message && !loading && apiKey && sessions === 0 && (
        <p className="agent-hint">Finish your first session and I'll give you a personalized break tip!</p>
      )}

      {apiKey && (
        <form className="agent-chat" onSubmit={handleChat}>
          <input
            className="chat-input"
            type="text"
            placeholder="Ask me anything... (how to recharge, stretch tips...)"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            disabled={loading}
          />
          <button className="chat-send" type="submit" disabled={loading || !chatInput.trim()}>
            →
          </button>
        </form>
      )}
    </div>
  )
}
