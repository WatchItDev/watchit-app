import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setBalance } from '@redux/auth';
import { useGetBalance } from '@src/hooks/use-get-balance.ts';
// @ts-ignore
import mmcTokenIcon from '@src/assets/mmc_token.ico';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { paths } from '@src/routes/paths.ts';
import { useRouter } from '@src/routes/hooks';
import { useGetVaultBalance } from '@src/hooks/use-get-vault-balance.ts';
import { useDeposit } from '@src/hooks/use-deposit.ts';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

export default function HeaderBalance() {
  const dispatch = useDispatch();
  const { balance: balanceFromRedux } = useSelector((state: any) => state.auth);
  const sessionData = useSelector((state: any) => state.auth.session);
  const { balance: balanceFromContract } = useGetBalance(sessionData?.address);
  const { balance: vaultBalance } = useGetVaultBalance(sessionData?.address);
  const { data, deposit, loading, error } = useDeposit();
  const router = useRouter();

  console.log('vaultBalance', vaultBalance)
  console.log('data', data)
  console.log('error', error)

  useEffect(() => {
    if (balanceFromContract) {
      dispatch(setBalance({ balance: balanceFromContract }));
    }
  }, [balanceFromContract]);

  const balanceOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 };
  const formattedBalance = new Intl.NumberFormat('en-US', balanceOptions).format(balanceFromRedux);
  const formattedVaultBalance = new Intl.NumberFormat('en-US', balanceOptions).format(vaultBalance as any);

  const handleGoFinance = () => {
    router.push(paths.dashboard.finance)
  }

  const handleAddFunds = () => {
    deposit({ recipient: sessionData?.address, amount: 100 });
  }

  return (
    <>
      <LoadingButton variant={'outlined'} onClick={handleAddFunds} loading={loading}>
        Add funds to vault
      </LoadingButton>
      <Button variant={'text'} sx={{ px: 1.5, py: 0.4 }} onClick={handleGoFinance}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Box
            sx={{
              width: 23,
              height: 23,
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
              style={{ width: 23, height: 23, borderRadius: '0.65rem' }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ textAlign: 'left' }} noWrap>
              {formattedBalance}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'left' }} noWrap>
              {formattedVaultBalance}
            </Typography>
          </Box>
          {/*<Typography variant="subtitle2" sx={{ mt: 0.4 }}>*/}
          {/*  {formattedBalance}*/}
          {/*</Typography>*/}
          {/*<Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.6, fontSize: 10 }}>*/}
          {/*  MMC*/}
          {/*</Typography>*/}
        </Stack>
      </Button>
    </>
  );
}
