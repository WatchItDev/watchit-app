import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormProvider, { RHFTextField, RHFSelect, RHFMultiSelect } from '@src/components/hook-form';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import MovieWizardContentLayout from './movie-new-wizard-layout';

const MovieInformationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  genre: Yup.array().min(1, 'At least one genre is required').required('Genre is required'),
  releaseDate: Yup.date().required('Release date is required'),
  duration: Yup.number().min(1, 'Duration must be greater than 0').required('Duration is required'),
  language: Yup.string().required('Language is required'),
  country: Yup.string().required('Country of origin is required'),
  rating: Yup.string().required('Rating is required'),
  format: Yup.string().required('Format is required'),
  studioName: Yup.string().required('Studio name is required'),
  filmingLocation: Yup.string().required('Filming location is required'),
  budget: Yup.number().min(0, 'Budget cannot be negative').required('Estimated budget is required'),
  filmingStart: Yup.date().required('Filming start date is required'),
  filmingEnd: Yup.date().required('Filming end date is required'),
  director: Yup.string().required('Director name is required'),
  writer: Yup.string().required('Writer name is required'),
  producers: Yup.string().required('Producers names are required'),
  editor: Yup.string().required('Editor name is required'),
  soundEngineer: Yup.string().required('Sound engineer name is required'),
  vfxSupervisor: Yup.string().required('VFX supervisor name is required'),
  leadActor: Yup.string().required('Lead actor name is required'),
  supportingActor: Yup.string().required('Supporting actor name is required'),
  supportingActress: Yup.string().required('Supporting actress name is required'),
});

export default function MovieInformationForm({ onSubmit, data }: any) {
  const methods = useForm({
    resolver: yupResolver(MovieInformationSchema),
    defaultValues: {
      title: data.title ?? '',
      description: data.description ?? '',
      genre: data.genre ?? [],
      releaseDate: data.releaseDate ?? undefined,
      duration: data.duration ?? 0,
      language: data.language ?? '',
      country: data.country ?? '',
      rating: data.rating ?? '',
      format: data.format ?? '',
      studioName: data.studioName ?? '',
      filmingLocation: data.filmingLocation ?? '',
      budget: data.budget ?? 0,
      filmingStart: data.filmingStart ?? undefined,
      filmingEnd: data.filmingEnd ?? undefined,
      director: data.director ?? '',
      writer: data.writer ?? '',
      producers: data.producers ?? '',
      editor: data.editor ?? '',
      soundEngineer: data.soundEngineer ?? '',
      vfxSupervisor: data.vfxSupervisor ?? '',
      leadActor: data.leadActor ?? '',
      supportingActor: data.supportingActor ?? '',
      supportingActress: data.supportingActress ?? '',
    },
  });

  const { watch, formState: { errors } } = methods;

  const values = watch();

  const genreOptions = [
    { value: 'drama', label: 'Drama' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'action', label: 'Action' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'horror', label: 'Horror' },
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
  ];

  console.log('errors')
  console.log(errors)

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <MovieWizardContentLayout data={{...data, ...values}} showNext>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: 'transparent' }}>
            <CardHeader title="Basic Movie Information" />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="title" label="Title" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="duration" label="Duration (minutes)" type="number" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFMultiSelect name="genre" label="Genre" options={genreOptions} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={12} md={6} >
                  <Controller
                    name="releaseDate"
                    control={methods.control}
                    render={({ field }) => (
                      <DatePicker
                        label="Release Date"
                        sx={{ width: '100%' }}
                        {...field}
                        onChange={(date) => field.onChange(date as any)}
                      />
                    )}
                  />
                  {errors?.releaseDate ? <Typography variant="caption" color="error" sx={{ px: 2 }}><>{ errors?.releaseDate?.message ?? '' }</></Typography> : undefined}
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect name="language" label="Language">
                    {languageOptions.map((option) => (
                      <MenuItem key={option.value} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect name="country" label="Country of Origin">
                    <MenuItem value="usa">USA</MenuItem>
                    <MenuItem value="canada">Canada</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect name="rating" label="Rating">
                    <MenuItem value="g">G</MenuItem>
                    <MenuItem value="pg">PG</MenuItem>
                    <MenuItem value="pg13">PG-13</MenuItem>
                    <MenuItem value="r">R</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect name="format" label="Format">
                    <MenuItem value="sd">SD</MenuItem>
                    <MenuItem value="hd">HD</MenuItem>
                    <MenuItem value="4k">4K</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="description" label="Description" multiline rows={4} />
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ backgroundColor: 'transparent' }}>
            <CardHeader title="Production Details" />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="studioName" label="Studio Name" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="filmingLocation" label="Primary Filming Location" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="budget" label="Estimated Budget" type="number" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <Controller
                    name="filmingStart"
                    control={methods.control}
                    render={({ field }) => (
                      <DatePicker
                        label="Filming Start Date"
                        sx={{ width: '100%' }}
                        {...field}
                        onChange={(date) => field.onChange(date as any)}
                      />
                    )}
                  />
                  {errors?.filmingStart ? <Typography variant="caption" color="error" sx={{ px: 2 }}><>{ errors?.filmingStart?.message ?? '' }</></Typography> : undefined}
                </Grid>
                <Grid item xs={12} md={6} >
                  <Controller
                    name="filmingEnd"
                    control={methods.control}
                    render={({ field }) => (
                      <DatePicker
                        label="Filming End Date"
                        sx={{ width: '100%' }}
                        {...field}
                        onChange={(date) => field.onChange(date as any)}
                      />
                    )}
                  />
                  {errors?.filmingEnd ? <Typography variant="caption" color="error" sx={{ px: 2 }}><>{ errors?.filmingEnd?.message ?? '' }</></Typography> : undefined}
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="director" label="Director" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="writer" label="Writer" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="producers" label="Producers" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="editor" label="Editor" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="soundEngineer" label="Sound Engineer" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="vfxSupervisor" label="VFX Supervisor" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="leadActor" label="Lead Actor" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="supportingActor" label="Supporting Actor" />
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFTextField name="supportingActress" label="Supporting Actress" />
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Grid>
      </MovieWizardContentLayout>
    </FormProvider>
  );
}
