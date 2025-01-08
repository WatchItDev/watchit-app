import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Stack, Box, Typography, TextField, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from '@src/theme/css';
import Iconify from '@src/components/iconify';
import Image from '@src/components/image';
import { useBoolean } from '@src/hooks/use-boolean.ts';
import StudioProcessModal from '@src/sections/studio/components/studio-process-modal.tsx';
// @ts-ignore
import Marketing from '@src/assets/illustrations/marketing.svg';

const MarketingProcess = () => {
  const confirmPublish = useBoolean();
  const theme = useTheme();

  const handleFinishPublish = () => {
    confirmPublish.onFalse?.();
  };

  const handleClick = () => {
    confirmPublish.onTrue?.();
  };

  const handleStoreCampaign = (values: any) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues: {
      campaignName: '',
      duration: '',
      amount: '',
      budget: '',
    },
    validationSchema: Yup.object({
      campaignName: Yup.string().required('Campaign name is required'),
      duration: Yup.number().required('Duration is required').positive('Must be positive').integer('Must be an integer'),
      amount: Yup.number().required('Amount is required').positive('Must be positive'),
      budget: Yup.number().required('Budget is required').positive('Must be positive'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);

      // Handle store campaign data
      handleStoreCampaign(values);

      setTimeout(() => {
        setSubmitting(false);
        handleFinishPublish();

        // Reset the form
        formik.resetForm();
      }, 2000);
    },
  });

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
            Create your campaign and start to promote your content.
          </Typography>
          <Typography
            variant="h3"
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: { xs: 1, xl: 2 },
            }}
          >
            Allow your content to be seen by the world
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.8,
              maxWidth: 450,
              mb: { xs: 1, xl: 2 },
            }}
          >
            Start by creating your campaign and publish your content to the community.
          </Typography>
          <Button
            sx={{ mt: 5 }}
            color={'primary'}
            variant={'soft'}
            startIcon={<Iconify icon={'material-symbols:campaign-outline-rounded'} />}
            onClick={handleClick}
          >
            Create campaign
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
            src={Marketing}
            alt={'Create a new campaign'}
          />
        </Stack>
      </Stack>
      <StudioProcessModal
        title={'Create a new campaign'}
        open={confirmPublish.value}
        onClose={handleFinishPublish}
        renderContent={
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 3 }}>
            <Typography variant="body1">
              Complete the form below to create a new campaign.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
              Please enter the details of the campaign you want to create.
            </Typography>

            <TextField
              fullWidth
              label="Campaign name"
              type="text"
              {...formik.getFieldProps('campaignName')}
              error={formik.touched.campaignName && Boolean(formik.errors.campaignName)}
              helperText={formik.touched.campaignName && formik.errors.campaignName}
              sx={{ mt: 1, mb: 2 }}
            />

            <TextField
              fullWidth
              label="Duration"
              type="text"
              {...formik.getFieldProps('duration')}
              error={formik.touched.duration && Boolean(formik.errors.duration)}
              helperText={formik.touched.duration && formik.errors.duration}
              sx={{ mt: 1, mb: 2 }}
            />

            <TextField
              fullWidth
              label="Amount"
              type="text"
              {...formik.getFieldProps('amount')}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
              sx={{ mt: 1, mb: 2 }}
            />

            <TextField
              fullWidth
              label="Overall budget"
              type="text"
              {...formik.getFieldProps('budget')}
              error={formik.touched.budget && Boolean(formik.errors.budget)}
              helperText={formik.touched.budget && formik.errors.budget}
              sx={{ mt: 1, mb: 2 }}
            />

            <LoadingButton
              variant="contained"
              color="primary"
              loading={formik.isSubmitting}
              type="submit"
              startIcon={<Iconify icon={'material-symbols:campaign-outline-rounded'} />}
            >
              Save
            </LoadingButton>
          </Box>
        }
      />
    </Stack>
  );
};

export default MarketingProcess;
