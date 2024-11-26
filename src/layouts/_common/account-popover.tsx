// REACT IMPORTS
import { useCallback, useState } from 'react';

// LENS IMPORTS
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useLogout, useSession } from '@lens-protocol/react-web';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from "@mui/material/Button";
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
import {LoginModal} from "@src/components/loginModal";
import CustomPopover, { usePopover } from '@src/components/custom-popover';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Profile',
    linkTo: paths.dashboard.user.root,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();
  const popover = usePopover();

  const { data: sessionData, loading }: ReadResult<ProfileSession> = useSession();
  const { execute: logoutExecute } = useLogout();
  const [loginModalOpen, setLoginModalOpen] = useState(false); // State to control LoginModal visibility

  /**
   * Log out from the current session.
   */
  const logout = useCallback(async () => {
    console.log('Logged out');
    try {
      await logoutExecute();
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }, [logoutExecute]);

  const handleClickItem = (path: string) => {
    popover.onClose();
    router.push(path);
  };

  const handleOpenModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setLoginModalOpen(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }} onClick={popover.onOpen}>
        {
          sessionData?.authenticated ? (
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
                src={(sessionData?.profile?.metadata?.picture as any)?.optimized?.uri ?? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${sessionData?.profile?.id}`}
                alt={'avatar'}
                sx={{
                  width: 36,
                  height: 36,
                  border: (theme) => `solid 2px ${theme.palette.background.default}`,
                }}
              />
            </IconButton>
          ) : <></>
        }

        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1, cursor: 'pointer' }}>
          {!sessionData?.authenticated && !loading ? (
            <Button variant="contained" onClick={handleOpenModal}>
              Login
            </Button>
          ) : undefined}

          {
            sessionData?.authenticated && !loading ? (
                <>
                  <Typography variant="subtitle2" noWrap>
                    {sessionData?.profile?.handle?.localName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {`${sessionData?.profile?.id}`}
                  </Typography>
                </>
            ) : <></>
          }
        </Box>
      </Box>

      {
        sessionData?.authenticated ? (
          <CustomPopover open={popover.open} arrow="bottom-center" onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
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
                <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo(`${sessionData?.profile?.id}`))}>
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
          </CustomPopover>
        ) : <></>
      }
      <LoginModal open={loginModalOpen} onClose={handleCloseModal} />
    </>
  );
}
