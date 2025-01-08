/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-06 10:50:16
 * @LastEditors: Nick930826 xianyou1993@qq.com
 * @LastEditTime: 2025-01-08 13:09:34
 * @FilePath: /y-markdown-editor/src/renderer/src/components/ConfigProviderWarp.tsx
 * @Description: 配置主题，弹窗高阶组件里里会丢失主题，这边统一配置一下包裹组件
 */
import { ConfigProvider } from 'antd'

export default function ConfigProviderWarp({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return <ConfigProvider theme={{ token: { colorPrimary: '#1dabfc' } }}>{children}</ConfigProvider>
}
