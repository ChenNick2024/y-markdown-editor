import { app, shell, BrowserWindow, ipcMain, Menu, dialog, session } from 'electron'
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
    minWidth: 1000,
    minHeight: 600,
    width: 1000,
    height: 600,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    icon: join(__dirname, '../../resources/icon.ico'),
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  if (isDev) mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('wang.chennick')

  articleOpt(mainWindow)
  // 导入一个markdown文件
  ipcMain.on('open-file-dialog', async () => {
    const path = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Markdown', extensions: ['md'] }]
      // 支持多选
    })
    if (path.canceled) return
    path.filePaths.forEach((allFilePath) => {
      const filePath = allFilePath.split('/').slice(0, -1).join('/')
      const fileContent = fs.readFileSync(allFilePath, 'utf-8')
      const fileName = allFilePath.split('/')?.pop()?.replace('.md', '') ?? ''
      mainWindow.webContents.send('open-article', {
        allFilePath,
        filePath,
        fileName,
        fileContent
      }) // 通知渲染进程
    })
  })
  ipcMain.on('maximize', () => {
    mainWindow.maximize()
  })
  ipcMain.on('minimize', () => {
    mainWindow.minimize()
  })
  ipcMain.on('close', () => {
    mainWindow.close()
  })

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
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
