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
import BoxRow from '@src/sections/finance/components/box-row';
import { isValidAddress } from '@src/sections/finance/components/finance-quick-transfer';
import { UseWithdrawHook } from '@src/hooks/use-withdraw.ts';
import { truncateAddress } from '@src/utils/wallet.ts';

// NOTIFICATIONS IMPORTS
import { notifyError, notifySuccess, notifyWarning } from '@notifications/internal-notifications';
import { ERRORS } from '@notifications/errors';
import { WARNING } from '@notifications/warnings';
import { SUCCESS } from '@notifications/success';

// ----------------------------------------------------------------------

interface FinanceWithdrawProps {
  address?: Address; // The connected wallet address
  withdrawHook: UseWithdrawHook; // Generic withdraw hook
  balance: number | null; // Current user balance
  onClose: () => void; // Callback to close the modal/dialog
  onChangeWallet?: (address: Address) => void; // Callback to change the new address.
}

// ----------------------------------------------------------------------

const FinanceWithdraw: FC<FinanceWithdrawProps> = ({ address, withdrawHook, balance, onClose }) => {
  const [amount, setAmount] = useState<number>();
  const [destinationAddress, setDestinationAddress] = useState('');
  const [addressError, setAddressError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [amountHelperText, setAmountHelperText] = useState(''); // Dynamic helper text for amount
  const [localLoading, setLocalLoading] = useState(false);
  const { withdraw, loading: withdrawLoading, error } = withdrawHook;
  const RainbowEffect = localLoading || withdrawLoading ? NeonPaper : Box;

  useEffect(() => {
    if (error) {
      notifyError(ERRORS.WITHDRAW_FAILED_ERROR);
    }
  }, [error]);

  const handleConfirmWithdraw = useCallback(async () => {
    if (!amount) return;

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDestinationAddress(value);
    setAddressError(!isValidAddress(value));
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
        <BoxRow>
          <TextMaxLine line={1} fontWeight={"bold"}>Wallet</TextMaxLine>
          <TextMaxLine
            line={1}
            sx={{ fontWeight: '400', fontSize: '1em', color: 'text.secondary' }}
          >
            {address ? truncateAddress(address) : 'No wallet connected'}
          </TextMaxLine>
        </BoxRow>

        <BoxRow>
          <TextMaxLine line={1} fontWeight={"bold"}>Balance</TextMaxLine>
          <TextMaxLine
            line={1}
            sx={{ fontWeight: '400', fontSize: '1em', color: 'text.secondary' }}
          >
            {formatBalanceNumber(balance ?? 0)} MMC
          </TextMaxLine>
        </BoxRow>

        <TextField
          sx={{ mt: 1 }}
          fullWidth
          autoFocus
          label="Amount to withdraw"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter an amount"
          error={amountError}
          helperText={amountHelperText}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
            my: 2
          }}
        >
          <Box sx={{ background: 'rgba(255,255,255,0.1)', height: '1px', width: '100%' }} />
          <Box sx={{
            position: 'absolute',
            left: 'calc(50% - 1.5rem)',
            top: '-22px',
            width: '3rem',
            padding: '8px',
            background: '#212b36',
            textAlign: 'center',
            color: 'text.secondary'
          }}>
            to
          </Box>
        </Box>

        <TextField
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
        amount={amount ?? 0}
        balance={balance ?? 0}
        label={'Confirm'}
        onConfirmAction={handleConfirmWithdraw}
        onCloseAction={onClose}
      />
    </>
  );
};

export default FinanceWithdraw;
