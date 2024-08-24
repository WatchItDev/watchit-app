import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function PostCommentForm() {
  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    comment: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <RHFTextField
          name="comment"
          placeholder="Write some of your comments..."
          multiline
          rows={4}
        />

        <Stack direction="row" alignItems="center">
          <Stack direction="row" alignItems="center" flexGrow={1}>
            <IconButton>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>

            <IconButton>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>

            <IconButton>
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
          </Stack>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Post comment
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
