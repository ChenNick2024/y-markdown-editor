/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-08 09:52:43
 * @LastEditors: 陈尼克 xianyou1993@qq.com
 * @LastEditTime: 2025-01-19 11:02:30
 * @FilePath: /y-markdown-editor/src/renderer/src/components/Tabs.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Tabs, Badge, Modal } from 'antd'
import { useStore } from '@renderer/store'

export default function TopTabs(): JSX.Element {
  const activeArticle = useStore((state) => state.activeArticle)
  const tabs = useStore((state) => state.tabs)
  const deleteTab = useStore((state) => state.deleteTab)
  const setActiveArticle = useStore((state) => state.setActiveArticle)
  const saveCurrentArticle = useStore((state) => state.saveCurrentArticle)

  return (
    <>
      {tabs.length ? (
        <div className="tab-wrap">
          <Tabs
            size="small"
            type="editable-card"
            onChange={(key) => {
              console.log('key', key)
              const foundArticle = tabs.find((item) => item.id === key)
              if (foundArticle) {
                setActiveArticle(foundArticle)
              }
            }}
            hideAdd
            activeKey={activeArticle.id}
            onEdit={(id, action) => {
              if (activeArticle.isEdit) {
                Modal.confirm({
                  title: '提示',
                  content: '是否保存当前内容',
                  okText: '保存',
                  cancelText: '不保存',
                  onOk: () => {
                    if (action === 'remove') {
                      // 保存的情况下，将编辑状态设置为false，写入本地，下次读取的时候，会从本地读取
                      saveCurrentArticle({
                        ...activeArticle,
                        isEdit: false
                      })
                      deleteTab(id as string)
                      // 如果删除的是当前激活的标签，则激活第一个标签
                      if (activeArticle.id === id && tabs.length > 1) {
                        setActiveArticle(tabs[0])
                      }
                    }
                  },
                  onCancel: () => {
                    if (action === 'remove') {
                      // 不保存的情况下，将编辑状态设置为false，不写入本地，下次读取的时候，本地就不会有新内容
                      setActiveArticle({
                        ...activeArticle,
                        isEdit: false
                      })
                      deleteTab(id as string)
                      // 如果删除的是当前激活的标签，则激活第一个标签
                      if (activeArticle.id === id && tabs.length > 1) {
                        setActiveArticle(tabs[0])
                      }
                    }
                  }
                })
              }
            }}
            items={tabs.map((item) => ({
              label: (
                <div>
                  {item.title} {item.isEdit ? <Badge dot status="error" /> : ''}
                </div>
              ),
              key: item.id
            }))}
          />
        </div>
      ) : null}
    </>
  )
}
