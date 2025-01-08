/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-06 09:53:56
 * @LastEditors: Nick930826 xianyou1993@qq.com
 * @LastEditTime: 2025-01-08 12:29:29
 * @FilePath: /y-markdown-editor/src/renderer/src/components/Modal/ModalAdd.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState, useRef, useEffect } from 'react'
import { Modal, Input, Col, Flex, Button, message } from 'antd'
import { PushpinOutlined } from '@ant-design/icons'
import HocDialog from '../HocDialog'
import ConfigProviderWarp from '../ConfigProviderWarp'
import { useStore } from '@renderer/store'
import { ArticleProps } from '@renderer/utils/types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function YModal({
  onCancel,
  onCb
}: {
  onCancel: () => void
  onCb: (val: string, savePath: string) => void
}) {
  const [value, setValue] = useState<string>('')
  const [savePath, setSavePath] = useState<string>(localStorage.getItem('sava_path') || '')
  const articles = useStore((state: any) => state.articles)
  const inputRef = useRef(null)

  const handleOk = (): void => {
    if (!savePath) {
      message.error('请选择存储路径')
      return
    }
    if (articles.find((item: ArticleProps) => item.title === value)) {
      message.error('文章标题已存在')
      return
    }
    onCb(value, savePath)
    onCancel()
  }

  const handleSelectPath = (): void => {
    window.electron.ipcRenderer.invoke('select-path').then((path) => {
      console.log('path', path)
      if (path && path[0]) {
        localStorage.setItem('sava_path', path[0])
        setSavePath(path[0])
      }
    })
  }

  useEffect(() => {
    if (inputRef.current) {
      ;(inputRef.current as HTMLInputElement).focus()
    }
  }, [])

  return (
    <ConfigProviderWarp>
      <Modal
        width={600}
        title="新建文章"
        open={true}
        onCancel={onCancel}
        onOk={handleOk}
        okText="确定"
        cancelText="取消"
      >
        <Flex className="py-4" vertical gap={20}>
          <Flex align="center">
            <Col>文章标题：</Col>
            <Col span={18}>
              <Input
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    handleOk()
                  }
                }}
                ref={inputRef}
                allowClear
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                placeholder="请输入标题名称"
              />
            </Col>
          </Flex>
          <Flex align="center">
            <Col>存储路径：</Col>
            <Col span={18}>
              <Flex align="center" gap={8}>
                <span>{savePath}</span>
                <Button
                  type="primary"
                  size="small"
                  icon={<PushpinOutlined />}
                  onClick={handleSelectPath}
                >
                  {savePath ? '修改路径' : '选择路径'}
                </Button>
              </Flex>
            </Col>
          </Flex>
        </Flex>
      </Modal>
    </ConfigProviderWarp>
  )
}

export default HocDialog(YModal as React.FC)
