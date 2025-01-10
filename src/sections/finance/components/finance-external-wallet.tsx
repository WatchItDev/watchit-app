// React and libraries imports
import React from 'react';

// @mui
import { Box } from '@mui/system';
import { useTheme, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';

// theme
import { bgGradient } from '@src/theme/css';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  connectedWallet: boolean;
  title?: string;
  description?: string;
  info?: string;
  img?: React.ReactNode;
  action?: React.ReactNode;
}

export default function FinanceExternalWallet({
  connectedWallet,
  title,
  description,
  info,
  action,
  img,
  ...other
}: Props) {
  const theme = useTheme();
  return (
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
          flexGrow={1}
          justifyContent="flex-start"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          sx={{
            p: {
              xs: theme.spacing(5, 3, 0, 3),
              md: theme.spacing(3),
            },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="body1" sx={{ mb: connectedWallet ? 1 : 2, whiteSpace: 'pre-line' }}>
            {title}
          </Typography>

          {connectedWallet ? (
            <Typography
              variant="h3"
              sx={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: 250,
                mb: { xs: 1, xl: 2 },
              }}
            >
              {description}{' '}
              <Box
                component={'small'}
                sx={{
                  display: 'inline',
                  opacity: 0.5,
                  fontSize: '0.7em',
                  ml: '0.5rem',
                  mt: 1,
                }}
              >
                MMC
              </Box>
            </Typography>
          ) : (
            action && action
          )}

          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              maxWidth: 250,
              mb: { xs: 1, xl: 2 },
            }}
          >
            {info}
          </Typography>

          {connectedWallet ? action && action : null}
        </Stack>

        {img && (
          <Stack
            component="span"
            justifyContent="center"
            sx={{
              p: { xs: 5, md: 1 },
              maxWidth: 360,
              mx: 'auto',
            }}
          >
            {img}
          </Stack>
        )}
      </Stack>
    </>
  );
}
//
