// @mui
import Stack from '@mui/material/Stack';
import { CardProps } from '@mui/material/Card';

// theme
import { bgGradient } from '@src/theme/css';
// components
import Iconify from '@src/components/iconify';
import Button from "@mui/material/Button";

import FinanceExternalWallet from './finance-external-wallet.tsx';
import SeoIllustration from "@src/assets/illustrations/seo-illustration.tsx";
// ----------------------------------------------------------------------

interface Props extends CardProps {
  connectedWalllet: boolean;
  title: string;
  info: string;
  balance: number;
}

export default function FinanceQuickActions({
  connectedWalllet,
  title,
  balance,
  info,
  sx,
  ...other
}: Props) {
  const totalOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 };
  const formattedTotal = new Intl.NumberFormat('en-US', totalOptions).format(balance);

  return (
    <Stack
      sx={{
        ...bgGradient({
          direction: '135deg',
        }),
        width: 1,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
          <FinanceExternalWallet
            connectedWallet={connectedWalllet}
            title={title}
            info={info}
            description={formattedTotal}
            img={<SeoIllustration />}
            action={
              <>
                {
                  connectedWalllet ? (<Button
                    sx={{mb:2, mt:2}}
                    startIcon={<Iconify icon="solar:wallet-2-outline" />}
                    variant="contained" color="secondary">
                    Change wallet
                  </Button>) : (<Button
                    sx={{mb:3}}

                    startIcon={<Iconify icon="solar:wallet-2-outline" />}
                    variant="contained" color="secondary">
                    Connect wallet
                  </Button>)
                }
              </>
            }
          />
    </Stack>
  )
}
