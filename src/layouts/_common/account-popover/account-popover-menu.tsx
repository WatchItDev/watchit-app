// REACT IMPORTS
import { useEffect } from 'react';

// MUI IMPORTS
import { Box, Divider, MenuItem, Stack, Typography } from '@mui/material';

// LOCAL IMPORTS
import CustomPopover from '@src/components/custom-popover';
import { useAccountSession } from '@src/hooks/use-account-session';
import { paths } from '@src/routes/paths';
import { UsePopoverReturnType } from '@src/components/custom-popover/use-popover.ts';
import { useAuth } from '@src/hooks/use-auth.ts';

// ----------------------------------------------------------------------

interface AccountPopoverMenuProps {
  popover: UsePopoverReturnType;
  router: {
    push: (path: string) => void;
  };
}

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Profile',
    linkTo: paths.dashboard.user.root,
  },
];

// ----------------------------------------------------------------------

/**
 * This component shows the popover menu for:
 *  - User's display name
 *  - Profile link(s)
 *  - Logout
 */
export function AccountPopoverMenu({
  popover,
  router,
}: Readonly<AccountPopoverMenuProps>) {
  const { session, isLoginModalOpen, isAuthLoading } = useAuth();
  const { logout } = useAccountSession();

  const isAuthenticated = Boolean(session?.authenticated);

  // Close popover when session status or login modal changes
  useEffect(() => {
    popover.onClose();
  }, [session?.authenticated, isLoginModalOpen, isAuthLoading]);

  const handleClickItem = (path: string) => {
    popover.onClose();
    router.push(path);
  };

  // If not authenticated, no menu is shown
  if (!isAuthenticated) {
    return null;
  }

  return (
    <CustomPopover
      open={popover.open}
      arrow="top-right"
      onClose={popover.onClose}
      sx={{ width: 200, p: 0, mt: '18px' }}
    >
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Typography variant="subtitle2" noWrap>
          {session?.user?.displayName ?? ''}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {session?.user?.username ?? ''}
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack sx={{ p: 1 }}>
        {OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() =>
              handleClickItem(option.linkTo(`${session?.user?.address}`))
            }
          >
            {option.label}
          </MenuItem>
        ))}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <MenuItem
        onClick={() => logout(true)}
        sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
      >
        Logout
      </MenuItem>
    </CustomPopover>
  );
}
