import Box, { BoxProps } from '@mui/material/Box'
import { useResponsive } from '@src/hooks/use-responsive'

export default function Main({ children, sx, ...other }: BoxProps) {
  const lgUp = useResponsive('up', 'lg')

  return (
    <Box
      component="main"
      sx={{
        position: 'relative',
        padding: '65px 0 12px 0',
        transition: 'all 0.7s ease',
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1E1F22',
         ...(lgUp && {
          width: `calc(100% - 368px)`,
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  )
}
