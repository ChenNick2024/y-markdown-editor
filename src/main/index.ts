import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
const electronLocalshortcut = require('electron-localshortcut')
import { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const isDev = require('electron-is-dev')
import menuFn from './menuTemplate'
import articleOpt from './article'
let mainWindow: BrowserWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    width: 1200,
    height: 800,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.setIgnoreMenuShortcuts(true)

  electronLocalshortcut.register(mainWindow, 'CommandOrControl+C', () => {
    mainWindow.webContents.copy()
  })

  electronLocalshortcut.register(mainWindow, 'CommandOrControl+V', () => {
    mainWindow.webContents.paste()
  })

  electronLocalshortcut.register(mainWindow, 'CommandOrControl+X', () => {
    mainWindow.webContents.cut()
  })

  electronLocalshortcut.register(mainWindow, 'CommandOrControl+Z', () => {
    mainWindow.webContents.undo()
  })

  electronLocalshortcut.register(mainWindow, 'CommandOrControl+A', () => {
    mainWindow.webContents.selectAll()
  })

  const menu = Menu.buildFromTemplate(menuFn(mainWindow))

  Menu.setApplicationMenu(menu)

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  if (isDev) mainWindow.webContents.openDevTools()
  articleOpt(mainWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  // 右键菜单
  ipcMain.on('show-context-menu', (_event, filePath, id) => {
    const template = [
      {
        label: '打开文件源地址',
        click: (): void => {
          if (filePath && fs.existsSync(filePath)) {
            shell.showItemInFolder(filePath)
          } else {
            console.error('文件不存在')
          }
          shell.showItemInFolder(filePath)
        }
      },
      {
        label: '删除源文件',
        click: (): void => {
          // 删除源文件，本地文件也一起删除
          fs.unlinkSync(filePath)
          mainWindow.webContents.send('delete-local-file', id)
        }
      },
      {
        label: '删除本地文件',
        click: (): void => {
          // 删除本地文件，保留源文件
          mainWindow.webContents.send('delete-local-file', id)
        }
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    menu.popup()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
