import { useCallback } from 'react';
import { m } from 'framer-motion';
// @mui
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// locales
import { useLocales } from '@src/locales';
// components
import Iconify from '@src/components/iconify';
import { varHover } from '@src/components/animate';
import CustomPopover, { usePopover } from '@src/components/custom-popover';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {IconCoinMonero} from "@tabler/icons-react";
import { useAccount, useBalance } from 'wagmi';
import { useAuth } from '@src/hooks/use-auth.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const locales = useLocales();
  const { address } = useAccount();
  const { selectedProfile } = useAuth();
  const { data, isError, isLoading } = useBalance({
    address,
    token: GLOBAL_CONSTANTS.MMC_ADDRESS
  });

  const popover = usePopover();

  const handleChangeLang = useCallback(
    (newLang: string) => {
      locales.onChangeLang(newLang);
      popover.onClose();
    },
    [locales, popover]
  );

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
          // onClick={popover.onOpen}
          sx={{
            width: 40,
            height: 40,
            ...(popover.open && {
              bgcolor: 'action.selected',
            }),
          }}
        >
          {/*<Iconify icon={locales.currentLang.icon} sx={{ borderRadius: 0.65, width: 28 }} />*/}
          <IconCoinMonero style={{ borderRadius: 0.65, width: 64 }} />
        </IconButton>
        <Typography variant="subtitle2" sx={{ mt: 0.4 }}>{formattedBalance}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.6, fontSize: 10 }}>MMC</Typography>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {locales.allLangs.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === locales.currentLang.value}
            onClick={() => handleChangeLang(option.value)}
          >
            <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} />

            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
