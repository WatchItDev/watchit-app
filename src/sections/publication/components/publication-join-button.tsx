import { FC } from 'react';
import { Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconPlayerPlay } from '@tabler/icons-react';
import { PublicationJoinButtonProps } from '@src/sections/publication/types.ts';

export const PublicationJoinButton: FC<PublicationJoinButtonProps> = (props) => {
  const { joinButtonLoading, onJoin } = props;

  return (
    <LoadingButton
      variant="contained"
      sx={{
        color: '#1E1F22',
        background: '#FFFFFF',
        height: '35px',
        bottom: 16,
        left: 16,
        position: 'absolute',
        zIndex: 2,
      }}
      onClick={onJoin}
      loading={joinButtonLoading}
    >
      <IconPlayerPlay fontSize="large" size={18} />
      <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: '700', ml: 1 }}>
        Join
      </Typography>
    </LoadingButton>
  );
};
