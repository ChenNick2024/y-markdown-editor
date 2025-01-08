/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-08 09:52:43
 * @LastEditors: Nick930826 xianyou1993@qq.com
 * @LastEditTime: 2025-01-08 09:55:14
 * @FilePath: /y-markdown-editor/src/renderer/src/components/Tabs.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState } from 'react'
import { Tabs, Badge } from 'antd'
import { useStore } from '@renderer/store'

export default function TopTabs(): JSX.Element {
  const [activeKey, setActiveKey] = useState('1')
  const tabs = useStore((state: any) => state.tabs)
  const deleteTab = useStore((state: any) => state.deleteTab)
  return (
    <>
      {tabs.length ? (
        <div className="tab-wrap">
          <Tabs
            type="editable-card"
            onChange={(key) => {
              setActiveKey(key)
            }}
            hideAdd
            activeKey={activeKey}
            onEdit={(id, action) => {
              if (action === 'remove') {
                deleteTab(id)
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
