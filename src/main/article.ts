import { BrowserWindow, ipcMain, dialog } from 'electron'
import fs from 'fs'
export default (mainWindow: BrowserWindow): void => {
  // 选择一个存储路径
  ipcMain.handle('select-path', () => {
    const path = dialog.showOpenDialogSync({
      properties: ['openDirectory', 'createDirectory']
    })
    return path
  })
  // 创建一个markdown文件
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
  // 更新一个markdown文件
  ipcMain.handle('update-article', async (_event, oldFilePath, newFilePath) => {
    try {
      fs.renameSync(oldFilePath, newFilePath)
      return { code: 0, message: '文件更新成功' }
    } catch (error) {
      console.error(error)
      return { code: 1, message: '文件更新失败' }
    }
  })
  // 保存一个markdown文件
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
  // 获取当前markdown文件内容
  ipcMain.handle('get-current-article', async (_event, article) => {
    const content = fs.readFileSync(`${article.filePath}/${article.title}.md`, 'utf-8')
    return { code: 0, content }
  })
  // 删除一个markdown文件
  ipcMain.handle('delete-article', async (_event, filePath, fileName) => {
    try {
      fs.unlinkSync(`${filePath}/${fileName}.md`)
      return { code: 0, message: '文件删除成功' }
    } catch (error) {
      console.error(error)
      return { code: 1, message: '文件删除失败' }
    }
  })
}
