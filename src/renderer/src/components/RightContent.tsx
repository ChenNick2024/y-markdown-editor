import { useEffect, useRef } from 'react'
import { Empty, Button, Typography } from 'antd'
import { FrownOutlined } from '@ant-design/icons'
import { Editor } from '@toast-ui/react-editor'
import TopTabs from './TopTabs'
import { useStore } from '@renderer/store'
import '@toast-ui/editor/dist/toastui-editor.css'
import 'highlight.js/styles/github.css'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
function RightContent(): JSX.Element {
  const editorRef = useRef<Editor>(null)
  const activeArticle = useStore((state: any) => state.activeArticle)
  const articles = useStore((state: any) => state.articles)
  const tabs = useStore((state: any) => state.tabs)
  const saveCurrentArticle = useStore((state: any) => state.saveCurrentArticle)

  const handleSave = (): void => {
    const markdownContent = editorRef.current?.getInstance().getMarkdown() // 获取 Markdown 内容
    saveCurrentArticle({
      ...activeArticle,
      content: markdownContent
    })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleSave()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return (): void => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleSave])

  return (
    <div className="h-full overflow-hidden bg-white border-l border-[#f5f5f5]">
      <div className="flex flex-col h-full p-4">
        <TopTabs />
        <div className="flex-1 overflow-hidden">
          {tabs.length ? (
            <Editor
              ref={editorRef}
              initialValue={activeArticle.content} // 初始内容
              previewStyle="vertical" // 预览风格：horizontal 或 vertical
              height="100%" // 编辑器高度
              initialEditType="markdown" // 初始编辑模式：markdown 或 wysiwyg
              useCommandShortcut={false} // 是否启用快捷键
              plugins={[codeSyntaxHighlight]} // 使用代码高亮插件
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Empty
                image={<FrownOutlined className="text-[40px] text-gray-500" />}
                imageStyle={{ height: 40 }}
                description={<Typography.Text>请先选择一篇文章</Typography.Text>}
              >
                {!articles.length ? <Button type="primary">创建文章</Button> : null}
              </Empty>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RightContent
