import { BrowserWindow, app, dialog, MenuItemConstructorOptions } from 'electron'
import fs from 'fs'

export const menuFn = (mainWindow: BrowserWindow): MenuItemConstructorOptions[] => {
  const template = [
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
    }
  ]

  if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
      label: name,
      submenu: [
        {
          label: `关于 ${name}`,
          accelerator: 'CmdOrCtrl+I',
          click: (): void => {}
        }
      ]
    })
  }

  return template
}

export default menuFn
