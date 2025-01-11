/*
 * @Author: 陈尼克 xianyou1993@qq.com
 * @Date: 2025-01-11 21:11:33
 * @LastEditors: 陈尼克 xianyou1993@qq.com
 * @LastEditTime: 2025-01-11 21:12:32
 * @FilePath: /y-markdown-editor/src/renderer/src/components/CustomHeader.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Layout, Button } from 'antd'
import { PlusOutlined, MinusOutlined, CloseOutlined } from '@ant-design/icons'

const { Header } = Layout

function CustomHeader(): JSX.Element {
  return (
    <Header className="h-[50px] flex items-center justify-between px-4 bg-white border-b border-gray-200">
      <div className="text-2xl font-bold">YMarkdown</div>
      <div className="flex items-center gap-2">
        <Button
          ghost
          type="primary"
          className="!w-[20px] !h-[20px]"
          icon={<PlusOutlined />}
        ></Button>
        <Button
          ghost
          type="primary"
          className="!w-[20px] !h-[20px]"
          icon={<MinusOutlined />}
        ></Button>
        <Button
          ghost
          type="primary"
          className="!w-[20px] !h-[20px]"
          icon={<CloseOutlined />}
        ></Button>
      </div>
    </Header>
  )
}

export default CustomHeader
