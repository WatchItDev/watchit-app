import DialogActions from "@mui/material/DialogActions";
import LoadingButton from "@mui/lab/LoadingButton";
import FinanceChangeWallet from "@src/sections/finance/components/finance-change-wallet.tsx";
import {Address} from "viem";

type FinanceDialogsActionsProps = {
  rainbowComponent: any;
  loading: boolean;
  actionLoading: boolean;
  amount: number;
  balance: number;
  label: string;
  onConfirmAction: () => void;
  onCloseAction?: () => void;
  onChangeWallet?: (address: Address) => void;
}

const FinanceDialogsActions = ({rainbowComponent: RainbowEffect, onConfirmAction, loading, actionLoading, amount, balance, label, onChangeWallet }: FinanceDialogsActionsProps) => {
  return (
    <DialogActions sx={{ width: '100%', pt: 1 }}>
      {
        onChangeWallet && (
          <FinanceChangeWallet onChangingWallet={onChangeWallet} />
        )
      }
      <RainbowEffect
        {...((loading) && {
          borderRadius: '10px',
          animationSpeed: '3s',
          padding: '0',
          width: 'auto'
        })}
      >
        <LoadingButton
          variant="contained"
          sx={{ backgroundColor: "#fff" }}
          onClick={onConfirmAction}
          disabled={loading || actionLoading || amount <= 0 || amount > (balance ?? 0)}
          loading={loading || actionLoading}
        >{label}
        </LoadingButton>
      </RainbowEffect>
    </DialogActions>
  )
}
export default FinanceDialogsActions;
