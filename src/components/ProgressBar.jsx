import React from 'react'

export default function ProgressBar({ scanned, total, found, searching }) {
  const pct = total > 0 ? Math.min((scanned / total) * 100, 100) : 0

  if (!searching && scanned === 0) return null

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: 'var(--text2)', fontSize: 11 }}>
        <span>
          <span style={{ color: 'var(--amber)' }}>{scanned.toLocaleString()}</span>
          {total > 0 && <span> / {total.toLocaleString()} folders scanned</span>}
        </span>
        {found > 0 && <span style={{ color: 'var(--green)' }}>◆ {found} found</span>}
      </div>
      <div style={{ height: 2, background: 'var(--bg3)', borderRadius: 1, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: pct + '%',
          background: searching
            ? 'linear-gradient(90deg, var(--amber), var(--amber2))'
            : 'var(--green)',
          transition: 'width 0.2s ease',
          boxShadow: searching ? '0 0 8px var(--amber-glow)' : 'none'
        }} />
      </div>
    </div>
  )
}
