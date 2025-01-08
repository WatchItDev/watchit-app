import { FC, useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

// Project components
import NeonPaper from '@src/sections/publication/NeonPaperContainer';
import FinanceDialogsActions from '@src/sections/finance/components/finance-dialogs-actions';
import TextMaxLine from '@src/components/text-max-line';
import { InputAmount } from '@src/components/input-amount';
import { formatBalanceNumber } from '@src/utils/format-number';
import { useResponsive } from '@src/hooks/use-responsive';
import BoxRow from '@src/sections/finance/components/box-row';
import { isValidAddress } from '@src/sections/finance/components/finance-quick-transfer';
import { UseWithdrawHook } from '@src/hooks/use-withdraw.ts';

// Notifications
import { notifyError, notifySuccess, notifyWarning } from '@notifications/internal-notifications';
import { ERRORS } from '@notifications/errors';
import { WARNING } from '@notifications/warnings';
import { SUCCESS } from '@notifications/success';

interface FinanceWithdrawProps {
  address?: Address; // The connected wallet address
  withdrawHook: UseWithdrawHook; // Generic withdraw hook
  balance: number | null; // Current user balance
  onClose: () => void; // Callback to close the modal/dialog
}

const FinanceWithdraw: FC<FinanceWithdrawProps> = ({ address, withdrawHook, balance, onClose }) => {
  const [amount, setAmount] = useState<number>(0);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [addressError, setAddressError] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const { withdraw, loading: withdrawLoading, error } = withdrawHook;

  const mdUp = useResponsive('up', 'md');
  const RainbowEffect = localLoading || withdrawLoading ? NeonPaper : Box;

  useEffect(() => {
    if (error) {
      notifyError(ERRORS.WITHDRAW_FAILED_ERROR);
    }
  }, [error]);

  const handleConfirmWithdraw = useCallback(async () => {
    if (!destinationAddress || addressError) {
      notifyWarning(WARNING.INVALID_WALLET_ADDRESS);
      return;
    }
    if (amount <= 0 || amount > (balance ?? 0)) {
      notifyWarning(WARNING.INVALID_WITHDRAW_AMOUNT);
      return;
    }
    try {
      setLocalLoading(true);
      await withdraw({ amount, recipient: destinationAddress });
      notifySuccess(SUCCESS.WITHDRAW_SUCCESSFULLY);
      onClose();
    } catch (err: any) {
      notifyError(ERRORS.WITHDRAW_FAILED_ERROR);
    } finally {
      setLocalLoading(false);
    }
  }, [amount, destinationAddress, balance, withdraw, addressError, onClose]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDestinationAddress(value);
    setAddressError(!isValidAddress(value));
  };

  return (
    <>
      <Stack
        sx={{ p: 2, gap: 1 }}
        direction="column"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <BoxRow>
          <TextMaxLine line={1}>Connected Wallet</TextMaxLine>
          <TextMaxLine
            line={1}
            sx={{ fontWeight: 'bold', fontSize: '1em', color: 'text.secondary' }}
          >
            {address ? address : 'No wallet connected'}
          </TextMaxLine>
        </BoxRow>

        <Divider sx={{ width: '100%' }} />

        <BoxRow>
          <TextMaxLine line={1}>Balance</TextMaxLine>
          <TextMaxLine
            line={1}
            sx={{ fontWeight: 'bold', fontSize: '1em', color: 'text.secondary' }}
          >
            {formatBalanceNumber(balance ?? 0)} MMC
          </TextMaxLine>
        </BoxRow>

        <Divider sx={{ width: '100%' }} />

        <BoxRow>
          <TextMaxLine line={1}>Amount to withdraw</TextMaxLine>
          <InputAmount
            autoFocus
            max={balance ?? 0}
            amount={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </BoxRow>

        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Wallet Address"
          value={destinationAddress}
          onChange={handleInputChange}
          placeholder="Enter wallet address"
          error={addressError}
          helperText={addressError ? 'Invalid wallet address' : ''}
        />
      </Stack>

      <FinanceDialogsActions
        rainbowComponent={RainbowEffect}
        loading={localLoading}
        actionLoading={withdrawLoading}
        amount={amount}
        balance={balance ?? 0}
        label={mdUp ? 'Confirm & Withdraw' : 'Withdraw'}
        onConfirmAction={handleConfirmWithdraw}
        onCloseAction={onClose}
      />
    </>
  );
};

export default FinanceWithdraw;
