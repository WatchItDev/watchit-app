import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import FormProvider, { RHFTextField, RHFSelect, RHFUpload } from 'src/components/hook-form';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import MovieWizardContentLayout from './movie-new-wizard-layout';

// const MediaAssetsSchema = Yup.object().shape({
//   verticalPoster: Yup.mixed().required('Vertical poster file is required'),
//   horizontalPoster: Yup.mixed().required('Horizontal poster file is required'),
//   wallpaper: Yup.mixed().required('Wallpaper file is required'),
//   trailer: Yup.mixed().required('Trailer file is required'),
//   fullMovie: Yup.mixed().required('Full movie file is required'),
//   videoFormat: Yup.string().required('Video format is required'),
//   resolution: Yup.string().required('Resolution is required'),
//   bitrate: Yup.number().min(0, 'Bitrate cannot be negative').required('Bitrate is required'),
//   codec: Yup.string().required('Codec is required'),
//   audioFormat: Yup.string().required('Audio format is required'),
//   audioChannels: Yup.string().required('Audio channels are required'),
//   audioBitrate: Yup.number().min(0, 'Bitrate cannot be negative').required('Bitrate is required'),
//   subtitles: Yup.mixed().required('Subtitle file is required'),
//   subtitleFormat: Yup.string().required('Subtitle format is required'),
//   subtitleLanguage: Yup.string().required('Subtitle language is required'),
// });

const MediaAssetsSchema = Yup.object().shape({
  verticalPoster: Yup.mixed(),
  horizontalPoster: Yup.mixed(),
  wallpaper: Yup.mixed(),
  trailer: Yup.mixed(),
  fullMovie: Yup.mixed(),
  videoFormat: Yup.string(),
  resolution: Yup.string(),
  bitrate: Yup.number(),
  codec: Yup.string(),
  audioFormat: Yup.string(),
  audioChannels: Yup.string(),
  audioBitrate: Yup.number(),
  subtitles: Yup.mixed(),
  subtitleFormat: Yup.string(),
  subtitleLanguage: Yup.string(),
});

export default function MediaAssetsForm({ onSubmit, onBack, data }: any) {
  const methods = useForm({
    resolver: yupResolver(MediaAssetsSchema),
    defaultValues: {
      verticalPoster: data.verticalPoster ?? '',
      horizontalPoster: data.horizontalPoster ?? '',
      wallpaper: data.wallpaper ?? '',
      trailer: data.trailer ?? '',
      fullMovie: data.fullMovie ?? '',
      videoFormat: data.videoFormat ?? '',
      resolution: data.resolution ?? '',
      bitrate: data.bitrate ?? 0,
      codec: data.codec ?? '',
      audioFormat: data.audioFormat ?? '',
      audioChannels: data.audioChannels ?? '',
      audioBitrate: data.audioBitrate ?? 0,
      subtitleFormat: data.subtitleFormat ?? '',
      subtitleLanguage: data.subtitleLanguage ?? '',
    },
  });

  const {
    setValue
  } = methods;

  const videoFormatOptions = [
    { value: 'mp4', label: 'MP4' },
    { value: 'mkv', label: 'MKV' },
    { value: 'mov', label: 'MOV' },
  ];

  const resolutionOptions = [
    { value: '1920x1080', label: '1920x1080' },
    { value: '3840x2160', label: '3840x2160' },
  ];

  const codecOptions = [
    { value: 'h264', label: 'H.264' },
    { value: 'h265', label: 'H.265' },
  ];

  const audioFormatOptions = [
    { value: 'aac', label: 'AAC' },
    { value: 'mp3', label: 'MP3' },
  ];

  const audioChannelsOptions = [
    { value: 'stereo', label: 'Stereo' },
    { value: 'surround51', label: '5.1 Surround' },
  ];

  const subtitleFormatOptions = [
    { value: 'vtt', label: 'VTT' },
    { value: 'srt', label: 'SRT' },
  ];

  const subtitleLanguageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
  ];

  const handleDropSingleFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValue('verticalPoster', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <MovieWizardContentLayout data={data} showNext showBack onBack={onBack}>
        <Grid xs={12}>
          <Card sx={{ backgroundColor: 'transparent' }}>
            <CardHeader title="Media Assets" />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Vertical Poster
                  </Typography>
                  <RHFUpload
                    thumbnail
                    name="verticalPoster"
                    onDrop={handleDropSingleFile}
                    helperText="Upload the vertical poster image"
                    accept={{ 'image/*': [] }}
                    onRemove={(inputFile) => { console.log('on remove: ', inputFile) }}
                    onRemoveAll={() => { console.log('on remove all') }}
                    onUpload={() => console.info('ON UPLOAD')}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Horizontal Poster
                  </Typography>
                  <RHFUpload
                    name="horizontalPoster"
                    helperText="Upload the horizontal poster image"
                    accept={{ 'image/*': [] }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Wallpaper
                  </Typography>
                  <RHFUpload
                    name="wallpaper"
                    helperText="Upload the wallpaper image"
                    accept={{ 'image/*': [] }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Trailer
                  </Typography>
                  <RHFUpload
                    name="trailer"
                    helperText="Upload the trailer file"
                    accept={{ 'video/*': [] }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Full Movie
                  </Typography>
                  <RHFUpload
                    name="fullMovie"
                    helperText="Upload the full movie file"
                    accept={{ 'video/*': [] }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Subtitles
                  </Typography>
                  <RHFUpload
                    name="subtitles"
                    helperText="Upload the subtitle file"
                    accept={{ '.srt,.vtt': [] }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12}>
          <Card sx={{ backgroundColor: 'transparent' }}>
            <CardHeader title="Technical Details" />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="videoFormat" label="Video Format" InputLabelProps={{ shrink: true }}>
                    {videoFormatOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="resolution" label="Resolution" InputLabelProps={{ shrink: true }}>
                    {resolutionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="bitrate" label="Bitrate (Mbps)" type="number" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="codec" label="Codec" InputLabelProps={{ shrink: true }}>
                    {codecOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="audioFormat" label="Audio Format" InputLabelProps={{ shrink: true }}>
                    {audioFormatOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="audioChannels" label="Audio Channels" InputLabelProps={{ shrink: true }}>
                    {audioChannelsOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="audioBitrate" label="Bitrate (kbps)" type="number" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="subtitleFormat" label="Subtitle Format" InputLabelProps={{ shrink: true }}>
                    {subtitleFormatOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="subtitleLanguage" label="Subtitle Language" InputLabelProps={{ shrink: true }}>
                    {subtitleLanguageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Grid>
      </MovieWizardContentLayout>
    </FormProvider>
  );
}
