import { useEffect, useRef } from 'react'
import { Editor } from '@toast-ui/react-editor'
import TopTabs from './TopTabs'
import '@toast-ui/editor/dist/toastui-editor.css'
import 'highlight.js/styles/github.css'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'

function RightContent(): JSX.Element {
  const editorRef = useRef<Editor>(null)

  const handleSave = (): void => {
    const markdownContent = editorRef.current?.getInstance().getMarkdown() // 获取 Markdown 内容
    console.log(markdownContent)
  }

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      // cmd + s 或者 ctrl + s
      if ((e.key === 's' && e.metaKey) || (e.key === 's' && e.ctrlKey)) {
        handleSave()
      }
    })
  }, [])

  return (
    <div className="h-full overflow-hidden bg-white border-l border-[#f5f5f5]">
      <div className="flex flex-col h-full p-4">
        <TopTabs />
        <div className="flex-1 overflow-hidden">
          <Editor
            ref={editorRef}
            initialValue="### 欢迎使用 TOAST UI Editor 🎉" // 初始内容
            previewStyle="vertical" // 预览风格：horizontal 或 vertical
            height="100%" // 编辑器高度
            initialEditType="markdown" // 初始编辑模式：markdown 或 wysiwyg
            useCommandShortcut={true} // 是否启用快捷键
            plugins={[codeSyntaxHighlight]} // 使用代码高亮插件
          />
        </div>
      </div>
    </div>
  )
}

export default RightContent
