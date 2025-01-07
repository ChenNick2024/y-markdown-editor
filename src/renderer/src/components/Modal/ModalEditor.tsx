/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-05 21:20:03
 * @LastEditors: Nick930826 xianyou1993@qq.com
 * @LastEditTime: 2025-01-07 10:56:48
 * @FilePath: /y-markdown-editor/src/renderer/src/components/ModalEditor.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState } from 'react'
import { Modal, Input } from 'antd'
import HocDialog from '../HocDialog'
import ConfigProviderWarp from '../ConfigProviderWarp'
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function YModal({
  onCancel,
  title,
  onCb
}: {
  onCancel: () => void
  title: string
  onCb: (str: string) => void
}) {
  const [value, setValue] = useState(title)

  const handleOk = (): void => {
    onCb(value)
    onCancel()
  }

  return (
    <ConfigProviderWarp>
      <Modal
        width={400}
        title="编辑标题"
        open={true}
        onCancel={onCancel}
        onOk={handleOk}
        okText="确定"
        cancelText="取消"
      >
        <div className="py-4">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="请输入标题名称"
          />
        </div>
      </Modal>
    </ConfigProviderWarp>
  )
}

export default HocDialog(YModal as React.FC)
