// ── SIDEWORK SHARED CONSTANTS ────────────────────────────────────────
// Central place for values used across multiple components.
// When you change a color or route here it updates everywhere.
// ─────────────────────────────────────────────────────────────────────

// Design tokens (JS version of CSS custom properties)
export const C = {
  navy:        '#0F1923',
  navyMid:     '#172130',
  navyCard:    '#1E2D3D',
  navyBorder:  '#2A3F55',
  orange:      '#FF5C28',
  orangeL:     '#FF7A4A',
  orangeGlow:  'rgba(255,92,40,0.12)',
  muted:       '#8A9BB0',
  green:       '#22C55E',
  greenGlow:   'rgba(34,197,94,0.1)',
  amber:       '#F59E0B',
  white:       '#FFFFFF',
  cream:       '#FAF8F4',
  ink:         '#1A1612',
  receiptRule: '#E2DDD6',
  receiptFade: '#9B8E7E',
}

// App routes — update once, reflected everywhere
export const ROUTES = {
  home:       '/',
  auth:       '/auth',
  evaluator:  '/evaluate',
  profile:    '/profile',
  browse:     '/jobs',
  dashboard:  '/dashboard',
  messages:   '/messages',
  employer:   '/employer',
  pricing:    '/pricing',
}

// Anthropic API config
// NOTE: In production move the API key to a Cloudflare Worker proxy
// so it is never exposed in the browser bundle.
export const API = {
  model:   'claude-sonnet-4-20250514',
  url:     'https://api.anthropic.com/v1/messages',
  maxTokens: 1500,
}

// Shared helper: call Claude and return parsed JSON
// Pass a prompt string; returns parsed object or throws.
export async function callClaude(prompt, maxTokens = API.maxTokens) {
  const res = await fetch(API.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: API.model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  if (data.error) throw new Error(`${data.error.type}: ${data.error.message}`)

  const raw = data.content.map(b => b.text || '').join('')
  if (!raw.trim()) throw new Error('Empty response from API')

  // Robustly extract JSON — works even if model wraps in markdown
  const first = raw.indexOf('{') !== -1 ? raw.indexOf('{') : raw.indexOf('[')
  const last  = raw.lastIndexOf('}') !== -1 ? raw.lastIndexOf('}') : raw.lastIndexOf(']')
  if (first === -1 || last === -1) throw new Error(`No JSON in response: ${raw.slice(0, 200)}`)

  return JSON.parse(raw.slice(first, last + 1))
}
