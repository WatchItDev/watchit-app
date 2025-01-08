import { FC  } from 'react';

// MUI IMPORTS
import DialogTitle from '@mui/material/DialogTitle';
import Dialog, { DialogProps } from '@mui/material/Dialog';

interface StudioPublishModalProps extends DialogProps {
  onClose: VoidFunction;
  title: string;
  renderContent?: JSX.Element;
}

const StudioPublishModal: FC<StudioPublishModalProps> = ({ open, onClose, title, renderContent, ...dialogProps }) => {
  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose} {...dialogProps}>
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
      {renderContent}
    </Dialog>
  );
};

export default StudioPublishModal;
