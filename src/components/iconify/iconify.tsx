import { forwardRef } from 'react'
import { Icon } from '@iconify/react'
import Box, { BoxProps } from '@mui/material/Box'
import { IconifyProps } from './types'

interface Props extends BoxProps {
  icon: IconifyProps;
}

const Iconify = forwardRef<SVGElement, Props>(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    data-testid="iconify"
    ref={ref}
    component={Icon}
    className="component-iconify"
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
))

export default Iconify
