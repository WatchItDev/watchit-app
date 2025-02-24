import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { data } from './config-navigation-mini'
import { NavSectionMini } from '../../components/nav-section'
import NavList from '../../components/nav-section/mini/nav-list'
import SvgColor from '../../components/svg-color'
import { paths } from '../../routes/paths'
import { NAV } from '../config-layout'
import { hideScroll } from '@src/theme/css'

export default function NavMini() {
  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
        backgroundColor: '#1E1F22',
      }}
    >
      <Stack
        sx={{
          py: 1,
          height: 1,
          position: 'fixed',
          gap: 1,
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <NavList
          active
          data={{
            id: 'watchit',
            title: 'Watchit',
            path: paths.dashboard.root,
            icon: (
              <SvgColor src="/assets/icons/navbar/ic_watchit.svg" sx={{ width: 1, height: 1 }} />
            ),
          }}
          depth={1}
          config={{}}
          onClick={() => {}}
        />
        <Box sx={{ width: '100%', py: 0.5 }} />
        <NavSectionMini
          items={data}
          activeId=""
          // onClick={(id) => () => {} }
          config={{
            hiddenLabel: true,
          }}
        />
        {/* <Box sx={{ width: '100%', py: 0.5 }} />
        <NavList
          data={{
            id: 'new_collection',
            title: 'New Collection',
            icon: <IconPlus />
          }}
          depth={1}
          config={{}}
          onClick={() => {}}
        />
        <NavList
          data={{
            id: 'explore_collections',
            title: 'Eplore Collections',
            icon: <IconGridDots />
          }}
          depth={1}
          config={{}}
          onClick={() => {}}
        />
        <NavList
          data={{
            id: 'download_app',
            title: 'Download Desktop App',
            icon: <IconCloudDownload />
          }}
          depth={1}
          config={{}}
          onClick={() => {}}
        />*/}
      </Stack>
    </Box>
  )
}
