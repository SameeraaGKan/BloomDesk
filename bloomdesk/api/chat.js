import Groq from 'groq-sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body
  if (!messages) return res.status(400).json({ error: 'messages required' })

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const resp = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 160,
      messages,
    })
    res.json({ content: resp.choices[0].message.content.trim() })
  } catch {
    res.status(500).json({ error: 'upstream error' })
  }
}
