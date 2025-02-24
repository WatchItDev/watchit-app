import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { alpha } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useSettingsContext } from '@src/components/settings'

export default function BlankView({ children }: any) {
  const settings = useSettingsContext()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {!children && <Typography variant="h4"> Blank </Typography>}

      <Box
        sx={{
          mt: 5,
          padding: '16px !important',
          width: 1,
          minHeight: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        {children}
      </Box>
    </Container>
  )
}
