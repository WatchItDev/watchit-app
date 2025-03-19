import { FC, useState, useMemo, useEffect } from 'react';
import { fetchAssetSettings, upsertAssetSettings } from '@src/utils/supabase-actions';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import TextField from "@mui/material/TextField"
import LoadingButton from "@mui/lab/LoadingButton";
import NeonPaper from "@src/sections/publication/components/neon-paper-container.tsx";
import {Button, FormControl, DialogActions, LinearProgress, MenuItem} from '@mui/material'
import {OwnershipSettingsModalContentProps} from "@src/sections/ownership/types.ts"
import {LBL_REGIONS_TEXTS, LBL_TYPES_TEXTS} from "@src/sections/ownership/CONSTANTS.tsx"
import {randomKey} from "@src/utils/uuidv4.ts"
// ----------------------------------------------------------------------
const OwnershipSettingsModalContent: FC<OwnershipSettingsModalContentProps> = (props) => {
  const { onClose, onConfirm, assetData, } = props;
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ type: '', region: [] });
  const { name, id } = assetData;

  const RainbowEffect = loading ? NeonPaper : Box;

  useEffect(() => {
    const loadAssetSettings = async () => {
      setLoading(true);
      const { data, error } = await fetchAssetSettings(String(id));
      if (data) {
        const parsedRegions = JSON.parse(data.region);
        const uniqueRegions = [...new Set(parsedRegions)];
        // @ts-expect-error NO error handling
        setFormValues({ type: data.type, region: uniqueRegions });
      } else if (error) {
        console.error('Error fetching asset settings:', error);
      }
      setLoading(false);
    };

    loadAssetSettings();
  }, [id]);

  // Validate that each field has a value greater or equal to 1
  const isFormValid = useMemo(() => {
    // Verify that each field has a value greater or equal to 1
    return formValues.type !== '' && formValues.region.length > 0;
  }, [formValues]);

  const handleOnConfirm = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const { error } = await upsertAssetSettings({
        asset_id: String(id),
        name,
        type: formValues.type,
        region: JSON.stringify(formValues.region)
      });
      if (error) {
        throw new Error(error);
      }
      onConfirm?.();
    } catch (err) {
      console.error('Error configuring asset settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const flattenArray = (arr) => {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    const flattenedValue = Array.isArray(value) ? flattenArray(value) : [value];
    const uniqueValues = [...new Set(flattenedValue)];
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'region' ? uniqueValues : value,
    }));
  };

 return (
    <>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Divider sx={{ padding: '0.3rem 0', mb: 1, borderStyle: 'dashed' }} />

      <Typography variant="body2" color="text.secondary" sx={{ px: 3, mb:2, mt:2 }}>
        Define several settings for the publication like access type and region availability.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2, px: 2, m: 0, width: '100%' }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            select
            id="type"
            name="type"
            value={formValues.type}
            label="Policy type"
            onChange={handleSelectChange}
          >
            {LBL_TYPES_TEXTS.map((option) => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left', width: '100%' }}>
          Choose the region where content is available
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="region-label">Region</InputLabel>
          <Select
            labelId="region-label"
            id="region"
            name="region"
            multiple
            value={formValues.region}
            onChange={handleSelectChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {LBL_REGIONS_TEXTS.map((option) => (
              <MenuItem  key={`${randomKey(option.id,'mi')}`} value={option.name}>
                <Checkbox  key={`${randomKey(option.id,'ck')}`} checked={formValues.region.indexOf(option.name) > -1} />
                <ListItemText key={`${randomKey(option.id,'li')}`} primary={option.name} />
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
