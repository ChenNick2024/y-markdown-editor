import { Layout } from 'antd'
import LeftMenu from '@renderer/components/LeftMenu'
import RightContent from '@renderer/components/RightContent'
import ConfigProviderWarp from '@renderer/components/ConfigProviderWarp'
import { App as AntdApp } from 'antd'

const { Content, Sider } = Layout
function App(): JSX.Element {
  return (
    <ConfigProviderWarp>
      <AntdApp>
        <Layout className="h-screen overflow-hidden bg-[#f5f5f5]">
          <Sider theme="light" width={240}>
            <LeftMenu />
          </Sider>
          <Layout>
            <Content>
              <RightContent />
            </Content>
          </Layout>
        </Layout>
      </AntdApp>
    </ConfigProviderWarp>
  )
}

export default App
