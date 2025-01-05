// MUI IMPORTS
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// LOCAL IMPORTS
import { useGetBalance } from '@src/hooks/use-get-balance.ts';
// @ts-ignore
import mmcTokenIcon from '@src/assets/mmc_token.ico';
import { paths } from '@src/routes/paths.ts';
import { useRouter } from '@src/routes/hooks';
import { formatBalanceNumber } from '@src/utils/format-number.ts';
import Iconify from "@src/components/iconify";

// ----------------------------------------------------------------------

export default function HeaderBalance() {
  const { balance } = useGetBalance();
  const router = useRouter();

  const handleGoFinance = () => {
    router.push(paths.dashboard.finance)
  }

  const handleClick = () => {
    window.open('https://tropee.com/watchit','_BLANK')
  }

  return (
    <Button variant={'text'} sx={{ px: 1.5, py: 1, mr: -0.75 }} onClick={handleGoFinance}>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Button sx={{mr:1}} startIcon={<Iconify icon={'fluent-emoji:trophy'} />} onClick={handleClick}>Earn tokens</Button>
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
          <img
            src={mmcTokenIcon}
            alt="MMC Token"
            style={{ width: 230, height: 20, borderRadius: '0.65rem' }}
          />
        </Box>
        <Typography variant="subtitle2" sx={{ textAlign: 'left' }} noWrap>
          {formatBalanceNumber(balance)}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.6, fontSize: 10 }}>
          MMC
        </Typography>
      </Stack>
    </Button>
  );
}
