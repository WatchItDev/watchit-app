import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useMockedUser } from 'src/hooks/use-mocked-user';

// components
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useAuth } from '../../hooks/use-auth';

// ----------------------------------------------------------------------

const OPTIONS = [
  // {
  //   label: 'Home',
  //   linkTo: '/',
  // },
  {
    label: 'Profile',
    linkTo: paths.dashboard.user.root,
  },
  // {
  //   label: 'Settings',
  //   linkTo: paths.dashboard.root,
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();
  const { user } = useMockedUser();
  const { logout, selectedProfile } = useAuth();
  const popover = usePopover();

  const handleClickItem = (path: string) => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }} onClick={popover.onOpen}>
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
            src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${selectedProfile?.id}`}
            alt={user?.displayName}
            sx={{
              width: 36,
              height: 36,
              border: (theme) => `solid 2px ${theme.palette.background.default}`,
            }}
          />
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1, cursor: 'pointer' }}>
          <Typography variant="subtitle2" noWrap>
            {selectedProfile?.handle?.localName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            Watchit user
          </Typography>
        </Box>
      </Box>

      <CustomPopover open={popover.open} arrow="bottom-center" onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {selectedProfile?.handle?.localName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            Watchit user
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo(`${selectedProfile?.id}`))}>
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
    </>
  );
}
