// @mui components
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';
import {FinanceDialogsActionsProps} from "@src/sections/finance/types.ts"

const FinanceDialogsActions = (props: FinanceDialogsActionsProps) => {
  const {rainbowComponent: RainbowEffect, onConfirmAction, loading, actionLoading, amount, balance, label} = props;

  return (
    <DialogActions sx={{ width: '100%', pt: 1 }}>
      <RainbowEffect
        {...(loading && {
          borderRadius: '10px',
          animationSpeed: '3s',
          padding: '0',
          width: 'auto',
        })}
      >
        <LoadingButton
          variant="contained"
          sx={{ backgroundColor: '#fff' }}
          onClick={onConfirmAction}
          disabled={loading || actionLoading || amount <= 0 || amount > (balance ?? 0)}
          loading={loading || actionLoading}
        >
          {label}
        </LoadingButton>
      </RainbowEffect>
    </DialogActions>
  );
};
export default FinanceDialogsActions;
