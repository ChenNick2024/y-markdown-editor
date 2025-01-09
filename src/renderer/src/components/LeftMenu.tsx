import { useState } from 'react'
import { Input, Flex, Popconfirm, message, Empty, Button } from 'antd'
import { FormOutlined, DeleteOutlined, PlusOutlined, ImportOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import ModalEditor from './Modal/ModalEditor'
import ModalAdd from './Modal/ModalAdd'
import { useStore } from '@renderer/store'
import { useEffect } from 'react'
import { ArticleProps } from '@renderer/utils/types'
import { ThemeColor } from '@renderer/utils/constant'

function LeftMenu(): JSX.Element {
  const articles = useStore((state) => state.articles)
  const activeArticle = useStore((state) => state.activeArticle)

  const updateArticle = useStore((state) => state.updateArticle)
  const deleteArticle = useStore((state) => state.deleteArticle)
  const setActiveArticle = useStore((state) => state.setActiveArticle)
  const addArticle = useStore((state) => state.addArticle)
  const addTab = useStore((state) => state.addTab)

  const [searchValue, setSearchValue] = useState<string>('')
  const [filterArticles, setFilterArticles] = useState<ArticleProps[]>([])

  // 编辑标题
  const handleEdit = (item: ArticleProps, e: MouseEvent): void => {
    e.stopPropagation()
    ModalEditor({
      title: item.title,
      onCb: (val) => {
        // 修改名称的同时，还要把路径一起更新
        const newFilePath = `${item.filePath}/${val}.md`
        const oldFilePath = `${item.filePath}/${item.title}.md`
        window.electron.ipcRenderer
          .invoke('update-article', oldFilePath, newFilePath)
          .then((res) => {
            if (res.code === 0) {
              updateArticle({
                ...item,
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                title: val
              })
            } else {
              message.error(res.message)
            }
          })
      }
    })
  }
  // 添加文章
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

  const handleDelete = (item: ArticleProps, e: MouseEvent): void => {
    e.stopPropagation()
    window.electron.ipcRenderer.invoke('delete-article', item.filePath, item.title).then((res) => {
      if (res.code === 0) {
        deleteArticle(item.id)
      } else {
        message.error(res.message)
      }
    })
  }

  const handleActive = (article: ArticleProps): void => {
    setActiveArticle(article)
    addTab(article)
  }

  const handleSearch = (value: string): void => {
    const newArticles = articles.filter((item: ArticleProps) => item.title.includes(value))
    setSearchValue(value)
    setFilterArticles(newArticles)
  }

  const handleImport = (): void => {
    window.electron.ipcRenderer.send('open-file-dialog')
  }
  const handleContextMenu = (e: MouseEvent): void => {
    const target = e.target as HTMLElement
    const filePath = target.getAttribute('data-file-all-path')
    const id = target.getAttribute('data-id')
    if (!filePath || !id) return
    window.electron.ipcRenderer.send('show-context-menu', filePath, id) // 通知主进程
  }

  const handleDeleteLocalFile = (_event, id: string): void => {
    deleteArticle(id)
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('create-article', handleAdd)
    window.electron.ipcRenderer.on('delete-local-file', handleDeleteLocalFile)
    window.addEventListener('contextmenu', handleContextMenu)
    return (): void => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.electron.ipcRenderer.removeAllListeners('create-article')
      window.electron.ipcRenderer.removeAllListeners('delete-local-file')
    }
  }, [])

  useEffect(() => {
    const handleOpen = (_event, data): void => {
      const { filePath, fileName, fileContent } = data
      console.log('articles', articles)
      if (
        articles.find((item: ArticleProps) => item.filePath === filePath && item.title === fileName)
      ) {
        message.error('文件已存在')
        return
      }
      const newArticle = {
        id: uuidv4(),
        title: fileName,
        content: fileContent,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        filePath,
        isEdit: false
      }
      addArticle(newArticle)
      message.success('导入文件成功')
    }
    window.electron.ipcRenderer.on('open-article', handleOpen)
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('open-article')
    }
  }, [articles])

  const resultArticles = searchValue ? filterArticles : articles

  return (
    <Flex vertical className="h-full">
      <div className="flex flex-col w-full p-4 shadow-sm">
        <Input.Search
          allowClear
          placeholder="请输入文件名"
          enterButton
          onSearch={handleSearch}
          style={{ color: ThemeColor.primary }}
        />
        <div className="flex justify-around gap-4 mt-4">
          <Button
            onClick={handleAdd}
            icon={<PlusOutlined />}
            className="flex-1"
            ghost
            type="primary"
            size="small"
          >
            新建
          </Button>
          <Button
            onClick={handleImport}
            icon={<ImportOutlined />}
            className="flex-1"
            ghost
            type="primary"
            size="small"
          >
            导入
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <ul className="h-full p-4">
          {resultArticles.length ? (
            resultArticles.map((item, index) => (
              <li
                data-file-all-path={`${item.filePath}/${item.title}.md`}
                data-id={item.id}
                className="relative group flex items-center h-[32px] text-[#333] cursor-pointer mb-2 px-2 py-5 rounded-md hover:bg-[#f0f0f0]"
                style={{ backgroundColor: item.id == activeArticle.id ? '#f0f0f0' : 'transparent' }}
                key={index}
                onClick={() => handleActive(item)}
              >
                <span className="truncate">{item.title}</span>
                <Flex
                  gap={8}
                  className="absolute px-2 right-2 group-hover:opacity-100 opacity-0 duration-500"
                  style={{ color: ThemeColor.primary }}
                >
                  <FormOutlined onClick={(e) => handleEdit(item, e)} />
                  <Popconfirm
                    title="确定要删除吗？"
                    onConfirm={(e) => handleDelete(item, e)}
                    onCancel={(e) => e.stopPropagation()}
                    okText="确定"
                    cancelText="取消"
                  >
                    <DeleteOutlined onClick={(e) => e.stopPropagation()} />
                  </Popconfirm>
                </Flex>
              </li>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <Empty description="暂无数据" />
            </div>
          )}
        </ul>
      </div>
    </Flex>
  )
}

export default LeftMenu
