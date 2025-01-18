// REACT IMPORTS
import { useCallback, useEffect } from 'react';

// LENS IMPORTS
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useLogout, useSession } from '@lens-protocol/react-web';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

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
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import NeonPaper from '@src/sections/publication/NeonPaperContainer.tsx';
import AvatarProfile from '@src/components/avatar/avatar.tsx';
import { notifyError } from '@notifications/internal-notifications.ts';
import { ERRORS } from '@notifications/errors.ts';

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

  // Redux states: session loading and login modal open status
  const { isLoginModalOpen, isUpdatingMetadata, isSessionLoading } = useSelector(
    (state: any) => state.auth
  );

  // Lens session data
  const { data, loading }: ReadResult<ProfileSession> = useSession();
  const sessionData = useSelector((state: any) => state.auth.session);

  // Lens logout hook
  const { execute: logoutExecute } = useLogout();

  // Update Redux with the current session loading status from Lens
  useEffect(() => {
    dispatch(setAuthLoading({ isSessionLoading: loading }));
  }, [loading]);

  // Convert session data to string so that changes in the object trigger this effect
  const parsedSessionData = JSON.stringify(data);

  // Update Redux session whenever Lens session data changes (unless updating metadata)
  useEffect(() => {
    if (!isUpdatingMetadata) {
      dispatch(setSession({ session: data }));
    }
  }, [parsedSessionData, isUpdatingMetadata]);

  // Close popover when session status or login modal changes
  useEffect(() => {
    popover.onClose();
  }, [sessionData?.authenticated, isLoginModalOpen, isSessionLoading]);

  /**
   * Log out from the current session (Lens + Web3Auth).
   */
  const logout = useCallback(async () => {
    try {
      // Logout from Lens
      await logoutExecute();

      // Logout from Web3Auth
      await web3Auth?.logout();

      // Clear the balance (Redux state)
      dispatch(setBalance({ balance: 0 }));
      localStorage.removeItem('sessionExpiration');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }, [logoutExecute]);

  /**
   * This function reads the saved expiration time and logs out if we've passed it.
   */
  const checkSessionExpiration = useCallback(() => {
    const expirationStr = localStorage.getItem('sessionExpiration');
    if (!expirationStr) return; // If there's no stored timestamp, do nothing
    const expirationTime = parseInt(expirationStr, 10);

    if (Date.now() >= expirationTime) {
      logout(); // Call the logout callback
      notifyError(ERRORS.BUNDLER_UNAVAILABLE);
    }
  }, []);

  /**
   * Periodically check if the session timestamp in localStorage has expired.
   */
  useEffect(() => {
    // Check once immediately on mount
    checkSessionExpiration();

    // Then check every 60 seconds
    const intervalId = setInterval(() => {
      checkSessionExpiration();
    }, 60 * 1000);

    // Cleanup: clear the interval on unmount
    return () => clearInterval(intervalId);
  }, [checkSessionExpiration]);

  /**
   * Handle a click on a popover item (e.g., "Profile").
   */
  const handleClickItem = (path: string) => {
    popover.onClose();
    router.push(path);
  };

  /**
   * Handlers for opening/closing the login modal.
   */
  const handleOpenModal = () => {
    dispatch(openLoginModal());
  };

  const handleCloseModal = () => {
    dispatch(closeLoginModal());
  };

  // If the session is still loading, show a spinner
  if (isSessionLoading) {
    return <CircularProgress size={24} sx={{ color: '#fff' }} />;
  }

  // Conditionally use a "NeonPaper" wrapper if metadata is updating
  const EffectPaper = isUpdatingMetadata ? NeonPaper : Box;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={popover.onOpen}>
        {/* If user is authenticated, show their avatar icon */}
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
              <AvatarProfile
                src={
                  (sessionData?.profile?.metadata?.picture as any)?.optimized?.uri ??
                  sessionData?.profile?.id
                }
                alt="avatar"
                sx={{
                  width: 36,
                  height: 36,
                  border: (theme: any) => `solid 2px ${theme.palette.background.default}`,
                }}
              />
            </IconButton>
          </EffectPaper>
        ) : null}

        {/* If not authenticated, show a "Social Login" button */}
        <Box
          sx={{ display: 'flex', flexDirection: 'column', ml: { xs: 0, md: 1 }, cursor: 'pointer' }}
        >
          {!sessionData?.authenticated && !loading ? (
            <Button variant="contained" onClick={handleOpenModal}>
              Social Login
            </Button>
          ) : null}

          {/* If authenticated, show handle/ID */}
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
                  {sessionData?.profile?.id}
                </Typography>
              </Box>
            </>
          ) : null}
        </Box>
      </Box>

      {/* The popover shown on avatar or name click */}
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

            {/* Logout menu option */}
            <MenuItem
              onClick={logout}
              sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
            >
              Logout
            </MenuItem>
          </>
        ) : null}
      </CustomPopover>

      {/* The modal for logging in */}
      <LoginModal open={isLoginModalOpen} onClose={handleCloseModal} />
    </>
  );
}
