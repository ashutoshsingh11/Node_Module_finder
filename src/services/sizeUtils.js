export function formatSize(bytes) {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB'
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + ' MB'
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(0) + ' KB'
  return bytes + ' B'
}

export function bytesFromMB(mb) {
  return mb * 1e6
}

export function totalSize(items) {
  return items.reduce((acc, i) => acc + i.size, 0)
}
