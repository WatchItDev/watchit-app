import { m } from 'framer-motion';
// @mui
import IconButton from '@mui/material/IconButton';
// components
import { varHover } from '@src/components/animate';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {IconCoinMonero} from "@tabler/icons-react";
import { useAccount, useBalance } from 'wagmi';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

// ----------------------------------------------------------------------

export default function HeaderBalance() {
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address,
    token: GLOBAL_CONSTANTS.MMC_ADDRESS
  });

  const balanceOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 };
  const formattedBalance = new Intl.NumberFormat('en-US', balanceOptions).format(data?.formatted);

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
