// MUI IMPORTS
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// LOCAL IMPORTS
import xpBadgeIcon from '@src/assets/xp_badge.ico';
import { paths } from '@src/routes/paths.ts';
import { useRouter } from '@src/routes/hooks';
import { formatBalanceNumber } from '@src/utils/format-number.ts';
import { useAuth } from '@src/hooks/use-auth.ts';

// ----------------------------------------------------------------------

export default function HeaderXpBalance() {
  const { session } = useAuth();
  const router = useRouter();

  const handleGoFinance = () => {
    router.push(paths.dashboard.finance);
  };

  return (
    <Button variant={'text'} sx={{ px: 1.5, py: 1, mr: -0.75 }} onClick={handleGoFinance}>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Box
          sx={{
            width: 20,
            height: 20,
            marginRight: 1,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Tooltip title="You can redeem XP for MMC!">
            <img
              src={xpBadgeIcon}
              alt="Xp badge"
              style={{ width: 230, height: 20, borderRadius: '0.65rem' }}
            />
          </Tooltip>
        </Box>
        <Tooltip title="XP balance">
          <Typography variant="subtitle2" sx={{ textAlign: 'left' }} noWrap>
            {formatBalanceNumber(session?.user?.xpBalance ?? 0)}
          </Typography>
        </Tooltip>
      </Stack>
    </Button>
  );
}
