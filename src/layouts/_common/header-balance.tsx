import { m } from 'framer-motion';
// @mui
import IconButton from '@mui/material/IconButton';
// components
import { varHover } from '@src/components/animate';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { IconCoinMonero } from "@tabler/icons-react";
import { useBalance } from 'wagmi';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useSession } from '@lens-protocol/react-web';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setBalance } from '@redux/auth';

// ----------------------------------------------------------------------

export default function HeaderBalance() {
  const dispatch = useDispatch();
  const { balance } = useSelector((state: any) => state.auth);
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const { data } = useBalance({
    address: sessionData?.address,
    token: GLOBAL_CONSTANTS.MMC_ADDRESS,
  });

  useEffect(() => {
    if (data?.formatted) {
      const parsedBalance = parseFloat(data.formatted);
      if (!isNaN(parsedBalance)) {
        dispatch(setBalance({ balance: parsedBalance }));
      }
    }
  }, [data?.formatted, dispatch]);

  const balanceOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 };
  const formattedBalance = new Intl.NumberFormat('en-US', balanceOptions).format(balance);

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
        <Typography variant="subtitle2" sx={{ mt: 0.4 }}>{formattedBalance}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.6, fontSize: 10 }}>MMC</Typography>
      </Stack>
    </>
  );
}
