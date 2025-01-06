import "viem/window";
// @mui
import Stack from '@mui/material/Stack';
import { CardProps } from '@mui/material/Card';

// theme
import { bgGradient } from '@src/theme/css';

// Import necessary hooks and clients
import { FC } from 'react';
import Button from "@mui/material/Button";
import Iconify from "@src/components/iconify";
import {alpha, useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Earn from "@src/assets/illustrations/earn.svg";
import Image from "@src/components/image";

interface FinanceEarnTokensProps extends CardProps{
  lgUp: boolean
}

const FinanceEarnTokens: FC<FinanceEarnTokensProps> = ({ sx, lgUp, ...other }) => {

  const theme = useTheme();

  const handleClick = () => {
    window.open('https://tropee.com/watchit','_BLANK')
  }

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
      <>
        <Stack
          flexDirection={{ xs: 'column', md: 'row' }}
          sx={{
            ...bgGradient({
              direction: '135deg',
              startColor: alpha(theme.palette.primary.light, 0.2),
              endColor: alpha(theme.palette.primary.main, 0.2),
            }),
            height: { md: 1 },
            borderTopRightRadius: 2,
            borderTopLeftRadius: 2,
            position: 'relative',
            color: 'primary.darker',
            backgroundColor: 'common.white',
          }}
          {...other}
        >
          <Stack
            justifyContent="flex-start"
            alignItems={{ xs: 'center', md: 'flex-start' }}
            sx={{
              maxWidth: { xs: '100%', md: '60%' },
              p: {
                xs: theme.spacing(5, 3, 0, 3),
                md: theme.spacing(3),
              },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography variant="body1" sx={{ maxWidth: lgUp ? 250 : 'auto' , mb: 1, whiteSpace: 'pre-line' }}>
              ¡Complete some tasks and win!
            </Typography>
            <Typography
              variant="h3"
              sx={{
                display:'flex',
                alignItems: 'center',
                mb: { xs: 1, xl: 2 },
              }}
            >
              Earn <span style={{
              opacity: 0.5, marginRight: '0.5rem', marginLeft: '0.5rem',
            }}>MMC</span>tokens
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.8,
                maxWidth: 220,
                mb: { xs: 1, xl: 2 },
              }}
            >
              Invite your family and friends and claims your rewards.
            </Typography>
            <Button sx={{mt:lgUp ? 3: null}} color={'primary'} variant={'soft'} startIcon={<Iconify icon={'fluent-emoji:trophy'} />} onClick={handleClick}>Earn tokens</Button>
          </Stack>
          <Stack
            flexGrow={1}
            justifyContent="center"
            sx={{
              p: { xs: 5, md: 1 },
              mx: 'auto',
            }}
          >
            <Image sx={{
              height:  240 ,
            }} src={Earn} alt={'Earn MMC tokens'}/>
          </Stack>
        </Stack>
      </>
    </Stack>
  );
};

export default FinanceEarnTokens;
