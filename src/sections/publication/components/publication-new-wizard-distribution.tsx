import * as Yup from 'yup';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormProvider, { RHFTextField, RHFSelect } from '@src/components/hook-form';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { IconTrash } from '@tabler/icons-react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import MovieWizardContentLayout from './publication-new-wizard-layout.tsx';

const DistributionSchema = Yup.object().shape({
  creators: Yup.array()
    .of(
      Yup.object().shape({
        role: Yup.string().required('Role is required'),
        name: Yup.string().required('Name is required'),
        walletAddress: Yup.string().required('Wallet address is required'),
        revenueShare: Yup.number().min(0).max(100).required('Revenue share is required'),
      })
    )
    .required('Creators are required'),
  distribution: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.string().required('Distribution type is required'),
        currency: Yup.string().required('Distribution currency is required'),
        price: Yup.string().required('Distributtion price is required'),
      })
    )
    .min(1, 'At least one distribution price is required')
    .required('Distribution prices are required'),
  licenseType: Yup.string().required('License type is required'),
  territory: Yup.string().required('Territory is required'),
  licenseDuration: Yup.date().required('License duration is required'),
  copyrightHolder: Yup.string().required('Copyright holder name is required'),
  copyrightRegistrationNumber: Yup.string().required('Copyright registration number is required'),
  termsOfServiceURL: Yup.string()
    .url('Must be a valid URL')
    .required('Terms of service URL is required'),
});

export default function DistributionForm({ onSubmit, onBack, data }: any) {
  const methods = useForm({
    resolver: yupResolver(DistributionSchema),
    defaultValues: {
      creators: data.creators ?? [{ role: '', name: '', walletAddress: '', revenueShare: 0 }],
      distribution: data.distribution ?? [{ type: '', currency: '', price: 0 }],
      licenseType: data.licenseType ?? '',
      territory: data.territory ?? '',
      licenseDuration: data.licenseDuration ?? undefined,
      copyrightHolder: data.copyrightHolder ?? '',
      copyrightRegistrationNumber: data.copyrightRegistrationNumber ?? '',
      termsOfServiceURL: data.termsOfServiceURL ?? '',
    },
  });

  const {
    formState: { errors },
    watch,
  } = methods;

  const values = watch();

  const licenseTypeOptions = [
    { value: 'full', label: 'Full License' },
    { value: 'partial', label: 'Partial License' },
  ];

  const territoryOptions = [
    { value: 'worldwide', label: 'Worldwide' },
    { value: 'regional', label: 'Regional' },
  ];

  const distributionTypeOptions = [
    { value: 'rent', label: 'Rent' },
    { value: 'buy', label: 'Buy' },
  ];

  const currenciesOptions = [
    { value: 'eth', label: 'ETH' },
    { value: 'wvc', label: 'WVC' },
    { value: 'usd', label: 'USD' },
  ];

  const {
    fields: creatorsFields,
    append: creatorsAppend,
    remove: creatorsRemove,
  } = useFieldArray({
    control: methods.control,
    name: 'creators',
  });

  const {
    fields: distributionFields,
    append: distributionAppend,
    remove: distributionRemove,
  } = useFieldArray({
    control: methods.control,
    name: 'distribution',
  });

  const creators = useWatch({ control: methods.control, name: 'creators' });
  const totalRevenueShare = creators.reduce(
    (total: any, creator: any) => total + (creator.revenueShare || 0),
    0
  );
  const remainingPercentage = 100 - totalRevenueShare;

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <MovieWizardContentLayout
        data={{ ...data, ...values }}
        showNext
        disableNext={totalRevenueShare > 100}
        showBack
        onBack={onBack}
      >
        <Grid xs={12}>
          <Card sx={{ backgroundColor: 'transparent' }}>
            <CardHeader title="Rights & Legal Information" />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="licenseType" label="License Type">
                    {licenseTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="territory" label="Applicable Territory">
                    {territoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="licenseDuration"
                    control={methods.control}
                    render={({ field }) => (
                      <DatePicker
                        label="License Duration"
                        sx={{ width: '100%' }}
                        {...field}
                        onChange={(date) => field.onChange(date as any)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="copyrightHolder" label="Copyright Holder's Name" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="copyrightRegistrationNumber"
                    label="Copyright Registration Number"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="termsOfServiceURL" label="Terms of Service URL" />
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12}>
          <Card sx={{ backgroundColor: 'transparent' }}>
            <CardHeader
              title="Revenue Sharing"
              subheader={
                <Typography variant="body2" color="textSecondary">
                  {`Remaining percentage to distribute: ${remainingPercentage}%`}
                </Typography>
              }
              sx={{ mb: 2 }}
              action={
                <Button
                  variant="contained"
                  onClick={() =>
                    creatorsAppend({ role: '', name: '', walletAddress: '', revenueShare: 0 })
                  }
                  disabled={totalRevenueShare >= 100}
                >
                  Add Creator
                </Button>
              }
            />
            {totalRevenueShare > 100 && (
              <Typography variant="body2" color="error" sx={{ px: 3 }}>
                Total distribution cannot exceed 100%. Please adjust the revenue shares.
              </Typography>
            )}
            {errors?.creators ? (
              <Typography variant="body2" color="error" sx={{ px: 3 }}>
                <>{errors?.creators?.message ?? ''}</>
              </Typography>
            ) : undefined}
            <Stack spacing={3} sx={{ p: 3 }}>
              {creatorsFields.map((creator: any, index) => (
                <Stack key={creator.id} spacing={2}>
                  {index > 0 ? <Divider sx={{ borderStyle: 'dashed' }} /> : undefined}
                  <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 1 }}>
                    <RHFTextField name={`creators[${index}].name`} label="Name" />
                    <RHFTextField name={`creators[${index}].role`} label="Role" />
                    <RHFTextField
                      name={`creators[${index}].walletAddress`}
                      label="Wallet Address"
                    />
                    <RHFTextField
                      name={`creators[${index}].revenueShare`}
                      label="Revenue Share (%)"
                      type="number"
                    />
                    <IconButton onClick={() => creatorsRemove(index)}>
                      <IconTrash />
                    </IconButton>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12}>
          <Card sx={{ backgroundColor: 'transparent' }}>
            <CardHeader
              title="Distribution"
              subheader={
                <Typography variant="body2" color="textSecondary">
                  Please add all the distribution prices for the movie
                </Typography>
              }
              sx={{ mb: 2 }}
              action={
                <Button
                  variant="contained"
                  onClick={() => distributionAppend({ type: '', currency: '', price: 0 })}
                >
                  Add Price
                </Button>
              }
            />
            {errors?.distribution ? (
              <Typography variant="body2" color="error" sx={{ px: 3 }}>
                <>{errors?.distribution?.message ?? ''}</>
              </Typography>
            ) : undefined}
            <Stack spacing={3} sx={{ p: 3 }}>
              {distributionFields.map((distribution: any, index) => (
                <Stack key={distribution.id} spacing={2}>
                  {index > 0 ? <Divider sx={{ borderStyle: 'dashed' }} /> : undefined}
                  <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 1 }}>
                    <RHFSelect name={`distribution[${index}].type`} label="Type">
                      {distributionTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                    <RHFSelect name={`distribution[${index}].currency`} label="Currency">
                      {currenciesOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                    <RHFTextField
                      name={`distribution[${index}].price`}
                      label="Price"
                      type="number"
                    />
                    <IconButton onClick={() => distributionRemove(index)}>
                      <IconTrash />
                    </IconButton>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>
      </MovieWizardContentLayout>
    </FormProvider>
  );
}
