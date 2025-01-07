import { Layout } from 'antd'
import LeftMenu from '@renderer/components/LeftMenu'
import RightContent from '@renderer/components/RightContent'
import ConfigProviderWarp from '@renderer/components/ConfigProviderWarp'

const { Content, Sider } = Layout
function App(): JSX.Element {
  return (
    <ConfigProviderWarp>
      <Layout className="h-screen overflow-hidden">
        <Sider theme="light" width={240}>
          <LeftMenu />
        </Sider>
        <Layout>
          <Content>
            <RightContent />
          </Content>
        </Layout>
      </Layout>
    </ConfigProviderWarp>
  )
}

export default App
