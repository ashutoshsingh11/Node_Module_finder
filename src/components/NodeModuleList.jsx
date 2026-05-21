import React, { useState } from 'react'
import { formatSize } from '../services/sizeUtils.js'

function Row({ item, onDelete, permanent }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const parts = item.path.split(/[\\/]/)
  const name = parts.pop()
  const parent = parts.join('/') + '/'

  async function handleDelete() {
    setDeleting(true)
    const result = await window.electronAPI.deleteFolder(item.path, permanent)
    if (result.success) onDelete(item.path)
    else { setError(result.error); setDeleting(false) }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      borderBottom: '1px solid var(--border)',
      background: deleting ? 'var(--red-dim)' : 'transparent',
      transition: 'background 0.2s'
    }}
      onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = 'var(--bg3)' }}
      onMouseLeave={e => { if (!deleting) e.currentTarget.style.background = 'transparent' }}
    >
      <div style={{ width: 90, padding: '12px 16px', textAlign: 'right', flexShrink: 0 }}>
        <span style={{
          color: item.size > 5e8 ? 'var(--red)' : item.size > 1e8 ? 'var(--amber)' : 'var(--green)',
          fontSize: 12, fontWeight: 600
        }}>
          {formatSize(item.size)}
        </span>
      </div>

      <div style={{ flex: 1, padding: '12px 8px', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--text3)', fontSize: 11 }}>{parent}</span>
          <span style={{ color: 'var(--amber)', fontSize: 12, fontWeight: 600 }}>{name}</span>
        </div>
        {error && <div style={{ color: 'var(--red)', fontSize: 10, marginTop: 2 }}>! {error}</div>}
      </div>

      <div style={{ padding: '0 16px', flexShrink: 0 }}>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            background: 'transparent',
            border: `1px solid ${permanent ? 'var(--red)' : 'var(--border2)'}`,
            color: permanent ? 'var(--red)' : 'var(--text2)',
            padding: '4px 10px',
            cursor: deleting ? 'wait' : 'pointer',
            opacity: deleting ? 0.5 : 1, transition: 'all 0.15s'
          }}
          onMouseEnter={e => { if (!deleting) e.target.style.background = permanent ? 'var(--red-dim)' : 'var(--bg3)' }}
          onMouseLeave={e => { e.target.style.background = 'transparent' }}
        >
          {deleting ? '...' : permanent ? '⚠ DELETE' : '🗑 TRASH'}
        </button>
      </div>
    </div>
  )
}

export default function NodeModuleList({ items, onDelete, permanent }) {
  if (items.length === 0) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 32, opacity: 0.3 }}>⬡</div>
      <div style={{ fontSize: 12, letterSpacing: '0.1em' }}>NO RESULTS</div>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border2)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 1 }}>
        <div style={{ width: 90, padding: '8px 16px', textAlign: 'right', color: 'var(--text3)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>SIZE</div>
        <div style={{ flex: 1, padding: '8px 8px', color: 'var(--text3)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>PATH</div>
        <div style={{ width: 110, padding: '8px 16px', color: permanent ? 'var(--red)' : 'var(--text3)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s' }}>
          {permanent ? '⚠ PERMANENT' : '🗑 TRASH'}
        </div>
      </div>

      {items.map(item => (
        <Row key={item.path} item={item} onDelete={onDelete} permanent={permanent} />
      ))}
    </div>
  )
}
