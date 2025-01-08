import { useState } from 'react'
import { Tabs, Badge } from 'antd'
import { useStore } from '@renderer/store'

function RightContent(): JSX.Element {
  // const title = useStore((state: any) => state.title)
  const [activeKey, setActiveKey] = useState('1')
  const tabs = useStore((state: any) => state.tabs)
  const deleteTab = useStore((state: any) => state.deleteTab)
  return (
    <div className="h-full overflow-hidden bg-white border-l border-[#f5f5f5]">
      <div className="h-full p-4">
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
      </div>
    </div>
  )
}

export default RightContent
