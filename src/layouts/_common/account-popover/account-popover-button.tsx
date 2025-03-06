// REDUX IMPORTS
import { useSelector } from 'react-redux';

// MUI IMPORTS
import {
  Box,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

// ANIMATIONS IMPORTS
import { m } from 'framer-motion';

// LOCAL IMPORTS
import { varHover } from '@src/components/animate';
import AvatarProfile from '@src/components/avatar/avatar';
import NeonPaper from '@src/sections/publication/components/neon-paper-container.tsx';
import { UsePopoverReturnType } from '@src/components/custom-popover/use-popover.ts';

// ----------------------------------------------------------------------

interface AccountPopoverButtonProps {
  popover: UsePopoverReturnType;
  onOpenLoginModal: () => void;
}

// ----------------------------------------------------------------------

/**
 * This component renders either:
 *  - A clickable avatar (if authenticated)
 *  - Or a "Social Login" button (if not authenticated)
 */
export function AccountPopoverButton({
                                       popover,
                                       onOpenLoginModal,
                                     }: Readonly<AccountPopoverButtonProps>) {
  const sessionData = useSelector((state: any) => state.auth.session);
  const isAuthenticated = Boolean(sessionData?.authenticated);
  const isUpdatingMetadata: boolean = useSelector((state: any) => state.auth.isUpdatingMetadata);

  // Use NeonPaper while metadata is updating
  const EffectPaper = isUpdatingMetadata ? NeonPaper : Box;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={popover.onOpen}>
      {/* If user is authenticated, show their avatar */}
      {isAuthenticated && (
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
                fontSize: '1.25rem',
                width: 36,
                height: 36,
                border: (theme: any) => `solid 2px ${theme.palette.background.default}`,
              }}
            />
          </IconButton>
        </EffectPaper>
      )}

      {/* If user is not authenticated, show the "Social Login" button */}
      <Box
        sx={{ display: 'flex', flexDirection: 'column', ml: { xs: 0, md: 1 }, cursor: 'pointer' }}
      >
        {!isAuthenticated && (
          <Button variant="contained" onClick={onOpenLoginModal}>
            Social Login
          </Button>
        )}

        {/* If authenticated, show the user handle/ID */}
        {isAuthenticated && (
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
        )}
      </Box>
    </Box>
  );
}
