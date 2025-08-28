import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from '@src/theme/css';
import Iconify from '@src/components/iconify';
import { useResponsive } from '@src/hooks/use-responsive';
import ProcessIllustrationCard from '@src/components/process-illustration-card.tsx';

interface ProcessSectionCardProps {
  title: string;
  description: string;
  buttonText: string;
  illustration: string;
  illustrationAlt: string;
  onClick: () => void;
}

const ProcessSectionCard: FC<ProcessSectionCardProps> = ({
  title,
  description,
  buttonText,
  illustration,
  illustrationAlt,
  onClick,
}) => {
  const lgUp = useResponsive('up', 'lg');
  const theme = useTheme();

  return (
    <Stack
      sx={{
        ...bgGradient({
          direction: '135deg',
        }),
        width: {
          xs: 1,
          md: '60%',
        },
        maxWidth: {
          xs: '100%',
          md: 'calc(50%)',
        },
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
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
      >
        <Stack
          justifyContent="flex-start"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          sx={{
            width: '100%',
            flexShrink: 0,
            maxWidth: { xs: '100%', md: '50%' },
            p: {
              xs: theme.spacing(3, 3, 0, 3),
              md: theme.spacing(3),
            },
            textAlign: { xs: 'center', md: 'left' },
            order: { xs: 2, md: 1 },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              display: { md: 'flex' },
              maxWidth: 250,
              mb: 1,
              whiteSpace: 'pre-line',
            }}
          >
            {description}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: { xs: 1, xl: 2 },
            }}
          >
            {title}
          </Typography>
          <LoadingButton
            sx={{
              mt: lgUp ? 1 : null,
              mb: !lgUp ? 3 : null,
            }}
            color="primary"
            variant="soft"
            startIcon={
              <Iconify icon="material-symbols:campaign-outline-rounded" />
            }
            onClick={onClick}
          >
            {buttonText}
          </LoadingButton>
        </Stack>
        <ProcessIllustrationCard
          illustration={illustration}
          alt={illustrationAlt}
        />
      </Stack>
    </Stack>
  );
};

export default ProcessSectionCard;
