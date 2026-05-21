import React, { useState, useEffect, useCallback } from 'react'
import FolderSelector from './components/FolderSelector.jsx'
import SearchControls from './components/SearchControls.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import SizeFilter from './components/SizeFilter.jsx'
import NodeModuleList from './components/NodeModuleList.jsx'
import { bytesFromMB, totalSize, formatSize } from './services/sizeUtils.js'

function PermanentToggle({ permanent, onChange }) {
  return (
    <button
      onClick={() => onChange(!permanent)}
      title={permanent ? 'Permanent delete ON — files will be destroyed forever' : 'Recycle bin ON — files will be moved to trash'}
      style={{
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.07em', textTransform: 'uppercase',
        background: permanent ? 'rgba(239,68,68,0.12)' : 'transparent',
        border: `1px solid ${permanent ? 'var(--red)' : 'var(--border2)'}`,
        color: permanent ? 'var(--red)' : 'var(--text3)',
        padding: '6px 14px', cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: permanent ? '0 0 10px rgba(239,68,68,0.25)' : 'none',
        display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap'
      }}
      onMouseEnter={e => { if (!permanent) { e.currentTarget.style.borderColor = 'var(--text2)'; e.currentTarget.style.color = 'var(--text)' }}}
      onMouseLeave={e => { if (!permanent) { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text3)' }}}
    >
      <span style={{ fontSize: 13 }}>{permanent ? '⚠' : '🗑'}</span>
      {permanent ? 'PERMANENT DELETE' : 'RECYCLE BIN'}
    </button>
  )
}

export default function App() {
  const [folder, setFolder] = useState(null)
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [progress, setProgress] = useState({ scanned: 0, total: 0, found: 0 })
  const [minMB, setMinMB] = useState(0)
  const [permanent, setPermanent] = useState(false)

  const filtered = results.filter(r => r.size >= bytesFromMB(minMB))

  useEffect(() => {
    const cleanup = window.electronAPI?.onProgress((data) => {
      setProgress(p => ({
        scanned: data.scanned ?? p.scanned,
        total: data.total ?? p.total,
        found: data.found ?? p.found
      }))
    })
    return () => cleanup?.()
  }, [])

  const selectFolder = useCallback(async () => {
    const path = await window.electronAPI?.selectFolder()
    if (path) setFolder(path)
  }, [])

  const startSearch = useCallback(async () => {
    setResults([])
    setProgress({ scanned: 0, total: 0, found: 0 })
    setSearching(true)
    try {
      const found = await window.electronAPI?.searchNodeModules(folder)
      if (found) setResults(found.sort((a, b) => b.size - a.size))
    } finally {
      setSearching(false)
    }
  }, [folder])

  const cancelSearch = useCallback(async () => {
    await window.electronAPI?.cancelSearch()
    setSearching(false)
  }, [])

  const handleDelete = useCallback((path) => {
    setResults(prev => prev.filter(r => r.path !== path))
  }, [])

  const totalBytes = totalSize(filtered)
  const hasResults = results.length > 0

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', WebkitAppRegion: 'drag' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ WebkitAppRegion: 'no-drag' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 2 }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--amber)' }}>
                NODE MODULE FINDER
              </span>
              <span style={{ color: 'var(--text3)', fontSize: 10, letterSpacing: '0.12em' }}>v1.0.0</span>
            </div>
            <div style={{ color: 'var(--text3)', fontSize: 10, letterSpacing: '0.06em' }}>LOCATE · AUDIT · RECLAIM DISK SPACE</div>
          </div>

          {hasResults && (
            <div style={{ textAlign: 'right', WebkitAppRegion: 'no-drag' }}>
              <div style={{ color: 'var(--amber)', fontWeight: 600, fontSize: 16 }}>{formatSize(totalBytes)}</div>
              <div style={{ color: 'var(--text3)', fontSize: 10, marginTop: 1 }}>RECLAIMABLE ({filtered.length} folders)</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, WebkitAppRegion: 'no-drag', flexWrap: 'wrap' }}>
          <FolderSelector folder={folder} onSelect={selectFolder} disabled={searching} />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <PermanentToggle permanent={permanent} onChange={setPermanent} />
            <SearchControls
              searching={searching} folder={folder}
              onSearch={startSearch} onCancel={cancelSearch}
              onClear={() => setResults([])} hasResults={hasResults}
            />
          </div>
        </div>

        <ProgressBar scanned={progress.scanned} total={progress.total} found={progress.found} searching={searching} />
      </div>

      {hasResults && (
        <SizeFilter minMB={minMB} onChange={setMinMB} count={filtered.length} total={results.length} />
      )}

      <NodeModuleList items={filtered} onDelete={handleDelete} permanent={permanent} />

      {/* Status bar */}
      <div style={{ padding: '6px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', gap: 20, alignItems: 'center' }}>
        <span style={{ color: searching ? 'var(--amber)' : 'var(--text3)', fontSize: 10, letterSpacing: '0.08em' }}>
          {searching ? '● SCANNING' : hasResults ? '◆ COMPLETE' : '○ IDLE'}
        </span>
        {permanent && <span style={{ color: 'var(--red)', fontSize: 10, letterSpacing: '0.06em' }}>⚠ PERMANENT DELETE ACTIVE</span>}
        {folder && <span style={{ color: 'var(--text3)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder}</span>}
      </div>
    </div>
  )
}
