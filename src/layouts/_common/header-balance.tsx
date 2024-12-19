import { m } from 'framer-motion';
// @mui
import IconButton from '@mui/material/IconButton';
// components
import { varHover } from '@src/components/animate';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { IconCoinMonero } from '@tabler/icons-react';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setBalance } from '@redux/auth';
import { useGetBalance } from '@src/hooks/use-get-balance.ts';

// ----------------------------------------------------------------------

export default function HeaderBalance() {
  const dispatch = useDispatch();
  const { balance: balanceFromRedux } = useSelector((state: any) => state.auth);
  const sessionData = useSelector((state: any) => state.auth.session);
  const { balance: balanceFromContract } = useGetBalance(sessionData?.address);

  useEffect(() => {
    if (balanceFromContract) {
      dispatch(setBalance({ balance: balanceFromContract }));
    }
  }, [balanceFromContract]);

  const balanceOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 };
  const formattedBalance = new Intl.NumberFormat('en-US', balanceOptions).format(balanceFromRedux);

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          sx={{
            width: 40,
            height: 40,
          }}
        >
          <IconCoinMonero style={{ borderRadius: 0.65, width: 64 }} />
        </IconButton>
        <Typography variant="subtitle2" sx={{ mt: 0.4 }}>
          {formattedBalance}
        </Typography>
        {/* <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.6, fontSize: 10 }}>
          MMC
        </Typography> */}
      </Stack>
    </>
  );
}
