// ── SIDEWORK SHARED UI COMPONENTS ────────────────────────────────────
// Small, reusable building blocks used across multiple pages.
// Keep these pure — no page-specific logic or data.
// ─────────────────────────────────────────────────────────────────────
import { C } from '../constants'

// ── Topbar / Nav ──────────────────────────────────────────────────────
export function Topbar({ right }) {
  return (
    <div style={{
      background: C.navyMid, borderBottom: `1px solid ${C.navyBorder}`,
      height: 52, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 28px',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Logo />
      {right}
    </div>
  )
}

// ── Logo ──────────────────────────────────────────────────────────────
export function Logo({ onClick }) {
  return (
    <div onClick={onClick} style={{
      fontFamily: 'Syne, sans-serif', fontWeight: 800,
      fontSize: '1.05rem', letterSpacing: '0.04em',
      display: 'flex', alignItems: 'center', gap: 8,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: C.orange, boxShadow: `0 0 8px ${C.orange}`,
        display: 'inline-block', flexShrink: 0,
      }} />
      sidework
    </div>
  )
}

// ── Buttons ───────────────────────────────────────────────────────────
export function BtnPrimary({ children, onClick, disabled, loading, fullWidth, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: fullWidth ? '100%' : 'auto',
        background: disabled || loading ? C.navyBorder : C.orange,
        border: 'none',
        color: disabled || loading ? C.muted : C.white,
        padding: '13px 26px', borderRadius: 11,
        fontFamily: 'Syne, sans-serif', fontSize: '0.9rem',
        fontWeight: 700, letterSpacing: '0.02em',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        boxShadow: disabled || loading ? 'none' : '0 3px 14px rgba(255,92,40,0.35)',
        transition: 'all 0.18s',
        display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        ...style,
      }}
    >
      {loading ? <><Spinner /> Just a sec...</> : children}
    </button>
  )
}

export function BtnGhost({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: `1px solid ${C.navyBorder}`,
        color: C.muted, padding: '12px 22px', borderRadius: 11,
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem',
        cursor: 'pointer', transition: 'all 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ── Form fields ───────────────────────────────────────────────────────
export function Field({ label, hint, required, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.58rem',
        color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase',
        marginBottom: 6, display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap',
      }}>
        {label}
        {required && <span style={{ color: C.orange }}>*</span>}
        {hint && <span style={{ fontSize: '0.56rem', color: 'rgba(138,155,176,0.55)', textTransform: 'none', letterSpacing: 0, fontFamily: 'DM Sans, sans-serif' }}>— {hint}</span>}
      </div>
      {children}
    </div>
  )
}

export function TextInput({ value, onChange, placeholder, type = 'text', error }) {
  return (
    <>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', minWidth: 0,
          background: C.navy, border: `1.5px solid ${error ? '#EF4444' : C.navyBorder}`,
          borderRadius: 10, padding: '11px 14px',
          color: C.white, fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.88rem', transition: 'border-color 0.18s',
        }}
      />
      {error && <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: '#FCA5A5', marginTop: 5 }}>{error}</div>}
    </>
  )
}

export function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      style={{
        width: '100%', minWidth: 0,
        background: C.navy, border: `1.5px solid ${C.navyBorder}`,
        borderRadius: 10, padding: '11px 14px',
        color: C.white, fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.88rem', lineHeight: 1.65,
        resize: 'vertical', transition: 'border-color 0.18s',
      }}
    />
  )
}

// ── Chip selector ─────────────────────────────────────────────────────
export function ChipGroup({ options, selected, onToggle, wrap, dimUnselected }) {
  return (
    <div style={{ display: 'flex', flexWrap: wrap ? 'wrap' : 'nowrap', gap: 7, overflowX: wrap ? 'visible' : 'auto', paddingBottom: 2 }}>
      {options.map(opt => {
        const active = selected.includes(opt)
        const dimmed = dimUnselected && !active
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            style={{
              background: active ? C.orangeGlow : 'transparent',
              border: `1px solid ${active ? C.orange : dimmed ? 'rgba(42,63,85,0.5)' : C.navyBorder}`,
              color: active ? C.orange : dimmed ? 'rgba(138,155,176,0.35)' : C.muted,
              padding: '5px 12px', borderRadius: 20,
              fontFamily: 'DM Mono, monospace', fontSize: '0.62rem',
              cursor: 'pointer', letterSpacing: '0.04em',
              whiteSpace: 'nowrap', transition: 'all 0.15s',
              flexShrink: 0, opacity: dimmed ? 0.5 : 1,
            }}
          >
            {active && '✓ '}{opt}
          </button>
        )
      })}
    </div>
  )
}

