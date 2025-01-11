<!--
 * @Author: 陈尼克 xianyou1993@qq.com
 * @Date: 2025-01-05 18:20:44
 * @LastEditors: 陈尼克 xianyou1993@qq.com
 * @LastEditTime: 2025-01-11 19:29:17
 * @FilePath: /y-markdown-editor/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# y-markdown-editor

#### 一个基于 Electron 的 Markdown 编辑器。
#### 技术栈：Electron + React + TypeScript + Zustand + TailwindCSS + tui-editor

## 开发记录

- [x] 项目初始化，引入组件库`Ant Design`，样式处理工具`TailwindCSS`，状态管理工具`Zustand`。
- [x] 完成左侧菜单组件，完成文章列表的增删改查。
- [x] 新增`Markdown`文件到指定文件路径.
- [x] 文章列表的增删改查。
- [x] 右侧内容页顶部`Tabs`
- [x] 引入[tui-editor](https://github.com/nhn/tui.editor)
- [x] `Markdown`编辑器文件的保存、预览
- [x] 编辑文章保存后，自动更新到本地存储的文件
- [x] 导入文件
- [x] 「右键菜单」删除本地文件、删除源文件
- [x] 「右键菜单」定位文件位置
- [ ] 自定义顶部
- [x] 通过`electron-localshortcut`修复`Mac`快捷键不生效的问题
- [x] 通过`Zustand`的`persist`持久化数据
- [x] 抽离`main/index.ts`中的一些逻辑
- [x] 解决`markdown`编辑器中`img`无法显示的问题
