import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { NAV } from '../config-layout'
import { useNavData } from './config-navigation'
import { NavToggleButton, Searchbar } from '../_common'
import { NavSectionVerticalMini } from '@src/components/nav-section/mini/nav-section-vertical-mini.tsx'
import { hideScroll } from '@src/theme/css'

export default function NavVerticalMini() {
  const navData = useNavData()

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL_MINI },
        backgroundColor: '#2b2d31',
        left: NAV.W_MINI + NAV.W_VERTICAL_MINI - 12,
        zIndex: '1300 !important',
      }}
    >
      <NavToggleButton
        sx={{
          top: NAV.TOGGLE_TOP,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_VERTICAL_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Searchbar />
        <NavSectionVerticalMini
          data={navData}
          config={{
            currentRole: 'admin',
          }}
        />
      </Stack>
    </Box>
  )
}
