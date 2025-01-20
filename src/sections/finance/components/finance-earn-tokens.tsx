import 'viem/window';
import { FC } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import { CardProps } from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// theme
import { bgGradient } from '@src/theme/css';
import Iconify from '@src/components/iconify';
import { alpha, useTheme } from '@mui/material/styles';
// @ts-ignore
import Earn from '@src/assets/illustrations/earn.svg';
import Image from '@src/components/image';

interface FinanceEarnTokensProps extends CardProps {
  lgUp: boolean;
}

const FinanceEarnTokens: FC<FinanceEarnTokensProps> = ({ sx, lgUp, ...other }) => {
  const theme = useTheme();

  const handleClick = () => {
    window.open('https://tropee.com/watchit', '_BLANK');
  };

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
            <Typography
              variant="body1"
              sx={{
                display: { xs: 'none', md: 'flex' },
                maxWidth: 250,
                mb: 1,
                whiteSpace: 'pre-line',
              }}
            >
              Earn rewards effortlessly!
            </Typography>
            <Typography
              variant="h3"
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: { xs: 1, xl: 2 },
              }}
            >
              Earn{' '}
              <span
                style={{
                  opacity: 0.5,
                  marginRight: '0.5rem',
                  marginLeft: '0.5rem',
                }}
              >
                MMC
              </span>
              tokens
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.8,
                maxWidth: lgUp ? 220 : 'auto',
                mb: { xs: 1, xl: 2 },
              }}
            >
              Invite your friends and complete tasks to grow your balance.
            </Typography>
            <Button
              sx={{
                mt: lgUp ? 3 : null,
                mb: !lgUp ? 3 : null
              }}
              color={'primary'}
              variant={'soft'}
              startIcon={<Iconify icon={'fluent-emoji:trophy'} />}
              onClick={handleClick}
            >
              Earn now!
            </Button>
          </Stack>
          <Stack
            flexGrow={1}
            justifyContent="center"
            sx={{
              display: { xs: 'none', md: 'flex' },
              p: { xs: 1, md: 1 },
              mb: { xs: 1, md: 0 },
              mx: 'auto',
            }}
          >
            <Image
              sx={{
                height: lgUp ? 240 : 180,
              }}
              src={Earn}
              alt={'Earn MMC tokens'}
            />
          </Stack>
        </Stack>
      </>
    </Stack>
  );
};

export default FinanceEarnTokens;
