import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {
  Button,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import React, { FC, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import {CampaignCategories} from "@src/types/marketing.ts";

interface CampaignModalContentProps {
  onClose: () => void;
  onConfirm: () => void;
}

const CampaignModalContent: FC<CampaignModalContentProps> = ({ onClose, onConfirm }) => {
  const [formValues, setFormValues] = useState<{
    description: string;
    budget: string;
    type: string;
    budgetUser: string;
  }>({
    description: '',
    budget: '',
    type: 'subscription',
    budgetUser: '',
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<unknown>
  ) => {
    const { name, value } = event.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | { name: string; value: unknown };
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <>
      <Divider
        sx={{
          padding: '0.3rem 0',
          mb: 4,
          borderStyle: 'dashed',
        }}
      />

      <Grid container spacing={2} sx={{ mb: 2, px: 5 }}>
        <Typography sx={{ opacity: 0.7 }} variant="body1" color="text.secondary">
          A campaign is a way to promote your content as part of strategy. Complete all the
          information required.
        </Typography>
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="campaingType">Campaign type</InputLabel>
          <Select
            labelId="campaingType"
            id="campaignType"
            value={formValues.type}
            label="Campaign type"
            name="type"
            onChange={handleInputChange}
          >
            {
              CampaignCategories.map((category) => (
                <MenuItem key={`${category.label}`} value={category.value}>{category.label}</MenuItem>
              ))
            }
          </Select>
        </FormControl>

        {/*Input for description*/}
        <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
        <TextField
          fullWidth
          autoFocus
          label="Enter a description"
          type="text"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          placeholder="e.g., 'Promote my new album'"
          helperText={'This description will help you identify the campaign.'}
        />
        </FormControl>

        {/*Input for budget*/}
        <FormControl fullWidth sx={{ mb: 3 }}>
        <TextField
          fullWidth
          autoFocus
          label="Enter a budget for campaign"
          type="number"
          name="budget"
          value={formValues.budget}
          onChange={handleInputChange}
          placeholder="e.g., 5000"
          helperText={'This budget will be distributed among the campaign.'}
        />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
        <TextField
          fullWidth
          autoFocus
          label="Enter a budget per user"
          type="number"
          name="budgetUser"
          value={formValues.budget}
          onChange={handleInputChange}
          placeholder="e.g., 250"
          helperText={'This budget will be distributed among the campaign.'}
        />
        </FormControl>
      </Grid>

      <Divider
        sx={{
          padding: '0.3rem 0',
          borderStyle: 'dashed',
        }}
      />

      <DialogActions>
        <Button variant={'outlined'} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={'contained'}
          onClick={onConfirm}
          sx={{ backgroundColor: 'white', color: 'black' }}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

export default CampaignModalContent;
