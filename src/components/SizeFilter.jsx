import React from 'react'

export default function SizeFilter({ minMB, onChange, count, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
      <span style={{ color: 'var(--text3)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Filter</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--text2)', fontSize: 11 }}>min size</span>
        <div style={{ position: 'relative' }}>
          <input
            type="number"
            min="0"
            value={minMB}
            onChange={e => onChange(Number(e.target.value))}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              width: 80,
              background: 'var(--bg3)',
              border: '1px solid var(--border2)',
              color: 'var(--amber)',
              padding: '4px 28px 4px 8px',
              outline: 'none',
              appearance: 'none'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--amber)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          />
          <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: 10, pointerEvents: 'none' }}>MB</span>
        </div>
      </div>
      <span style={{ color: 'var(--text3)', fontSize: 11, marginLeft: 'auto' }}>
        showing <span style={{ color: 'var(--text)' }}>{count}</span> / <span style={{ color: 'var(--text2)' }}>{total}</span> results
      </span>
    </div>
  )
}
