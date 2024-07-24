import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export default function MaxWidthDialog() {
  const dialog = useBoolean();

  const [fullWidth, setFullWidth] = useState(true);

  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm');

  const handleMaxWidthChange = useCallback((event: SelectChangeEvent<typeof maxWidth>) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  }, []);

  const handleFullWidthChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFullWidth(event.target.checked);
  }, []);

  return (
    <>
      <Button variant="outlined" onClick={dialog.onTrue}>
        Max Width Dialog
      </Button>

      <Dialog
        open={dialog.value}
        maxWidth={maxWidth}
        onClose={dialog.onFalse}
        fullWidth={fullWidth}
      >
        <DialogTitle>Optional sizes</DialogTitle>

        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            You can set my maximum width and whether to adapt or not.
          </Typography>

          <Box
            component="form"
            noValidate
            sx={{
              margin: 'auto',
              display: 'flex',
              width: 'fit-content',
              flexDirection: 'column',
            }}
          >
            <FormControl sx={{ my: 3, minWidth: 160 }}>
              <InputLabel htmlFor="max-width">maxWidth</InputLabel>
              <Select
                autoFocus
                value={maxWidth}
                onChange={handleMaxWidthChange}
                label="maxWidth"
                inputProps={{
                  name: 'max-width',
                  id: 'max-width',
                }}
              >
                <MenuItem value={false as any}>false</MenuItem>
                <MenuItem value="xs">xs</MenuItem>
                <MenuItem value="sm">sm</MenuItem>
                <MenuItem value="md">md</MenuItem>
                <MenuItem value="lg">lg</MenuItem>
                <MenuItem value="xl">xl</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Switch checked={fullWidth} onChange={handleFullWidthChange} />}
              label="Full width"
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={dialog.onFalse} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
