import React from 'react'
import { SpaceVertical, Space, ProgressCircular } from '@looker/components'

export const Spinner: React.FC = () => {
return (
  <SpaceVertical justifyContent="center" height="100%">
      <Space justifyContent="center">
      <ProgressCircular />
      </Space>
  </SpaceVertical>
)
}
