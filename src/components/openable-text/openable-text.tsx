import { FC } from 'react';
import { Tooltip, IconButton, Typography, Stack } from '@mui/material';
import { Icon } from '@iconify/react';

const openIcon = 'mdi:open-in-new';

interface OpenableTextProps {
  label: string;
  url: string;
}

const OpenableText: FC<OpenableTextProps> = ({ label, url }) => {
  const handleOpen = () => {
    window.open(url, '_blank');
  };

  return (
    <Stack direction="row" alignItems="center">
      <Typography sx={{ ml: 3 }}>{label}</Typography>
      <Tooltip title="Abrir en una nueva ventana" arrow placement="top">
        <IconButton onClick={handleOpen} sx={{ ml: 1 }}>
          <Icon icon={openIcon} width={16} height={16} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default OpenableText;
