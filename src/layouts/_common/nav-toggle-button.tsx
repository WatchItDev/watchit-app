import { setCollapsed, toggleMinibar } from '@redux/minibar'
import { useDispatch, useSelector } from 'react-redux'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import { NAV } from '../config-layout'
import Iconify from '@src/components/iconify'
import { useResponsive } from '@src/hooks/use-responsive'
import { bgBlur } from '@src/theme/css'

export default function NavToggleButton({ sx, ...other }: IconButtonProps) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const lgUp = useResponsive('up', 'lg')
  // @ts-ignore
  const minibarState = useSelector((state) => state.minibar.state)

  if (!lgUp) {
    return null
  }

  const handleToggleMinibar = () => {
    dispatch(setCollapsed(true))
    dispatch(toggleMinibar())
  }

  return (
    <IconButton
      size="small"
      onClick={handleToggleMinibar}
      sx={{
        p: 0.5,
        top: NAV.TOGGLE_TOP,
        position: 'fixed',
        left: NAV.W_VERTICAL + NAV.W_MINI - 12,
        zIndex: theme.zIndex.appBar + 2,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'background.default',
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify
        width={16}
        icon={
          minibarState === 'vertical' ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'
        }
      />
    </IconButton>
  )
}
