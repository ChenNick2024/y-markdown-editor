import React from 'react'
import { createRoot } from 'react-dom/client'

export default function HocDialog(Component: React.ComponentType): React.FC {
  const Dialog = (props): void => {
    const div = document.createElement('div')
    const root = createRoot(div)
    const close = (): void => {
      root.unmount()
      div.remove()
    }
    root.render(<Component {...props} onCancel={close} />)
  }

  return Dialog as React.FC
}
