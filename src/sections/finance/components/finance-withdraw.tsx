// REACT IMPORTS
import { FC, useCallback, useEffect, useState } from 'react';

// VIEM IMPORTS
import { Address } from 'viem';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// LOCAL IMPORTS
import NeonPaper from '@src/sections/publication/NeonPaperContainer';
import FinanceDialogsActions from '@src/sections/finance/components/finance-dialogs-actions';
import TextMaxLine from '@src/components/text-max-line';
import { formatBalanceNumber } from '@src/utils/format-number';
import FinanceBoxRow from '@src/sections/finance/components/finance-box-row.tsx';
import { UseWithdrawHook } from '@src/hooks/use-withdraw.ts';
import { truncateAddress } from '@src/utils/wallet.ts';

// NOTIFICATIONS IMPORTS
import { notifyError, notifySuccess, notifyWarning } from '@notifications/internal-notifications';
import { ERRORS } from '@notifications/errors';
import { WARNING } from '@notifications/warnings';
import { SUCCESS } from '@notifications/success';
import { useGetBalance } from '@src/hooks/use-get-balance.ts';

// ----------------------------------------------------------------------

interface FinanceWithdrawProps {
  address: Address; // The connected wallet address
  withdrawHook: UseWithdrawHook; // Generic withdraw hook
  onClose: () => void; // Callback to close the modal/dialog
  onChangeWallet?: (address: Address) => void; // Callback to change the new address.
}

// ----------------------------------------------------------------------

const FinanceWithdraw: FC<FinanceWithdrawProps> = ({ address, withdrawHook, onClose }) => {
  const [amount, setAmount] = useState<number | string>('');
  const [amountError, setAmountError] = useState(false);
  const [amountHelperText, setAmountHelperText] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { balance } = useGetBalance();
  const { withdraw, loading: withdrawLoading, error } = withdrawHook;
  const RainbowEffect = localLoading || withdrawLoading ? NeonPaper : Box;

  useEffect(() => {
    if (error) {
      notifyError(ERRORS.WITHDRAW_FAILED_ERROR);
    }
  }, [error]);

  const handleConfirmWithdraw = useCallback(async () => {
    if (!amount) return;

    if (Number(amount) <= 0 || amount > (balance ?? 0)) {
      notifyWarning(WARNING.INVALID_WITHDRAW_AMOUNT);
      return;
    }
    try {
      setLocalLoading(true);
      await withdraw({ amount: Number(amount), recipient: address });
      notifySuccess(SUCCESS.WITHDRAW_SUCCESSFULLY);
      onClose();
    } catch (err: any) {
      notifyError(ERRORS.WITHDRAW_FAILED_ERROR);
    } finally {
      setLocalLoading(false);
    }
  }, [amount, balance]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setAmount(value);

    // Update error state and helper text dynamically
    const errorMessage =
      value <= 0
        ? "Amount must be greater than zero"
        : value > (balance ?? 0)
          ? "Amount cannot be greater than balance"
          : "";

    setAmountError(!!errorMessage);
    setAmountHelperText(errorMessage);
  };

  return (
    <>
      <Stack
        sx={{ mt: 1, py: 2, px: 3, gap: 1 }}
        direction="column"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <FinanceBoxRow>
          <TextMaxLine line={1} fontWeight={"bold"}>Wallet</TextMaxLine>
          <TextMaxLine
            line={1}
            sx={{ fontWeight: '400', fontSize: '1em', color: 'text.secondary' }}
          >
            {address ? truncateAddress(address) : 'No wallet connected'}
          </TextMaxLine>
        </FinanceBoxRow>

        <FinanceBoxRow>
          <TextMaxLine line={1} fontWeight={"bold"}>Available</TextMaxLine>
          <TextMaxLine
            line={1}
            sx={{ fontWeight: '400', fontSize: '1em', color: 'text.secondary' }}
          >
            {formatBalanceNumber(balance ?? 0)} MMC
          </TextMaxLine>
        </FinanceBoxRow>

        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Amount to withdraw"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter an amount"
          error={amountError}
          helperText={amountHelperText}
        />
      </Stack>

      <FinanceDialogsActions
        rainbowComponent={RainbowEffect}
        loading={localLoading}
        actionLoading={withdrawLoading}
        amount={Number(amount) ?? 0}
        balance={balance ?? 0}
        label={'Confirm'}
        onConfirmAction={handleConfirmWithdraw}
        onCloseAction={onClose}
      />
    </>
  );
};

export default FinanceWithdraw;
