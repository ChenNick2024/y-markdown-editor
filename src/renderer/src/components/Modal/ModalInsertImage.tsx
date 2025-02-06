/*
 * @Author: 陈尼克 xianyou1993@qq.com
 * @Date: 2025-02-06 14:17:35
 * @LastEditors: 陈尼克 xianyou1993@qq.com
 * @LastEditTime: 2025-02-06 17:28:22
 * @FilePath: /y-markdown-editor/src/renderer/src/components/Modal/ModalInsertImage.tsx
 * @Description: 插入图片
 */
import React, { useState, useEffect } from 'react'
import { Modal, Pagination, Spin, message, Input } from 'antd'
import { CopyOutlined, PlusSquareOutlined } from '@ant-design/icons'
import HocDialog from '../HocDialog'
import ConfigProviderWarp from '../ConfigProviderWarp'
import axios from 'axios'

interface ImageProps {
  id: number
  webformatURL: string
  previewURL: string
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function ModalInsertImage({
  onCancel,
  onCb
}: {
  onCancel: () => void
  onCb: (str: string) => void
}) {
  const [images, setImages] = useState<ImageProps[]>([])
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchKey, setSearchKey] = useState<string>('cat')

  const getImages = async (currentPage: number = 1, query: string = searchKey): Promise<void> => {
    setLoading(true)
    try {
      const res = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '48677667-0ad8682e52d74e01894951387',
          q: query,
          image_type: 'photo',
          orientation: 'all',
          page: currentPage,
          per_page: 12
        }
      })
      setImages(res.data.hits)
      setTotal(res.data.total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getImages(page)
  }, [page])

  const handleSearch = (value: string): void => {
    setSearchKey(value)
    setPage(1) // 重置页码
    getImages(1, value)
  }

  const handleCopy = async (url: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url)
      message.success('复制成功')
    } catch (err) {
      message.error('复制失败')
    }
  }

  const handleInsert = (url: string): void => {
    onCb(`![image](${url})`)
    onCancel()
  }

  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  return (
    <ConfigProviderWarp>
      <Modal title="插入图片" open={true} onCancel={onCancel} footer={null} width={1000}>
        <div className="px-4 pt-4 pb-2">
          <Input.Search
            placeholder="搜索图片，按回车确认"
            defaultValue={searchKey}
            onSearch={handleSearch}
            className="max-w-md hover:w-[600px] transition-all duration-300"
            allowClear
            size="large"
            enterButton
          />
          {searchKey && (
            <div className="mt-2 text-gray-500 text-sm">
              搜索关键词：{searchKey}，共 {total} 条结果
            </div>
          )}
        </div>
        <Spin spinning={loading}>
          <div className="grid grid-cols-4 gap-4 p-4 max-h-[450px] overflow-y-auto">
            {images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden border border-gray-200 rounded-lg flex flex-col group relative cursor-pointer"
              >
                <div className="h-[160px] overflow-hidden">
                  <img
                    src={image.previewURL}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6">
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(image.webformatURL)
                    }}
                    className="p-3 rounded-full bg-white/90 hover:bg-blue-500 cursor-pointer transition-all duration-200
                    text-gray-600 hover:text-white transform hover:scale-110 shadow-lg backdrop-blur-sm
                    active:scale-95 select-none flex items-center justify-center"
                    title="复制链接"
                  >
                    <CopyOutlined className="text-xl" />
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleInsert(image.webformatURL)
                    }}
                    className="p-3 rounded-full bg-white/90 hover:bg-blue-500 cursor-pointer transition-all duration-200
                    text-gray-600 hover:text-white transform hover:scale-110 shadow-lg backdrop-blur-sm
                    active:scale-95 select-none flex items-center justify-center"
                    title="插入图片"
                  >
                    <PlusSquareOutlined className="text-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Spin>
        <div className="flex justify-center p-4">
          <Pagination
            current={page}
            total={total}
            pageSize={12}
            onChange={handlePageChange}
            showSizeChanger={false}
            disabled={loading}
          />
        </div>
      </Modal>
    </ConfigProviderWarp>
  )
}

export default HocDialog(ModalInsertImage as React.FC)
