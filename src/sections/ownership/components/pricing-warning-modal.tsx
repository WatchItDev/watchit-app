import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const SubscriptionWarningModal = ({
                                           open,
                                           onClose,
                                           onConfirm
                                         }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{
        borderBottom: `dashed 1px ${theme.palette.divider}`,
        padding: '16px 24px',
        marginBottom: '16px'
      }}>Required configuration</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To register content, you must first set up subscription pricing.
        </DialogContentText>
        <DialogContentText sx={{ mt: 2 }}>
          Do you want to set them up now?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: `dashed 1px ${theme.palette.divider}`,
          padding: '16px 24px',
          marginTop: '24px'
        }}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Setting prices
        </Button>
      </DialogActions>
    </Dialog>
  )
};
