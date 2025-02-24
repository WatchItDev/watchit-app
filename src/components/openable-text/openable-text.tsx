import { FC } from 'react'
import { Icon } from '@iconify/react'
import { Tooltip, IconButton, Typography, Stack } from '@mui/material'
import { Theme } from '@mui/material/styles/createTheme'
import { SxProps } from '@mui/system'

const openIcon = 'mdi:open-in-new'

interface OpenableTextProps {
  label: string;
  url: string;
  sx?: SxProps<Theme>;
  labelSx?: SxProps<Theme>;
}

const OpenableText: FC<OpenableTextProps> = ({ label, url, sx, labelSx }) => {
  const handleOpen = () => {
    window.open(url, '_blank')
  }

  return (
    <Stack direction="row" alignItems="center" sx={{...sx}}>
      <Typography sx={{ ml: 3, ...labelSx }}>{label}</Typography>
      <Tooltip title="Open in new window" arrow placement="top">
        <IconButton onClick={handleOpen} sx={{ ml: 1 }}>
          <Icon icon={openIcon} width={16} height={16} />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}

export default OpenableText
