import { useState } from 'react'
import { Input, Flex, Popconfirm, message } from 'antd'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import ModalEditor from './Modal/ModalEditor'
import ModalAdd from './Modal/ModalAdd'
import { useStore } from '@renderer/store'
import { useEffect } from 'react'
import { ArticleProps } from '@renderer/utils/types'

function LeftMenu(): JSX.Element {
  const articles = useStore((state: any) => state.articles)
  const activeArticle = useStore((state: any) => state.activeArticle)

  const updateArticle = useStore((state: any) => state.updateArticle)
  const deleteArticle = useStore((state: any) => state.deleteArticle)
  const setActiveArticle = useStore((state: any) => state.setActiveArticle)
  const addArticle = useStore((state: any) => state.addArticle)
  const addTab = useStore((state: any) => state.addTab)
  const updateTab = useStore((state: any) => state.updateTab)

  const [searchValue, setSearchValue] = useState<string>('')
  const [filterArticles, setFilterArticles] = useState<ArticleProps[]>([])

  // 编辑标题
  const handleEdit = (item: ArticleProps): void => {
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
          isEdit: true
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

  const handleDelete = (item: ArticleProps): void => {
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

  useEffect(() => {
    window.electron.ipcRenderer.on('create-article', handleAdd)
  }, [])

  return (
    <Flex vertical className="h-full">
      <div className="w-full p-4 flex-shrink-0 shadow-sm">
        <Input.Search allowClear placeholder="请输入文件名" enterButton onSearch={handleSearch} />
      </div>
      <div className="flex-1 overflow-auto">
        <ul className="p-4">
          {(searchValue ? filterArticles : articles).map((item, index) => (
            <li
              className="relative group flex items-center h-[32px] text-[#333] cursor-pointer mb-2 px-2 py-5 rounded-md hover:bg-[#f0f0f0]"
              style={{ backgroundColor: item.id == activeArticle.id ? '#f0f0f0' : 'transparent' }}
              key={index}
              onClick={() => handleActive(item)}
            >
              <span className="truncate">{item.title}</span>
              <Flex
                gap={8}
                className="absolute px-2 right-2 text-[#6A5ACD] group-hover:opacity-100 opacity-0 duration-500"
              >
                <FormOutlined onClick={() => handleEdit(item)} />
                <Popconfirm
                  title="确定要删除吗？"
                  onConfirm={() => handleDelete(item)}
                  okText="确定"
                  cancelText="取消"
                >
                  <DeleteOutlined />
                </Popconfirm>
              </Flex>
            </li>
          ))}
        </ul>
      </div>
    </Flex>
  )
}

export default LeftMenu
