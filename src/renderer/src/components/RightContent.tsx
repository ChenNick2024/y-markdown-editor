import { useEffect, useRef } from 'react'
import { Empty, Button, Typography, message } from 'antd'
import { FrownOutlined } from '@ant-design/icons'
import { Editor } from '@toast-ui/react-editor'
import TopTabs from './TopTabs'
import { useStore } from '@renderer/store'
import '@toast-ui/editor/dist/toastui-editor.css'
import 'highlight.js/styles/github.css'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
import ModalAdd from './Modal/ModalAdd'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

function RightContent(): JSX.Element {
  const editorRef = useRef<Editor>(null)
  const activeArticle = useStore((state) => state.activeArticle)
  const articles = useStore((state) => state.articles)
  const tabs = useStore((state) => state.tabs)
  const saveCurrentArticle = useStore((state) => state.saveCurrentArticle)
  const addArticle = useStore((state) => state.addArticle)

  const handleSave = (): void => {
    const markdownContent = editorRef.current?.getInstance().getMarkdown() // 获取 Markdown 内容
    saveCurrentArticle({
      ...activeArticle,
      content: markdownContent || '' // Provide empty string as fallback
    })
  }

  const handleAdd = (): void => {
    ModalAdd({
      onCb: (value, savePath) => {
        const data = {
          id: uuidv4(),
          title: value,
          content: '',
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          filePath: savePath,
          isEdit: false
        }

        window.electron.ipcRenderer.invoke('create-article', data.filePath, value).then((res) => {
          if (res.code === 0) {
            addArticle(data)
          } else {
            message.error(res.message)
          }
        })
      }
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
              key={activeArticle.id}
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
                {!articles.length ? (
                  <Button type="primary" onClick={handleAdd}>
                    创建文章
                  </Button>
                ) : null}
              </Empty>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RightContent
