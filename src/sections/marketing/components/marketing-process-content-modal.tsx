import { FormikProps, FormikValues } from 'formik';
// MUI Imports
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, Box, Typography, TextField, Button, MenuItem } from '@mui/material';

import Iconify from "@src/components/iconify";
import {FC} from "react";

interface MarketingProcessContentModalProps {
  formik: FormikProps<FormikValues>;
  handleFinishPublish: () => void;
}

/**
 * MarketingProcessContentModal is a React functional component used for managing and submitting a marketing campaign configuration form.
 * It allows users to input key information such as campaign type, description, budget, budget per user, and maximum rate.
 *
 * @param {MarketingProcessContentModalProps} props - The properties passed to the component.
 * @param {object} props.formik - The `formik` object containing form state and handlers for form submissions and validations.
 * @param {function} props.handleFinishPublish - Callback function triggered when the user cancels the form submission process.
 *
 * @returns {React.ReactNode} A form component with fields and actions to configure a marketing campaign.
 */
const MarketingProcessContentModal: FC<MarketingProcessContentModalProps> = ({ formik, handleFinishPublish }: MarketingProcessContentModalProps): React.ReactNode => {
  return (
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
  )
}

export default MarketingProcessContentModal;
