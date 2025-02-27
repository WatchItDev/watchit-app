import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
// components
import Iconify from '@src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  icon: string;
  title: string;
  value: number;
  color?: string;
}

export default function FinanceWalletTransferWidgetHorizontal({
  title,
  icon,
  color,
  value,
}: Props) {
  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 1, minWidth: 150 }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
        <Iconify icon={icon} width={32} sx={{ color, position: 'absolute' }} />

        <CircularProgress
          variant="determinate"
          value={100}
          size={56}
          thickness={3}
          sx={{ color, opacity: 0.48 }}
        />
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="subtitle1">{title}</Typography>

        <Box component="span" sx={{ color: 'text.disabled', typography: 'body2' }}>
          Balance
        </Box>

        <Typography variant="subtitle2">{value} MMC</Typography>
      </Stack>
    </Stack>
  );
}
