// CampaignModalContent.tsx
import React, { FC, useState } from 'react';
import {
  Button,
  TextField,
  DialogActions,
  Grid,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCreateCampaign } from '@src/hooks/use-create-campaign';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { SelectChangeEvent } from '@mui/material/Select';
import LoadingButton from "@mui/lab/LoadingButton";
import NeonPaper from '@src/sections/publication/NeonPaperContainer';

interface CampaignModalContentProps {
  onClose: () => void;
  onConfirm: () => void;
}

// Policy options array for easy extension in the future
const policyOptions = [
  { label: 'Subscription', value: GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS },
];

const CampaignModalContent: FC<CampaignModalContentProps> = ({ onClose, onConfirm }) => {
  const { create, loading, error } = useCreateCampaign();

  // State to hold form values for policy and description
  const [formValues, setFormValues] = useState({
    policy: '',
    description: '',
  });

  // State for the selected expiration date (Date object)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Handler for text field changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for select changes
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  // Validate fields, calculate expiration in seconds, and call the create function from the hook
  const handleOnConfirm = async () => {
    const { policy, description } = formValues;
    if (!policy || !description || !selectedDate) {
      // You could add further validation or show an error message here
      return;
    }

    // Calculate expiration in seconds from now until the selected date
    const now = new Date();
    const expirationSeconds = Math.floor((selectedDate.getTime() - now.getTime()) / 1000);
    if (expirationSeconds <= 0) {
      // If expirationSeconds is not positive, do not proceed
      return;
    }

    console.log('hello create campaign');
    console.log(policy);
    console.log(expirationSeconds);
    console.log(description);

    await create({
      policy,
      expiration: expirationSeconds,
      description,
    });

    // Close the modal if the creation was successful
    onConfirm();
  };
  const RainbowEffect = loading ? NeonPaper : Box;

  return (
    <>
      <Divider sx={{ padding: '0.3rem 0', mb: 2, borderStyle: 'dashed' }} />

      <Grid container spacing={2} sx={{ mb: 2, px: 2, m: 0, width: '100%' }}>
        <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.7 }}>
          Complete the required information to create the campaign.
        </Typography>

        {/* Policy select with helper text */}
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="policy-select-label">Policy</InputLabel>
          <Select
            labelId="policy-select-label"
            id="policy"
            name="policy"
            value={formValues.policy}
            label="Policy"
            onChange={handleSelectChange}
          >
            {policyOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Select a policy for your campaign.
          </FormHelperText>
        </FormControl>

        {/* DatePicker for expiration with helper text via slotProps */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Expiration Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            minDate={new Date()}
            slotProps={{
              textField: {
                helperText: "Please select the duration of your campaign.",
                fullWidth: true,
                sx: { mt: 2 },
              },
            }}
          />
        </LocalizationProvider>

        {/* Text field for description with helper text */}
        <TextField
          fullWidth
          label="Description"
          type="text"
          name="description"
          value={formValues.description}
          onChange={handleTextChange}
          sx={{ mt: 2 }}
          placeholder="e.g., New product promotion"
          helperText="This description will help you identify the campaign."
        />
      </Grid>

      {error && (
        <Typography color="error" variant="body2" sx={{ px: 5 }}>
          {error}
        </Typography>
      )}

      <Divider sx={{ padding: '0.3rem 0', mt: 2, borderStyle: 'dashed' }} />

      <DialogActions sx={{ px: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <RainbowEffect
          {...(loading && {
            borderRadius: '10px',
            animationSpeed: '3s',
            padding: '0',
            width: 'auto',
          })}
        >
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: 'white', color: 'black' }}
            onClick={handleOnConfirm}
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Configuring...' : 'Confirm'}
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </>
  );
};

export default CampaignModalContent;
