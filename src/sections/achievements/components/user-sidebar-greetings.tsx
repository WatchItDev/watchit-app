import { FC } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import WaveImg from '@src/assets/illustrations/hi.png';
import { useAuth } from '@src/hooks/use-auth';

export const UserSidebarGreetings: FC = () => {
  const { session } = useAuth();

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h3" fontWeight={700} lineHeight={1.2}>
          Hi {session?.user?.displayName?.split(' ')[0] || 'there'}!
        </Typography>
        <MediumIcon src={WaveImg} alt="👋" />
      </Box>
      <Typography
        variant="h5"
        fontWeight="lighter"
        color="text.secondary"
        mb={2}
      >
        Let's earn something today
      </Typography>
    </Box>
  );
};

export default UserSidebarGreetings;

const MediumIcon = styled('img')({
  width: 36,
  height: 36,
  objectFit: 'contain',
});
