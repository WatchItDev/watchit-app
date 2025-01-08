// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// theme
import { bgGradient } from '@src/theme/css';
import Iconify from '@src/components/iconify';
import { alpha, useTheme } from '@mui/material/styles';
// @ts-ignore
import Process from '@src/assets/illustrations/process.svg';
import Image from '@src/components/image';
import {useBoolean} from "@src/hooks/use-boolean.ts";
import StudioProcessModal from "@src/sections/studio/components/studio-process-modal.tsx";
import {Box} from "@mui/system";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import {useState} from "react";

const StudioProcess = () => {

  const confirmPublish = useBoolean();
  const theme = useTheme();

  const handleFinishPublish = () => {
    confirmPublish.onFalse?.();
  };

  const handleClick = () => {
    confirmPublish.onTrue?.();
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
                maxWidth: 350,
                mb: 1,
                whiteSpace: 'pre-line',
              }}
            >
              Share your content to the community
            </Typography>
            <Typography
              variant="h3"
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: { xs: 1, xl: 2 },
              }}
            >
              Share{' '}your content and start to earn
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.8,
                maxWidth: 450,
                mb: { xs: 1, xl: 2 },
              }}
            >
              Publish your content and distribute to the community
            </Typography>
            <Button
              sx={{ mt:  5 }}
              color={'primary'}
              variant={'soft'}
              startIcon={<Iconify icon={'material-symbols:publish'} />}
              onClick={handleClick}
            >
              Publish
            </Button>
          </Stack>
          <Stack
            flexGrow={1}
            justifyContent="center"
            sx={{
              p: { xs: 1, md: 1 },
              mb: { xs: 1, md: 0 },
              mx: 'auto',
            }}
          >
            <Image
              sx={{
                margin: 'auto',
                width: '50%',
                height: 'auto',
              }}
              src={Process}
              alt={'Publish your content'}
            />
          </Stack>
        </Stack>
        <StudioProcessModal title={'Publish your content'}
                            open={confirmPublish.value}
                            onClose={handleFinishPublish}
                            renderContent={<ProcessContent />} />
      </>
    </Stack>
  );
};


const ProcessContent = () => {
  const [loading, setLoading] = useState(false);
  const [hashes, setHashes] = useState<string>('');

  const handleProcess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleHashesChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    setHashes(_event.target.value);
  }

  return (
    <Stack direction={'column'}>
      <Box sx={{p:3}}>
        <Typography variant="body1">
          Enter the hash of the content you want to publish
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          You can enter several hashes separated by commas.
        </Typography>

        <TextField
          sx={{ mt: 1, mb:2 }}
          fullWidth
          autoFocus
          label="Content Hash(es)"
          type="text"
          value={hashes}
          onChange={handleHashesChange}
          placeholder="Enter the hash (or hashes) of the content"
        />

        <LoadingButton
          variant="contained"
          color="primary"
          loading={loading}
          onClick={handleProcess}
          startIcon={<Iconify icon={'material-symbols:publish'} />}
        >
          Publish
        </LoadingButton>
      </Box>
    </Stack>
  )
}

export default StudioProcess;
