import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { COLORS } from '@src/layouts/config-layout.ts';
import { openLoginModal } from '@redux/auth';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from '@src/components/iconify';
import { FC } from 'react';

// Create a type for the component props to receive the icon and subtitle
type Props = {
  icon: string;
  title: string;
  description: string;
};

const NotLoggedIn: FC<Props> = ({ icon, title, description }) => {
  const dispatch = useDispatch();
  const sessionData = useSelector((state: any) => state.auth.session);

  const handleClicked = () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: COLORS.GRAY_DARK,
        color: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 10,
      }}
    >
      <Iconify
        icon={icon}
        width={200}
        height={200}
        sx={{
          mb: 2,
          color: COLORS.GRAY_LIGHT,
        }}
      />
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1" sx={{ mb: 3, mt: 1, opacity: 0.5 }}>
        {description}
      </Typography>
      <Button
        onClick={handleClicked}
        sx={{
          px: 4,
          py: 1,
          backgroundColor: COLORS.GRAY_LIGHT,
          color: 'white',
          '&:hover': {
            backgroundColor: COLORS.GRAY_DARK,
          },
        }}
      >
        Access now
      </Button>
    </Box>
  );
};

export default NotLoggedIn;
