import React from 'react'

export default function SearchControls({ searching, folder, onSearch, onCancel, onClear, hasResults }) {
  const Btn = ({ onClick, color, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        background: 'transparent', border: `1px solid ${color}`,
        color, padding: '7px 16px', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, transition: 'all 0.15s'
      }}
      onMouseEnter={e => { if (!disabled) e.target.style.background = color + '22' }}
      onMouseLeave={e => { e.target.style.background = 'transparent' }}
    >
      {children}
    </button>
  )

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {!searching
        ? <Btn onClick={onSearch} color="var(--amber)" disabled={!folder}>⬡ SCAN</Btn>
        : <Btn onClick={onCancel} color="var(--red)">■ CANCEL</Btn>
      }
      {hasResults && !searching &&
        <Btn onClick={onClear} color="var(--text3)">✕ CLEAR</Btn>
      }
    </div>
  )
}
