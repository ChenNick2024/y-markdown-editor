/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-05 18:20:44
 * @LastEditors: Nick930826 xianyou1993@qq.com
 * @LastEditTime: 2025-01-06 08:56:11
 * @FilePath: /y-markdown-editor/electron.vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    server: {
      port: 1588
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    css: {
      postcss: './postcss.config.js' // 指向 postcss 配置文件
    }
  }
})
