import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import FormProvider, { RHFTextField, RHFSelect, RHFUpload } from '@src/components/hook-form';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MovieWizardContentLayout from './movie-new-wizard-layout';
import Image from '../../components/image';
import SingleFilePreviewCustom from '../../components/upload/preview-single-file-custom';

type MediaAssetFields =
  | 'verticalPoster'
  | 'horizontalPoster'
  | 'wallpaper'
  | 'trailer'
  | 'fullMovie'
  | 'videoFormat'
  | 'resolution'
  | 'bitrate'
  | 'codec'
  | 'audioFormat'
  | 'audioChannels'
  | 'audioBitrate'
  | 'subtitles'
  | 'subtitleFormat'
  | 'subtitleLanguage';


const MediaAssetsSchema = Yup.object().shape({
  verticalPoster: Yup.mixed().required('Vertical poster file is required'),
  horizontalPoster: Yup.mixed().required('Horizontal poster file is required'),
  wallpaper: Yup.mixed().required('Wallpaper file is required'),
  trailer: Yup.mixed().required('Trailer file is required'),
  fullMovie: Yup.mixed().required('Full movie file is required'),
  videoFormat: Yup.string().required('Video format is required'),
  resolution: Yup.string().required('Resolution is required'),
  bitrate: Yup.number().min(0, 'Bitrate cannot be negative').required('Bitrate is required'),
  codec: Yup.string().required('Codec is required'),
  audioFormat: Yup.string().required('Audio format is required'),
  audioChannels: Yup.string().required('Audio channels are required'),
  audioBitrate: Yup.number().min(0, 'Bitrate cannot be negative').required('Bitrate is required'),
  subtitles: Yup.mixed().required('Subtitle file is required'),
  subtitleFormat: Yup.string().required('Subtitle format is required'),
  subtitleLanguage: Yup.string().required('Subtitle language is required'),
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

  const { watch, setValue } = methods;

  const values = watch();

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
    (input: MediaAssetFields, acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValue(input, newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <MovieWizardContentLayout data={{...data, ...values}} showNext showBack onBack={onBack}>
        <Grid xs={12}>
          <Card sx={{ backgroundColor: 'transparent' }}>
            <CardHeader title="Media Assets" />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Typography variant="subtitle1" gutterBottom>
                    Vertical Poster
                  </Typography>
                  <RHFUpload
                    thumbnail
                    thumbnailRatio="4/6"
                    name="verticalPoster"
                    onDrop={(acceptedFiles) => { handleDropSingleFile('verticalPoster', acceptedFiles) }}
                    helperText="Upload the vertical poster image"
                    accept={{ 'image/*': [] }}
                    onRemove={(inputFile) => { console.log('on remove: ', inputFile) }}
                    onRemoveAll={() => { console.log('on remove all') }}
                    onUpload={() => console.info('ON UPLOAD')}
                    singleFilePreview={SingleFilePreviewCustom}
                    isCustomPreview
                    placeholder={(
                      <Box sx={{ height: '15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                        <Image src="/assets/illustrations/poster_skeleton.png" />
                      </Box>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={7}>
                  <Typography variant="subtitle1" gutterBottom>
                    Horizontal Poster
                  </Typography>
                  <RHFUpload
                    thumbnail
                    thumbnailRatio="16/9"
                    name="horizontalPoster"
                    onDrop={(acceptedFiles) => { handleDropSingleFile('horizontalPoster', acceptedFiles) }}
                    helperText="Upload the horizontal poster image"
                    accept={{ 'image/*': [] }}
                    onRemove={(inputFile) => { console.log('on remove: ', inputFile) }}
                    onRemoveAll={() => { console.log('on remove all') }}
                    onUpload={() => console.info('ON UPLOAD')}
                    singleFilePreview={SingleFilePreviewCustom}
                    isCustomPreview
                    placeholder={(
                      <Box sx={{ height: '15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                        <Image src="/assets/illustrations/poster_horizontal_skeleton.png" />
                      </Box>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Wallpaper
                  </Typography>
                  <RHFUpload
                    thumbnail
                    thumbnailRatio="21/9"
                    name="wallpaper"
                    onDrop={(acceptedFiles) => { handleDropSingleFile('wallpaper', acceptedFiles) }}
                    helperText="Upload the wallpaper image"
                    accept={{ 'image/*': [] }}
                    onRemove={(inputFile) => { console.log('on remove: ', inputFile) }}
                    onRemoveAll={() => { console.log('on remove all') }}
                    onUpload={() => console.info('ON UPLOAD')}
                    singleFilePreview={SingleFilePreviewCustom}
                    isCustomPreview
                    placeholder={(
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                        <Image src="/assets/illustrations/poster_extended_skeleton.png" />
                      </Box>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Full Movie
                  </Typography>
                  <RHFUpload
                    thumbnail
                    name="fullMovie"
                    onDrop={(acceptedFiles) => { handleDropSingleFile('fullMovie', acceptedFiles) }}
                    helperText="Upload the full movie file"
                    accept={{ 'video/*': [] }}
                    onRemove={(inputFile) => { console.log('on remove: ', inputFile) }}
                    onRemoveAll={() => { console.log('on remove all') }}
                    onUpload={() => console.info('ON UPLOAD')}
                    placeholder={(
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                        <Image src="/assets/illustrations/movie_skeleton.png" />
                      </Box>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Trailer
                  </Typography>
                  <RHFUpload
                    thumbnail
                    name="trailer"
                    onDrop={(acceptedFiles) => { handleDropSingleFile('trailer', acceptedFiles) }}
                    helperText="Upload the trailer file"
                    accept={{ 'video/*': [] }}
                    onRemove={(inputFile) => { console.log('on remove: ', inputFile) }}
                    onRemoveAll={() => { console.log('on remove all') }}
                    onUpload={() => console.info('ON UPLOAD')}
                    placeholder={(
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                        <Image src="/assets/illustrations/movie_skeleton.png" />
                      </Box>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Subtitles
                  </Typography>
                  <RHFUpload
                    thumbnail
                    name="subtitles"
                    onDrop={(acceptedFiles) => { handleDropSingleFile('subtitles', acceptedFiles) }}
                    helperText="Upload the subtitle file"
                    accept={{ 'text/vtt': ['.vtt'], 'application/x-subrip': ['.srt'] }}
                    onRemove={(inputFile) => { console.log('on remove: ', inputFile) }}
                    onRemoveAll={() => { console.log('on remove all') }}
                    onUpload={() => console.info('ON UPLOAD')}
                    placeholder={(
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                        <Image src="/assets/illustrations/movie_subtitle_skeleton.png" />
                      </Box>
                    )}
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
                  <RHFSelect name="videoFormat" label="Video Format">
                    {videoFormatOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect name="resolution" label="Resolution">
                    {resolutionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="bitrate" label="Bitrate (Mbps)" type="number" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect name="codec" label="Codec">
                    {codecOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect name="audioFormat" label="Audio Format">
                    {audioFormatOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect name="audioChannels" label="Audio Channels">
                    {audioChannelsOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="audioBitrate" label="Bitrate (kbps)" type="number" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect name="subtitleFormat" label="Subtitle Format">
                    {subtitleFormatOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect name="subtitleLanguage" label="Subtitle Language">
                    {subtitleLanguageOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
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
