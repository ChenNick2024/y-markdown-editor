/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-05 18:20:44
 * @LastEditors: 陈尼克 xianyou1993@qq.com
 * @LastEditTime: 2025-01-11 13:43:22
 * @FilePath: /y-markdown-editor/src/main/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
const electronLocalshortcut = require('electron-localshortcut')
import { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const isDev = require('electron-is-dev')

let mainWindow: BrowserWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    width: 1200,
    height: 800,
    show: false,
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

  const menu = Menu.buildFromTemplate([
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: (): void => {
            mainWindow.webContents.send('create-article') // 通知渲染进程
          }
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: async (): Promise<void> => {
            // 选择markdown文件
            const path = await dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [{ name: 'Markdown', extensions: ['md'] }]
            })
            if (path.canceled) return
            const allFilePath = path.filePaths[0]
            const filePath = allFilePath.split('/').slice(0, -1).join('/')
            const fileContent = fs.readFileSync(allFilePath, 'utf-8')
            const fileName = allFilePath.split('/')?.pop()?.replace('.md', '') ?? ''
            mainWindow.webContents.send('open-article', {
              allFilePath,
              filePath,
              fileName,
              fileContent
            }) // 通知渲染进程
          }
        }
      ]
    },
    {
      label: '快捷键',
      submenu: [
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
      ]
    }
  ])

  Menu.setApplicationMenu(menu)

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  if (isDev) mainWindow.webContents.openDevTools()
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

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('open-file-dialog', async () => {
    const path = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Markdown', extensions: ['md'] }]
    })
    if (path.canceled) return
    const allFilePath = path.filePaths[0]
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

  ipcMain.handle('select-path', () => {
    const path = dialog.showOpenDialogSync({
      properties: ['openDirectory', 'createDirectory']
    })
    return path
  })

  ipcMain.handle('create-article', async (event, filePath, fileName) => {
    try {
      if (fs.existsSync(`${filePath}/${fileName}.md`)) {
        return { code: 1, message: '文件已存在' }
      }
      fs.writeFileSync(`${filePath}/${fileName}.md`, '')
      return { code: 0, message: '文件创建成功' }
    } catch (error) {
      console.error(error)
      return { code: 1, message: '文件创建失败' }
    }
  })

  ipcMain.handle('update-article', async (event, oldFilePath, newFilePath) => {
    try {
      fs.renameSync(oldFilePath, newFilePath)
      return { code: 0, message: '文件更新成功' }
    } catch (error) {
      console.error(error)
      return { code: 1, message: '文件更新失败' }
    }
  })

  ipcMain.handle('save-article', async (_event, article) => {
    const _filePath = `${article.filePath}/${article.title}.md`
    try {
      fs.writeFileSync(_filePath, article.content)
      return { code: 0, message: '文件保存成功' }
    } catch (error) {
      console.error(error)
      return { code: 1, message: '文件保存失败' }
    }
  })

  ipcMain.handle('get-current-article', async (_event, article) => {
    const content = fs.readFileSync(`${article.filePath}/${article.title}.md`, 'utf-8')
    return { code: 0, content }
  })

  ipcMain.handle('delete-article', async (event, filePath, fileName) => {
    try {
      fs.unlinkSync(`${filePath}/${fileName}.md`)
      return { code: 0, message: '文件删除成功' }
    } catch (error) {
      console.error(error)
      return { code: 1, message: '文件删除失败' }
    }
  })

  // ipcMain.on('open-file', (_event, filePath) => {
  //   if (filePath && fs.existsSync(filePath)) {
  //     shell.showItemInFolder(filePath)
  //   } else {
  //     console.error('文件不存在')
  //   }
  // })

  ipcMain.on('show-context-menu', (_event, filePath, id) => {
    const template = [
      {
        label: '打开文件夹',
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
