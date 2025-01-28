// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { bgGradient } from '@src/theme/css';
import Iconify from '@src/components/iconify';
import { alpha, useTheme } from '@mui/material/styles';
// @ts-ignore
import Process from '@src/assets/illustrations/process.svg';
import Image from '@src/components/image';
import {useBoolean} from "@src/hooks/use-boolean.ts";
import StudioProcessModal from "@src/components/modal.tsx";
import {Box} from "@mui/system";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import {useState} from "react";
import { useResponsive } from '@src/hooks/use-responsive.ts';

const StudioProcess = () => {
  const lgUp = useResponsive('up', 'lg');
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
                    display: {  md: 'flex' },
                    maxWidth: 250,
                    mb: 1,
                    whiteSpace: 'pre-line',
                  }}
                >
                  Bring your story to the screen
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: { xs: 1, xl: 2 },
                  }}
                >
                  Publish your content!
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.8,
                    maxWidth: lgUp ? 220 : 'auto',
                    mb: { xs: 2, xl: 2 },
                  }}
                >
                  Captivate your audience, share your vision and expand your reach.
                </Typography>
                <Button
                  sx={{
                    mt: lgUp ? 1 : null,
                    mb: !lgUp ? 3 : null
                  }}
                  color={'primary'}
                  variant={'soft'}
                  startIcon={<Iconify icon={'material-symbols:campaign-outline-rounded'} />}
                  onClick={handleClick}
                >
                  Publish now!
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
                    height: lgUp ? 240 : 180
                  }}
                  src={Process}
                  alt={'publish movie'}
                />
              </Stack>
            </Stack>
          </>
        </Stack>
        <StudioProcessModal title={'Publish your content'}
                            open={confirmPublish.value}
                            onClose={handleFinishPublish}
                            renderContent={<ProcessContent onClose={handleFinishPublish} />} />
      </>
    </Stack>
  );
};


const ProcessContent = ({ onClose }: { onClose: () => void }) => {
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
    <Stack direction={'column'} sx={{ pb: 3, pt: 2, mt: 1, borderTop: `1px dashed rgb(145, 158, 171, 0.5)` }}>
      <Box sx={{px: 3}}>
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
      </Box>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 2, px: 3, pt: 3, borderTop: `1px dashed rgb(145, 158, 171, 0.5)` }}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          type="submit"
          onClick={handleProcess}
          startIcon={<Iconify icon="material-symbols:publish" />}
          disabled={!hashes || loading}
        >
          Publish
        </LoadingButton>
      </Stack>
    </Stack>
  )
}

export default StudioProcess;
