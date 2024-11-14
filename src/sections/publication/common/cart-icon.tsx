// @mui
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
// routes
import { paths } from '@src/routes/paths';
// components
import Iconify from '@src/components/iconify';
import { RouterLink } from '@src/routes/components';

// ----------------------------------------------------------------------

type Props = {
  totalItems: number;
};

export default function CartIcon({ totalItems }: Props) {
  return (
    <Box
      component={RouterLink}
      href={paths.publication.checkout}
      sx={{
        right: 0,
        top: 112,
        zIndex: 999,
        display: 'flex',
        cursor: 'pointer',
        position: 'fixed',
        color: 'text.primary',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        bgcolor: 'background.paper',
        padding: (theme) => theme.spacing(1, 3, 1, 2),
        boxShadow: (theme) => theme.customShadows.dropdown,
        transition: (theme) => theme.transitions.create(['opacity']),
        '&:hover': { opacity: 0.72 },
      }}
    >
      <Badge showZero badgeContent={totalItems} color="error" max={99}>
        <Iconify icon="solar:cart-3-bold" width={24} />
      </Badge>
    </Box>
  );
}
