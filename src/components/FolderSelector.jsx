import React from 'react'

export default function FolderSelector({ folder, onSelect, disabled }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        onClick={onSelect}
        disabled={disabled}
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background: 'transparent',
          border: '1px solid var(--amber)',
          color: 'var(--amber)',
          padding: '8px 18px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.15s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={e => { if (!disabled) { e.target.style.background = 'var(--amber-dim)'; e.target.style.boxShadow = '0 0 12px var(--amber-glow)' }}}
        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none' }}
      >
        ▶ SELECT ROOT
      </button>
      <span style={{ color: folder ? 'var(--text2)' : 'var(--text3)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}>
        {folder || '// no folder selected'}
      </span>
    </div>
  )
}
