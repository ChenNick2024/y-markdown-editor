import { useState } from 'react'
import { Tabs } from 'antd'
import { useStore } from '@renderer/store'

function RightContent(): JSX.Element {
  // const title = useStore((state: any) => state.title)
  const [activeKey, setActiveKey] = useState('1')
  const [items, setItems] = useState([
    {
      label: '地洒到卡上的疯狂打扫',
      key: '1'
    },
    {
      label: 'Tab 2',
      key: '2'
    },
    {
      label: 'Tab 3',
      key: '3'
    }
  ])
  return (
    <div className="h-full overflow-hidden bg-white border-l border-[#f5f5f5]">
      <div className="h-full p-4">
        {items.length ? (
          <div className="tab-wrap">
            <Tabs
              type="editable-card"
              onChange={(key) => {
                setActiveKey(key)
              }}
              hideAdd
              activeKey={activeKey}
              onEdit={(targetKey, action) => {
                console.log(targetKey, action)
                if (action === 'remove') {
                  console.log(targetKey)
                  setItems(items.filter((item) => item.key != targetKey))
                }
              }}
              items={items}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default RightContent
