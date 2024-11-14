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

// LENS IMPORTS
import { useReportPublication, PublicationReportReason } from '@lens-protocol/react-web';

// ----------------------------------------------------------------------

type PublicationReportModalProps = {
  post: any
  isOpen: boolean
  onClose: () => void
};

// ----------------------------------------------------------------------

export const PublicationReportModal = ({ post, isOpen, onClose }: PublicationReportModalProps) => {
  // STATES HOOKS
  const [additionalComments, setAdditionalComments] = useState('');
  const [reportReason, setReportReason] = useState<PublicationReportReason | ''>('');
  // LENS HOOKS
  const { execute: report, loading: loadingReport } = useReportPublication();

  const handleReportSubmit = async () => {
    if (!reportReason) {
      alert('Please select a reason for reporting.');
      return;
    }

    const result = await report({
      publicationId: post.id,
      reason: reportReason,
      additionalComments,
    } as any);

    if (result.isSuccess()) {
      alert('Publication reported successfully!');
      onClose?.()
      setReportReason('');
      setAdditionalComments('');
    } else {
      alert(`Error reporting publication: ${result.error.message}`);
    }
  };

  if (post.isHidden) return <p>Publication is hidden</p>;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Report Publication</DialogTitle>
      <DialogContent>
        <FormControl variant="outlined" fullWidth margin="dense">
          <InputLabel id="report-reason-label">Report Reason</InputLabel>
          <Select
            labelId="report-reason-label"
            id="report-reason-select"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value as PublicationReportReason)}
            label="Report Reason"
          >
            {Object.values(PublicationReportReason).map((reason: any) => (
              <MenuItem key={reason} value={reason}>
                {reason.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
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
          disabled={loadingReport || !reportReason}
        >
          {loadingReport ? (
            <CircularProgress size="25px" sx={{ color: '#fff' }} />
          ) : 'Submit Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
