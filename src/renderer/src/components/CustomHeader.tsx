/*
 * @Author: 陈尼克 xianyou1993@qq.com
 * @Date: 2025-01-11 21:11:33
 * @LastEditors: 陈尼克 xianyou1993@qq.com
 * @LastEditTime: 2025-01-11 22:37:10
 * @FilePath: /y-markdown-editor/src/renderer/src/components/CustomHeader.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Layout, Button } from 'antd'
import { PlusOutlined, MinusOutlined, CloseOutlined } from '@ant-design/icons'
import logo from '@renderer/assets/y_logo.png'
const { Header } = Layout
declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag'
  }
}

function CustomHeader(): JSX.Element {
  const handleMaximize = (): void => {
    console.log('maximize')

    window.electron.ipcRenderer.send('maximize')
  }
  const handleMinimize = (): void => {
    console.log('minimize')

    window.electron.ipcRenderer.send('minimize')
  }
  const handleClose = (): void => {
    console.log('close')

    window.electron.ipcRenderer.send('close')
  }
  return (
    <Header
      className="h-[50px] flex items-center justify-between px-4 bg-white border-b border-gray-200 cursor-move"
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div className="text-2xl font-bold">
        <img src={logo} alt="logo" className="w-[50px] h-[50px]" />
      </div>
      <div className="flex items-center gap-2">
        <Button
          ghost
          type="primary"
          className="!w-[20px] !h-[20px]"
          style={{ WebkitAppRegion: 'no-drag' }}
          icon={<PlusOutlined />}
          onClick={handleMaximize}
        ></Button>
        <Button
          ghost
          type="primary"
          className="!w-[20px] !h-[20px]"
          style={{ WebkitAppRegion: 'no-drag' }}
          icon={<MinusOutlined />}
          onClick={handleMinimize}
        ></Button>
        <Button
          ghost
          type="primary"
          className="!w-[20px] !h-[20px]"
          style={{ WebkitAppRegion: 'no-drag' }}
          icon={<CloseOutlined />}
          onClick={handleClose}
        ></Button>
      </div>
    </Header>
  )
}

export default CustomHeader
