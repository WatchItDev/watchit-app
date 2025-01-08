// React and libraries imports
import { FC, useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';

// @mui components
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

// Project components
import NeonPaper from '@src/sections/publication/NeonPaperContainer';
import FinanceDialogsActions from '@src/sections/finance/components/finance-dialogs-actions';
import TextMaxLine from '@src/components/text-max-line';
import { InputAmount } from '@src/components/input-amount';
import { formatBalanceNumber } from '@src/utils/format-number';
import { useResponsive } from '@src/hooks/use-responsive';
import { useGetMmcContractBalance } from '@src/hooks/use-get-mmc-contract-balance';
import BoxRow from '@src/sections/finance/components/box-row.tsx';
import { UseDepositHook } from '@src/hooks/use-deposit';
import { truncateAddress } from '@src/utils/wallet';

// Notifications
import { notifyError, notifySuccess, notifyWarning } from '@notifications/internal-notifications';
import { WARNING } from '@notifications/warnings';
import { SUCCESS } from '@notifications/success';
import { ERRORS } from '@notifications/errors.ts';

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
  const [amount, setAmount] = useState<number>(0);
  const [localLoading, setLocalLoading] = useState(false);

  const { deposit, loading: depositLoading, error } = depositHook;

  // Retrieve the balance using the "address" (the connected one)
  const { balance } = useGetMmcContractBalance(address);

  useEffect(() => {
    if (error) {
      notifyError(error as ERRORS);
    }
  }, [error]);

  // Validation and deposit
  const handleConfirmDeposit = useCallback(async () => {
    if (!address) {
      // If there's no connected address, we can't deposit
      notifyWarning(WARNING.NO_WALLET_CONNECTED);
      return;
    }
    // Validate amount > 0 and <= balance
    if (amount <= 0 || amount > (balance ?? 0)) {
      notifyWarning(WARNING.INVALID_DEPOSIT_AMOUNT);
      return;
    }
    try {
      setLocalLoading(true);
      await deposit({ recipient: recipient ?? address, amount });
      notifySuccess(SUCCESS.DEPOSIT_SUCCESSFULLY);
      onClose();
    } catch (err) {
      notifyWarning(WARNING.NO_WALLET_AUTHORIZATION);
    } finally {
      setLocalLoading(false);
    }
  }, [address, recipient, amount, balance, deposit, onClose]);

  // NeonPaper effect if currently loading
  const isBusy = localLoading || depositLoading;
  const RainbowEffect = isBusy ? NeonPaper : Box;
  const mdUp = useResponsive('up', 'md');

  // If there's no address, we could show a fallback,
  // but here we'll show the same UI (balance: 0, etc.)
  // or a warning when confirming. It's up to you.

  return (
    <>
      <Stack
        sx={{ mt: 2, p: 2, gap: 1 }}
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
            {address ? truncateAddress(address) : 'No wallet connected'}
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
          <TextMaxLine line={1}>Amount to deposit</TextMaxLine>
          <InputAmount
            autoFocus
            max={balance ?? 0}
            amount={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </BoxRow>
      </Stack>

      <FinanceDialogsActions
        rainbowComponent={RainbowEffect}
        loading={isBusy}
        actionLoading={depositLoading}
        amount={amount}
        balance={balance ?? 0}
        label={'Confirm'}
        onConfirmAction={handleConfirmDeposit}
        onCloseAction={onClose}
      />
    </>
  );
};

export default FinanceDeposit;
