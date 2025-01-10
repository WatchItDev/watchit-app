// REACT IMPORTS
import { useCallback, useEffect } from 'react';

// LENS IMPORTS
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useLogout, useSession } from '@lens-protocol/react-web';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// ANIMATIONS IMPORTS
import { m } from 'framer-motion';

// LOCAL IMPORTS
import { paths } from '@src/routes/paths';
import { useRouter } from '@src/routes/hooks';
import { varHover } from '@src/components/animate';
import { LoginModal } from '@src/components/login-modal';
import CustomPopover, { usePopover } from '@src/components/custom-popover';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeLoginModal,
  openLoginModal,
  setAuthLoading,
  setBalance,
  setSession,
} from '@redux/auth';
import { CircularProgress } from '@mui/material';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import NeonPaper from '@src/sections/publication/NeonPaperContainer.tsx';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Profile',
    linkTo: paths.dashboard.user.root,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const dispatch = useDispatch();
  const router = useRouter();
  const popover = usePopover();
  const { web3Auth } = useWeb3Auth();
  const { isLoginModalOpen, isUpdatingMetadata, isSessionLoading } = useSelector(
    (state: any) => state.auth
  );

  const { data, loading }: ReadResult<ProfileSession> = useSession();
  const sessionData = useSelector((state: any) => state.auth.session);
  const { execute: logoutExecute } = useLogout();

  useEffect(() => {
    dispatch(setAuthLoading({ isSessionLoading: loading }));
  }, [loading]);

  const parsedSessionData = JSON.stringify(data);

  useEffect(() => {
    if (!isUpdatingMetadata) {
      dispatch(setSession({ session: data }));
    }
  }, [parsedSessionData, isUpdatingMetadata]);

  useEffect(() => {
    popover.onClose();
  }, [sessionData?.authenticated, isLoginModalOpen, isSessionLoading]);

  /**
   * Log out from the current session.
   */
  const logout = useCallback(async () => {
    try {
      await logoutExecute();
      await web3Auth?.logout();

      // Clear the balance for logged-out users
      dispatch(setBalance({ balance: 0 }));
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }, [logoutExecute]);

  const handleClickItem = (path: string) => {
    popover.onClose();
    router.push(path);
  };

  const handleOpenModal = () => {
    dispatch(openLoginModal());
  };

  const handleCloseModal = () => {
    dispatch(closeLoginModal());
  };

  if (isSessionLoading) {
    return <CircularProgress size={24} sx={{ color: '#fff' }} />;
  }

  const EffectPaper = isUpdatingMetadata ? NeonPaper : Box;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={popover.onOpen}>
        {sessionData?.authenticated ? (
          <EffectPaper
            {...(isUpdatingMetadata && {
              padding: '0',
              borderRadius: '999999px',
            })}
          >
            <IconButton
              component={m.button}
              whileTap="tap"
              whileHover="hover"
              variants={varHover(1.05)}
              sx={{
                width: 40,
                height: 40,
                background: (theme) => alpha(theme.palette.grey[500], 0.08),
                ...(popover.open && {
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                }),
              }}
            >
              <Avatar
                src={
                  (sessionData?.profile?.metadata?.picture as any)?.optimized?.uri ??
                  `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${sessionData?.profile?.id}`
                }
                alt={'avatar'}
                sx={{
                  width: 36,
                  height: 36,
                  border: (theme) => `solid 2px ${theme.palette.background.default}`,
                }}
              />
            </IconButton>
          </EffectPaper>
        ) : (
          <></>
        )}

        <Box
          sx={{ display: 'flex', flexDirection: 'column', ml: { xs: 0, md: 1 }, cursor: 'pointer' }}
        >
          {!sessionData?.authenticated && !loading ? (
            <Button variant="contained" onClick={handleOpenModal}>
              Social Login
            </Button>
          ) : undefined}

          {sessionData?.authenticated && !loading ? (
            <>
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    md: 'flex',
                  },
                  flexDirection: 'column',
                }}
              >
                <Typography variant="subtitle2" noWrap>
                  {sessionData?.profile?.handle?.localName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {`${sessionData?.profile?.id}`}
                </Typography>
              </Box>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>

      <CustomPopover
        open={popover.open}
        arrow="top-right"
        onClose={popover.onClose}
        sx={{ width: 200, p: 0, mt: '18px' }}
      >
        {sessionData?.authenticated ? (
          <>
            <Box sx={{ p: 2, pb: 1.5 }}>
              <Typography variant="subtitle2" noWrap>
                {sessionData?.profile?.metadata?.displayName ?? ''}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {sessionData?.profile?.handle?.localName}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack sx={{ p: 1 }}>
              {OPTIONS.map((option) => (
                <MenuItem
                  key={option.label}
                  onClick={() => handleClickItem(option.linkTo(`${sessionData?.profile?.id}`))}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem
              onClick={logout}
              sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
            >
              Logout
            </MenuItem>
          </>
        ) : (
          <></>
        )}
      </CustomPopover>
      <LoginModal open={isLoginModalOpen} onClose={handleCloseModal} />
    </>
  );
}
