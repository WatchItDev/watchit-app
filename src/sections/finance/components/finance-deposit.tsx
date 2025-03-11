// REACT IMPORTS
import { FC, useCallback, useEffect, useState } from 'react';

// VIEM IMPORTS
import { Address } from 'viem';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// LOCAL IMPORTS
import NeonPaper from '@src/sections/publication/components/neon-paper-container.tsx';
import FinanceDialogsActions from '@src/sections/finance/components/finance-dialogs-actions';
import TextMaxLine from '@src/components/text-max-line';
import { formatBalanceNumber } from '@src/utils/format-number';
import { useGetMmcContractBalance } from '@src/hooks/protocol/use-get-mmc-contract-balance.ts';
import FinanceBoxRow from '@src/sections/finance/components/finance-box-row.tsx';
import { UseDepositHook } from '@src/hooks/protocol/use-deposit.ts';
import { truncateAddress } from '@src/utils/wallet';

// NOTIFICATIONS IMPORTS
import { notifyError, notifySuccess, notifyWarning } from '@notifications/internal-notifications';
import { WARNING } from '@notifications/warnings';
import { SUCCESS } from '@notifications/success';
import { ERRORS } from '@notifications/errors.ts';
import TextField from '@mui/material/TextField';

interface FinanceDepositProps {
  /**
   * The currently connected address (Metamask or SmartWallet).
   * If undefined, we assume no wallet is connected.
   */
  address?: Address;

  /**
   * The address that receives the deposit (e.g. the user's session address).
   */
  recipient?: string;

  /**
   * The deposit hook you already have.
   * Could be useDeposit() or useDepositMetamask(), etc.
   */
  depositHook: UseDepositHook;

  /**
   * Callback for closing the modal / dialog.
   */
  onClose: () => void;

  /**
   * Callback to change the new address.
   */
  onChangeWallet?: (address: Address) => void;
}

/**
 * Generic component that holds the UI for depositing funds.
 * It requires:
 * - `address` (the connected wallet)
 * - `recipient` (the address to receive funds)
 * - `depositHook` (generic or Metamask deposit hook)
 * - `onClose`
 */
const FinanceDeposit: FC<FinanceDepositProps> = ({ address, recipient, depositHook, onClose }) => {
  const [amount, setAmount] = useState<number | string>('');
  const [helperText, setHelperText] = useState<string>("");
  const { balance } = useGetMmcContractBalance(address);
  const { deposit, loading: depositLoading, error } = depositHook;
  const [localLoading, setLocalLoading] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const isBusy = localLoading || depositLoading;
  const RainbowEffect = isBusy ? NeonPaper : Box;

  useEffect(() => {
    if (error) {
      notifyError(error as ERRORS);
    }
  }, [error]);

  // Validation and deposit
  const handleConfirmDeposit = useCallback(async () => {
    if (!amount) return;

    if (!address) {
      // If there's no connected address, we can't deposit
      notifyWarning(WARNING.NO_WALLET_CONNECTED);
      return;
    }
    // Validate amount > 0 and <= balance
    if (Number(amount) <= 0 || Number(amount) > (balance ?? 0)) {
      notifyWarning(WARNING.INVALID_DEPOSIT_AMOUNT);
      return;
    }

    // TODO refactor this!!!!!
    try {
      setLocalLoading(true);
      await deposit({ recipient: recipient ?? address, amount: Number(amount) });
      notifySuccess(SUCCESS.DEPOSIT_SUCCESSFULLY);
      onClose();
    } catch (err) {
      notifyError(ERRORS.DEPOSIT_ERROR);
    } finally {
      setLocalLoading(false);
    }
  }, [address, recipient, amount, balance]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setAmount(value ?? undefined);

    // Set appropriate error message
    const errorMessage =
      value <= 0
        ? "No amount entered"
        : value > (balance ?? 0)
          ? "Amount cannot be greater than balance"
          : "";

    setAmountError(!!errorMessage); // Set error state
    setHelperText(errorMessage); // Update helper text with the error message
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
          <TextMaxLine line={1} fontWeight={"bold"}>Connected Wallet</TextMaxLine>
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
          label="Amount to deposit"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter an amount"
          error={amountError}
          helperText={helperText}
        />
      </Stack>

      <FinanceDialogsActions
        rainbowComponent={RainbowEffect}
        loading={isBusy}
        actionLoading={depositLoading}
        amount={Number(amount) ?? 0}
        balance={balance ?? 0}
        label={'Confirm'}
        onConfirmAction={handleConfirmDeposit}
        onCloseAction={onClose}
      />
    </>
  );
};

export default FinanceDeposit;
