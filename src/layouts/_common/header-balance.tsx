// MUI IMPORTS
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// LOCAL IMPORTS
import { useGetBalance } from '@src/hooks/protocol/use-get-balance.ts';
import mmcTokenIcon from '@src/assets/mmc_token.ico';
import { paths } from '@src/routes/paths.ts';
import { useRouter } from '@src/routes/hooks';
import { formatBalanceNumber } from '@src/utils/format-number.ts';

// ----------------------------------------------------------------------

export default function HeaderBalance() {
  const { balance } = useGetBalance();
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
          <Tooltip title="Native currency">
            <img
              src={mmcTokenIcon}
              alt="MMC Token"
              style={{ width: 230, height: 20, borderRadius: '0.65rem' }}
            />
          </Tooltip>
        </Box>
        <Tooltip title="MMC tokens balance">
          <Typography variant="subtitle2" sx={{ textAlign: 'left' }} noWrap>
            {formatBalanceNumber(balance)}
          </Typography>
        </Tooltip>
      </Stack>
    </Button>
  );
}
