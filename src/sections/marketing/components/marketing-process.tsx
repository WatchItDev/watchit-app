import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Stack, Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from '@src/theme/css';
import Iconify from '@src/components/iconify';
import Image from '@src/components/image';
import { useBoolean } from '@src/hooks/use-boolean.ts';
import StudioProcessModal from '@src/components/modal.tsx';
// @ts-ignore
import Marketing from '@src/assets/illustrations/marketing.svg';
import { useResponsive } from '@src/hooks/use-responsive.ts';

const MarketingProcess = () => {
  const lgUp = useResponsive('up', 'lg');
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
      description: '',
      budget: '',
      budgetUser: '',
      maxRate: '',
      campaignType: '',
    },
    validationSchema: Yup.object({
      description: Yup.string().required('Please provide a campaign description.'),
      budget: Yup.number().required('Campaign budget is required.').positive('Budget must be positive.'),
      budgetUser: Yup.number().required('Budget per user is required.').positive('Must be positive.'),
      maxRate: Yup.number().required('Max rate is required.').positive('Must be positive.'),
      campaignType: Yup.string().required('Please select a campaign type.'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      handleStoreCampaign(values);

      setTimeout(() => {
        setSubmitting(false);
        handleFinishPublish();
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
        width: '60%',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
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
                width: '100%',
                flexShrink: 0,
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
                  display: {  md: 'flex' },
                  maxWidth: 250,
                  mb: 1,
                  whiteSpace: 'pre-line',
                }}
              >
                Boost your brand to the maximum
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: { xs: 1, xl: 2 },
                }}
              >
                Start your marketing!
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  opacity: 0.8,
                  maxWidth: lgUp ? 220 : 'auto',
                  mb: { xs: 2, xl: 2 },
                }}
              >
                Launch campaigns and share your content with the world.
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
                Create your campaign now!
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
                src={Marketing}
                alt={'Earn MMC tokens'}
              />
            </Stack>
          </Stack>
        </>
      </Stack>

      <StudioProcessModal
        title="Register a Campaign"
        open={confirmPublish.value}
        onClose={handleFinishPublish}
        renderContent={
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ pb: 3, pt: 2, mt: 1, borderTop: `1px dashed rgb(145, 158, 171, 0.5)` }}
          >
            <Box sx={{ px: 3 }}>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
                A campaign is a way to promote your content as part of strategy. Complete all the information required.
              </Typography>

              <TextField
                select
                fullWidth
                label="Campaign Type"
                placeholder="Select a campaign type"
                {...formik.getFieldProps('campaignType')}
                error={formik.touched.campaignType && Boolean(formik.errors.campaignType)}
                helperText="Choose the type of campaign you want to create."
                sx={{ my: 1 }}
              >
                <MenuItem value="subscription based">Subscription Based</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Description"
                placeholder="Provide a brief description of the campaign"
                type="text"
                {...formik.getFieldProps('description')}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText="Provide a short and clear description of your campaign."
                sx={{ my: 1 }}
              />

              <TextField
                fullWidth
                label="Budget"
                placeholder="Enter the total campaign budget"
                type="number"
                {...formik.getFieldProps('budget')}
                error={formik.touched.budget && Boolean(formik.errors.budget)}
                helperText="Total amount allocated for the campaign."
                sx={{ my: 1 }}
              />

              <TextField
                fullWidth
                label="Budget per User"
                placeholder="Specify the budget per user"
                type="number"
                {...formik.getFieldProps('budgetUser')}
                error={formik.touched.budgetUser && Boolean(formik.errors.budgetUser)}
                helperText="Maximum budget allowed per user."
                sx={{ my: 1 }}
              />

              <TextField
                fullWidth
                label="Max Rate"
                placeholder="Set the maximum rate per user"
                type="number"
                {...formik.getFieldProps('maxRate')}
                error={formik.touched.maxRate && Boolean(formik.errors.maxRate)}
                helperText="Maximum rate that a user can spend within the campaign."
                sx={{ my: 1 }}
              />
            </Box>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 2, px: 3, pt: 3, borderTop: `1px dashed rgb(145, 158, 171, 0.5)` }}
            >
              <Button variant="outlined" onClick={handleFinishPublish}>
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                loading={formik.isSubmitting}
                type="submit"
                startIcon={<Iconify icon="material-symbols:campaign-outline-rounded" />}
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Confirm
              </LoadingButton>
            </Stack>
          </Box>
        }
      />
    </Stack>
  );
};

export default MarketingProcess;
