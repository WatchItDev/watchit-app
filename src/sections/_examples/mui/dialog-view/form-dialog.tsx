// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export default function FormDialog() {
  const dialog = useBoolean();

  return (
    <div>
      <Button variant="outlined" color="warning" onClick={dialog.onTrue}>
        Form Dialogs
      </Button>

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <DialogTitle>Subscribe</DialogTitle>

        <DialogContent>
          <Typography sx={{ mb: 3 }}>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </Typography>

          <TextField
            autoFocus
            fullWidth
            type="email"
            margin="dense"
            variant="outlined"
            label="Email Address"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={dialog.onFalse} variant="contained">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
