import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import trash from 'trash'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow
let cancelFlag = false

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 800,
    minHeight: 550,
    backgroundColor: '#0d0d0d',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())

// ── IPC: Select Folder ──────────────────────────────────────────────────────
ipcMain.handle('select-folder', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  return canceled ? null : filePaths[0]
})

// ── IPC: Cancel ─────────────────────────────────────────────────────────────
ipcMain.handle('cancel-search', () => { cancelFlag = true })

// ── IPC: Search ─────────────────────────────────────────────────────────────
ipcMain.handle('search-node-modules', async (event, rootPath) => {
  cancelFlag = false
  const results = []
  let scanned = 0
  let total = 0

  async function getFolderSize(dirPath) {
    let size = 0
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true })
      for (const item of items) {
        const full = path.join(dirPath, item.name)
        if (item.isDirectory()) size += await getFolderSize(full)
        else {
          try { size += fs.statSync(full).size } catch {}
        }
      }
    } catch {}
    return size
  }

  function walk(dir) {
    return new Promise((resolve) => {
      if (cancelFlag) return resolve()

      setImmediate(async () => {
        scanned++
        if (scanned % 50 === 0) {
          mainWindow.webContents.send('search-progress', { scanned, total })
        }

        let entries
        try { entries = fs.readdirSync(dir, { withFileTypes: true }) }
        catch { return resolve() }

        const subdirs = []
        for (const entry of entries) {
          if (cancelFlag) break
          if (!entry.isDirectory()) continue

          const fullPath = path.join(dir, entry.name)
          total++

          if (entry.name === 'node_modules') {
            const size = await getFolderSize(fullPath)
            results.push({ path: fullPath, size })
            mainWindow.webContents.send('search-progress', { scanned, total, found: results.length })
          } else {
            subdirs.push(fullPath)
          }
        }

        for (const sub of subdirs) {
          if (cancelFlag) break
          await walk(sub)
        }

        resolve()
      })
    })
  }

  await walk(rootPath)
  mainWindow.webContents.send('search-progress', { scanned, total, done: true })
  return results
})

// ── IPC: Delete ──────────────────────────────────────────────────────────────
ipcMain.handle('delete-folder', async (event, folderPath, permanent) => {
  try {
    if (permanent) {
      fs.rmSync(folderPath, { recursive: true, force: true })
    } else {
      await trash(folderPath)
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})
