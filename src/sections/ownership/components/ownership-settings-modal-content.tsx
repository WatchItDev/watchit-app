import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { FC, useState, useMemo } from 'react';
import {Button, FormControl, DialogActions, LinearProgress, MenuItem, Select} from '@mui/material'
import LoadingButton from "@mui/lab/LoadingButton";
import NeonPaper from "@src/sections/publication/components/neon-paper-container.tsx";
import { notifyError } from '@notifications/internal-notifications.ts';
import { ERRORS } from '@notifications/errors.ts';

import {OwnershipSettingsModalContentProps} from "@src/sections/ownership/types.ts"
import {LBL_REGIONS_TEXTS, LBL_TYPES_TEXTS} from "@src/sections/ownership/CONSTANTS.tsx"
import {SelectChangeEvent} from "@mui/material/Select"
// ----------------------------------------------------------------------
const OwnershipSettingsModalContent: FC<OwnershipSettingsModalContentProps> = (props) => {
  const { onClose, onConfirm, assetData, } = props;
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ type: '', region: '' });
  const { name } = assetData;

  const RainbowEffect = loading ? NeonPaper : Box;
  // Convert the daily price from Wei to MMC (float)

  // Validate that each field has a value greater or equal to 1
  const isFormValid = useMemo(() => {
    // Verify that each field has a value greater or equal to 1
    return formValues.type !== '' && formValues.region !== '';
  }, [formValues]);

  const handleOnConfirm = async () => {
    // Prevent proceeding if form validation fails
    if (!isFormValid) return;

    try {

      onConfirm?.();
    } catch (err) {
      console.error('Error configuring campaign:', err);
      notifyError(ERRORS.CAMPAIGN_CONFIGURATION_ERROR);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

 return (
    <>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Typography variant="body2" color="text.secondary" sx={{ px: 3 }}>
        Define several settings for the publication like access type and region availability.
      </Typography>

      <Divider sx={{ padding: '0.3rem 0', mb: 4, borderStyle: 'dashed' }} />

      <Grid container spacing={2} sx={{ mb: 2, px: 2, m: 0, width: '100%' }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            labelId="type-select-label"
            id="type"
            name="type"
            value={formValues.type}
            label="Policy"
            onChange={handleSelectChange}
          >
            {LBL_TYPES_TEXTS.map((option) => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            labelId="region-select-label"
            id="reqion"
            name="region"
            value={formValues.region}
            label="Region"
            onChange={handleSelectChange}
          >
            {LBL_REGIONS_TEXTS.map((option) => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Divider sx={{ padding: '0.3rem 0', borderStyle: 'dashed' }} />

      <DialogActions sx={{ px: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <RainbowEffect
          {...(  loading && {
            borderRadius: '10px',
            animationSpeed: '3s',
            padding: '0',
            width: 'auto',
          })}
        >
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: '#fff' }}
            onClick={handleOnConfirm}
            loading={loading}
            disabled={!isFormValid}
          >
            Confirm
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </>
  );
};

export {OwnershipSettingsModalContent};
