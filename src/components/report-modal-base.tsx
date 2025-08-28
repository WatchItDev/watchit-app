// REACT IMPORTS
import { useState } from 'react';

// MUI IMPORTS
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

interface ReportModalBaseProps {
  title: string;
  reasons: string[];
  onSubmit: (
    reason: string,
    comments: string,
  ) => Promise<{ isSuccess: () => boolean; error?: { message: string } }>;
  isOpen: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const ReportModalBase = ({
  title,
  reasons,
  onSubmit,
  isOpen,
  onClose,
}: ReportModalBaseProps) => {
  const [additionalComments, setAdditionalComments] = useState('');
  const [reportReason, setReportReason] = useState<string | ''>('');
  const [loading, setLoading] = useState(false);

  const handleReportSubmit = async () => {
    if (!reportReason) {
      alert('Please select a reason for reporting.');
      return;
    }
    setLoading(true);
    const result = await onSubmit(reportReason, additionalComments);
    setLoading(false);

    if (result.isSuccess()) {
      onClose();
      setReportReason('');
      setAdditionalComments('');
    } else {
      alert(`Error reporting ${title.toLowerCase()}: ${result.error?.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <FormControl variant="outlined" fullWidth margin="dense">
          <InputLabel id="report-reason-label">Report Reason</InputLabel>
          <Select
            labelId="report-reason-label"
            id="report-reason-select"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value as string)}
            label="Report Reason"
          >
            {reasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason
                  .replace(/_/g, ' ')
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Additional Comments"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={additionalComments}
          onChange={(e) => setAdditionalComments(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          sx={{ borderColor: '#fff' }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#fff' }}
          onClick={handleReportSubmit}
          disabled={loading || !reportReason}
        >
          {loading ? (
            <CircularProgress size="25px" sx={{ color: '#fff' }} />
          ) : (
            'Submit Report'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
