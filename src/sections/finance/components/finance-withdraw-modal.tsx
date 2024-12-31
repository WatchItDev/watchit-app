// REACT IMPORTS
import { FC } from 'react';

// MUI IMPORTS

import DialogTitle from "@mui/material/DialogTitle";

import Dialog, {DialogProps} from "@mui/material/Dialog";

// LOCAL IMPORTS

import FinanceWithdrawFromSmartAccount from "@src/sections/finance/components/finance-withdraw-from-smart-account";

// ----------------------------------------------------------------------

interface FinanceWitdrawModalProps extends DialogProps {
  onClose: VoidFunction;
}

// ----------------------------------------------------------------------

export const FinanceWithdrawModal: FC<FinanceWitdrawModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Withdraw from your vault balance</DialogTitle>
      <FinanceWithdrawFromSmartAccount onClose={onClose} />
    </Dialog>
  );
}
