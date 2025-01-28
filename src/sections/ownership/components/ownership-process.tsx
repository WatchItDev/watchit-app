// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

// Hooks and internal components
import { bgGradient } from '@src/theme/css';
import Iconify from '@src/components/iconify';
import Image from '@src/components/image';
import { useBoolean } from '@src/hooks/use-boolean';
import { useResponsive } from '@src/hooks/use-responsive';

import StudioProcessModal from '@src/components/modal';

// Example of an illustration
// @ts-ignore
import Process from '@src/assets/illustrations/process.svg';

import { useState } from 'react';

const OwnershipProcess = () => {
  // Determine if screen is large (lg) or up
  const lgUp = useResponsive('up', 'lg');

  // Boolean hook to control modal open/close
  const confirmOwnership = useBoolean();

  const theme = useTheme();

  // Called when the registration process finishes
  const handleFinishOwnership = () => {
    confirmOwnership.onFalse?.();
  };

  // Called when user clicks the "Register now" button
  const handleClickRegister = () => {
    confirmOwnership.onTrue?.();
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
      }}
    >
      {/* Main banner / container */}
      <Stack
        sx={{
          ...bgGradient({
            direction: '135deg',
          }),
          width: '60%',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Content section with text and illustration */}
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
          {/* Text column */}
          <Stack
            justifyContent="flex-start"
            alignItems={{ xs: 'center', md: 'flex-start' }}
            sx={{
              width: '100%',
              flexShrink: 0,
              maxWidth: { xs: '100%', md: '50%' },
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
                display: { md: 'flex' },
                maxWidth: 250,
                mb: 1,
                whiteSpace: 'pre-line',
              }}
            >
              Protect the authorship of your content
            </Typography>

            <Typography
              variant="h3"
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: { xs: 1, xl: 2 },
              }}
            >
              Register your ownership!
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.8,
                maxWidth: lgUp ? 220 : 'auto',
                mb: { xs: 2, xl: 2 },
              }}
            >
              Secure your copyrights and prove your authorship.
            </Typography>

            <Button
              sx={{
                mt: lgUp ? 1 : null,
                mb: !lgUp ? 3 : null,
              }}
              color="primary"
              variant="soft"
              startIcon={<Iconify icon="material-symbols:campaign-outline-rounded" />}
              onClick={handleClickRegister}
            >
              Register now
            </Button>
          </Stack>

          {/* Illustration column */}
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
              src={Process}
              alt="register ownership"
            />
          </Stack>
        </Stack>
      </Stack>

      {/* Modal for the ownership registration process */}
      <StudioProcessModal
        title="Intellectual Property Registration"
        open={confirmOwnership.value}
        onClose={handleFinishOwnership}
        renderContent={
          <OwnershipProcessContent onClose={handleFinishOwnership} />
        }
      />
    </Stack>
  );
};

const OwnershipProcessContent = ({ onClose }: { onClose: () => void }) => {
  // Controls the loading state while registering
  const [loading, setLoading] = useState(false);

  // Holds the comma-separated hashes
  const [hashes, setHashes] = useState<string>('');

  // Simulates a registration process (e.g., an API call)
  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 2000);
  };

  // Handles changes in the hash(es) input
  const handleHashesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHashes(event.target.value);
  };

  return (
    <Stack
      direction="column"
      sx={{ pb: 3, pt: 2, mt: 1, borderTop: '1px dashed rgba(145, 158, 171, 0.5)' }}
    >
      <Box sx={{ px: 3 }}>
        <Typography variant="body1">
          Enter the hash(es) of the content you want to register
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          You can enter multiple hashes separated by commas.
        </Typography>

        <TextField
          sx={{ mt: 1, mb: 2 }}
          fullWidth
          autoFocus
          label="Content Hash(es)"
          type="text"
          value={hashes}
          onChange={handleHashesChange}
          placeholder="e.g., hash1,hash2,hash3"
        />
      </Box>

      {/* Buttons at the bottom of the modal */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{
          mt: 2,
          px: 3,
          pt: 3,
          borderTop: '1px dashed rgba(145, 158, 171, 0.5)',
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          type="submit"
          onClick={handleRegister}
          startIcon={<Iconify icon="material-symbols:publish" />}
          disabled={!hashes || loading}
          loading={loading}
        >
          Register
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default OwnershipProcess;
