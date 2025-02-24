import LoadingButton from '@mui/lab/LoadingButton'
import DialogActions from '@mui/material/DialogActions'

type FinanceDialogsActionsProps = {
  rainbowComponent: any;
  loading: boolean;
  actionLoading: boolean;
  amount: number;
  balance: number;
  label: string;
  onConfirmAction: () => void;
  onCloseAction?: () => void
};

const FinanceDialogsActions = ({
  rainbowComponent: RainbowEffect,
  onConfirmAction,
  loading,
  actionLoading,
  amount,
  balance,
  label
}: FinanceDialogsActionsProps) => {
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
  )
}
export default FinanceDialogsActions
