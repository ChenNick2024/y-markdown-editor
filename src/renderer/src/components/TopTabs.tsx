/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-08 09:52:43
 * @LastEditors: Nick930826 xianyou1993@qq.com
 * @LastEditTime: 2025-01-09 09:57:24
 * @FilePath: /y-markdown-editor/src/renderer/src/components/Tabs.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState } from 'react'
import { Tabs, Badge } from 'antd'
import { useStore } from '@renderer/store'

export default function TopTabs(): JSX.Element {
  const activeArticle = useStore((state: any) => state.activeArticle)
  const tabs = useStore((state: any) => state.tabs)
  const deleteTab = useStore((state: any) => state.deleteTab)
  const setActiveArticle = useStore((state: any) => state.setActiveArticle)

  return (
    <>
      {tabs.length ? (
        <div className="tab-wrap">
          <Tabs
            type="editable-card"
            onChange={(key) => {
              setActiveArticle(tabs.find((item) => item.id === key))
            }}
            hideAdd
            activeKey={activeArticle.id}
            onEdit={(id, action) => {
              if (action === 'remove') {
                deleteTab(id)
                // 如果删除的是当前激活的标签，则激活第一个标签
                if (activeArticle.id === id && tabs.length > 1) {
                  setActiveArticle(tabs[0])
                }
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