// ── Card wrapper ─────────────────────────────────────────────────────
export function Card({ children, highlight, style = {} }) {
  return (
    <div style={{
      background: highlight
        ? `linear-gradient(135deg, ${C.navyCard} 0%, rgba(255,92,40,0.07) 100%)`
        : C.navyCard,
      border: `1px solid ${highlight ? 'rgba(255,92,40,0.25)' : C.navyBorder}`,
      borderRadius: 14, padding: '22px 24px', marginBottom: 16,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────────
export function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'DM Mono, monospace', fontSize: '0.58rem',
      color: C.orange, letterSpacing: '0.2em', textTransform: 'uppercase',
      marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
      <span style={{ flex: 1, height: 1, background: C.navyBorder, display: 'inline-block' }} />
    </div>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────
export function Avatar({ initials, color, size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color || `linear-gradient(135deg, ${C.orange}, #c0392b)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Syne, sans-serif', fontWeight: 800,
      fontSize: size * 0.32, color: C.white,
      flexShrink: 0, letterSpacing: '0.02em',
    }}>
      {initials}
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────
export function Badge({ children, color = C.orange }) {
  return (
    <span style={{
      background: `${color}20`, border: `1px solid ${color}40`,
      color, fontFamily: 'DM Mono, monospace',
      fontSize: '0.55rem', fontWeight: 700,
      padding: '2px 7px', borderRadius: 4, letterSpacing: '0.06em',
    }}>
      {children}
    </span>
  )
}

// ── Guest check receipt visual ────────────────────────────────────────
// Reusable across evaluator results, profile, and homepage teaser.
export function GuestCheck({ name, role, years, status, skills, transferValue }) {
  return (
    <div style={{
      background: C.cream, color: C.ink,
      borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
    }}>
      {/* Header */}
      <div style={{ background: C.ink, padding: '16px 22px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: C.cream, letterSpacing: '0.1em' }}>sidework</div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.55rem', color: 'rgba(250,248,244,0.4)', letterSpacing: '0.2em', marginTop: 3 }}>CANDIDATE SKILLS CHECK</div>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 22px', borderBottom: `1px solid ${C.receiptRule}`, background: 'rgba(26,22,18,0.04)', flexWrap: 'wrap', gap: 6 }}>
        {[['ROLE', role || '—'], ['EXP', years || '—'], ['STATUS', status || 'READY']].map(([l, v]) => (
          <div key={l} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: C.receiptFade, letterSpacing: '0.06em' }}>
            {l}<strong style={{ display: 'block', color: C.ink, marginTop: 2, fontSize: '0.64rem' }}>{v}</strong>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={{ padding: '16px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', color: C.receiptFade, letterSpacing: '0.12em', textTransform: 'uppercase', paddingBottom: 7, borderBottom: `1px solid ${C.receiptRule}`, marginBottom: 4 }}>
          <span>SKILL</span><span>LEVEL</span>
        </div>
        {(skills || []).map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 0', borderBottom: `1px dotted ${C.receiptRule}`, gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: C.ink, fontFamily: 'DM Sans, sans-serif' }}>{s.raw || s.corporate}</div>
              {s.note && <div style={{ fontSize: '0.63rem', color: C.receiptFade, fontStyle: 'italic', marginTop: 1 }}>{s.note}</div>}
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.63rem', color: C.ink, whiteSpace: 'nowrap', paddingTop: 2, fontWeight: 500 }}>{s.level}</div>
          </div>
        ))}

        {/* Totals */}
        <div style={{ paddingTop: 10, marginTop: 4, borderTop: `2px solid ${C.ink}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Mono, monospace', fontSize: '0.63rem', color: C.receiptFade, padding: '3px 0' }}>
            <span>TRANSFERABLE VALUE</span><span>{transferValue || 'HIGH'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Mono, monospace', fontSize: '0.77rem', color: C.ink, fontWeight: 700, borderTop: `1px solid ${C.receiptRule}`, paddingTop: 7, marginTop: 5 }}>
            <span>TOTAL WORTH</span><span>PRICELESS</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: C.ink, color: C.cream, padding: '10px 22px', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: '0.57rem', letterSpacing: '0.14em', opacity: 0.9 }}>
        IT'S LAST CALL. NOW WHAT? — SIDEWORK.IO
      </div>
    </div>
  )
}

// ── Loading spinner ───────────────────────────────────────────────────
export function Spinner() {
  return <span style={{ animation: 'spin 0.7s linear infinite', display: 'inline-block' }}>↻</span>
}

// ── Empty state ───────────────────────────────────────────────────────
export function EmptyState({ icon = '🍽', title, body, action }) {
  return (
    <div style={{
      background: C.navyCard, border: `1px dashed ${C.navyBorder}`,
      borderRadius: 14, padding: '48px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{title}</div>
      {body && <div style={{ fontSize: '0.8rem', color: C.muted, marginBottom: action ? 20 : 0, lineHeight: 1.6 }}>{body}</div>}
      {action}
    </div>
  )
}
