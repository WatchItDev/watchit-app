import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormProvider, { RHFTextField, RHFSelect, RHFMultiSelect } from 'src/components/hook-form';
import MovieWizardContentLayout from './movie-new-wizard-layout';

// const MovieInformationSchema = Yup.object().shape({
//   title: Yup.string().required('Title is required'),
//   description: Yup.string().required('Description is required'),
//   genre: Yup.array().min(1, 'At least one genre is required').required('Genre is required'),
//   releaseDate: Yup.date().required('Release date is required'),
//   duration: Yup.number().min(1, 'Duration must be greater than 0').required('Duration is required'),
//   language: Yup.string().required('Language is required'),
//   country: Yup.string().required('Country of origin is required'),
//   rating: Yup.string().required('Rating is required'),
//   format: Yup.string().required('Format is required'),
//   studioName: Yup.string().required('Studio name is required'),
//   filmingLocation: Yup.string().required('Filming location is required'),
//   budget: Yup.number().min(0, 'Budget cannot be negative').required('Estimated budget is required'),
//   filmingStart: Yup.date().required('Filming start date is required'),
//   filmingEnd: Yup.date().required('Filming end date is required'),
//   director: Yup.string().required('Director name is required'),
//   writer: Yup.string().required('Writer name is required'),
//   producers: Yup.string().required('Producers names are required'),
//   editor: Yup.string().required('Editor name is required'),
//   soundEngineer: Yup.string().required('Sound engineer name is required'),
//   vfxSupervisor: Yup.string().required('VFX supervisor name is required'),
//   leadActor: Yup.string().required('Lead actor name is required'),
//   supportingActor: Yup.string().required('Supporting actor name is required'),
//   supportingActress: Yup.string().required('Supporting actress name is required'),
// });

const MovieInformationSchema = Yup.object().shape({
  title: Yup.string(),
  description: Yup.string(),
  genre: Yup.array(),
  releaseDate: Yup.date(),
  duration: Yup.number(),
  language: Yup.string(),
  country: Yup.string(),
  rating: Yup.string(),
  format: Yup.string(),
  studioName: Yup.string(),
  filmingLocation: Yup.string(),
  budget: Yup.number(),
  filmingStart: Yup.date(),
  filmingEnd: Yup.date(),
  director: Yup.string(),
  writer: Yup.string(),
  producers: Yup.string(),
  editor: Yup.string(),
  soundEngineer: Yup.string(),
  vfxSupervisor: Yup.string(),
  leadActor: Yup.string(),
  supportingActor: Yup.string(),
  supportingActress: Yup.string()
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

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <MovieWizardContentLayout data={data} showNext>
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
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="language" label="Language" InputLabelProps={{ shrink: true }}>
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="country" label="Country of Origin" InputLabelProps={{ shrink: true }}>
                    <option value="usa">USA</option>
                    <option value="canada">Canada</option>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="rating" label="Rating" InputLabelProps={{ shrink: true }}>
                    <option value="g">G</option>
                    <option value="pg">PG</option>
                    <option value="pg13">PG-13</option>
                    <option value="r">R</option>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6} >
                  <RHFSelect native name="format" label="Format" InputLabelProps={{ shrink: true }}>
                    <option value="sd">SD</option>
                    <option value="hd">HD</option>
                    <option value="4k">4K</option>
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
