import { FC } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface MiniGameCardProps {
  title: string;
  buttonLabel: string;
  imageSrc: string;
  sx?: object;
}

const MiniGameCard: FC<MiniGameCardProps> = ({
  title,
  buttonLabel,
  imageSrc,
  sx,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderTop: '1px dashed',
        borderColor: 'divider',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        textAlign: 'center',
        ...sx,
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={title}
        sx={{ width: '60%', mb: 2 }}
      />
      <Typography variant="subtitle2" fontWeight={600} mb={1}>
        {title}
      </Typography>
      <Button variant="contained" size="small">
        {buttonLabel}
      </Button>
    </Box>
  );
};

export default MiniGameCard;
