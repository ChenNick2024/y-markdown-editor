import { Layout } from 'antd'
import LeftMenu from '@renderer/components/LeftMenu'
import RightContent from '@renderer/components/RightContent'
import ConfigProviderWarp from '@renderer/components/ConfigProviderWarp'
import { App as AntdApp } from 'antd'
import CustomHeader from '@renderer/components/CustomHeader'

const { Content, Sider } = Layout
function App(): JSX.Element {
  return (
    <ConfigProviderWarp>
      <AntdApp>
        <Layout className="h-screen overflow-hidden bg-[#f5f5f5] flex flex-col">
          <CustomHeader />
          <Layout className="flex-1 flex">
            <Sider theme="light" width={240}>
              <LeftMenu />
            </Sider>
            <Layout>
              <Content>
                <RightContent />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </AntdApp>
    </ConfigProviderWarp>
  )
}

export default App
