// MUI IMPORTS
import {
  Box,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles'

// ANIMATIONS IMPORTS
import { m } from 'framer-motion';

// LOCAL IMPORTS
import AvatarProfile from '@src/components/avatar/avatar';
import { varHover } from '@src/components/animate';
import { UsePopoverReturnType } from '@src/components/custom-popover/use-popover.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { truncateAddress } from '@src/utils/wallet.ts';

// ----------------------------------------------------------------------

interface AccountPopoverButtonProps {
  popover: UsePopoverReturnType;
  onOpenLoginModal: () => void;
}

// ----------------------------------------------------------------------

export function AccountPopoverButton(props: Readonly<AccountPopoverButtonProps>) {
  const { popover, onOpenLoginModal } = props;
  const { session } = useAuth();
  const isAuthenticated = Boolean(session?.authenticated);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={popover.onOpen}>
      {/* If user is authenticated, show their avatar */}
      {isAuthenticated && (
        <Box>
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
              src={session?.user?.profilePicture ?? session?.user?.address ?? ''}
              alt="avatar"
              sx={{
                fontSize: '1.25rem',
                width: 36,
                height: 36,
                border: 'solid 2px #161C24',
              }}
            />
          </IconButton>
        </Box>
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
              {session?.user?.username}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {truncateAddress(session?.user?.address ?? '', 4, 4)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
