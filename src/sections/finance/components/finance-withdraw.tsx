// REACT IMPORTS
import React, { FC, useCallback, useEffect, useState } from "react";

// MUI IMPORTS
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

// LOCAL IMPORTS
import NeonPaper from "@src/sections/publication/components/neon-paper-container.tsx";
import FinanceDialogsActions from "@src/sections/finance/components/finance-dialogs-actions";
import TextMaxLine from "@src/components/text-max-line";
import { formatBalanceNumber } from "@src/utils/format-number";
import FinanceBoxRow from "@src/sections/finance/components/finance-box-row.tsx";
import { truncateAddress } from "@src/utils/wallet.ts";

// NOTIFICATIONS IMPORTS
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "@src/libs/notifications/internal-notifications";
import { ERRORS } from "@src/libs/notifications/errors";
import { WARNING } from "@src/libs/notifications/warnings";
import { SUCCESS } from "@src/libs/notifications/success";
import { useGetBalance } from "@src/hooks/protocol/use-get-balance.ts";
import { FinanceWithdrawProps } from "@src/sections/finance/types.ts";

// ----------------------------------------------------------------------

const FinanceWithdraw: FC<FinanceWithdrawProps> = ({ address, withdrawHook, onClose }) => {
  const [amount, setAmount] = useState<number | string>("");
  const [amountError, setAmountError] = useState(false);
  const [amountHelperText, setAmountHelperText] = useState("");
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
    } catch (err) {
      notifyError(ERRORS.WITHDRAW_FAILED_ERROR);
      console.log("Error while withdraw: ", err);
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
        data-testid="FinanceWithdraw"
        sx={{ mt: 1, py: 2, px: 3, gap: 1 }}
        direction="column"
        display="flex"
        alignItems="center"
        justifyContent="space-between">
        <FinanceBoxRow>
          <TextMaxLine line={1} fontWeight={"bold"}>
            Wallet
          </TextMaxLine>
          <TextMaxLine
            line={1}
            sx={{ fontWeight: "400", fontSize: "1em", color: "text.secondary" }}>
            {address ? truncateAddress(address) : "No wallet connected"}
          </TextMaxLine>
        </FinanceBoxRow>

        <FinanceBoxRow>
          <TextMaxLine line={1} fontWeight={"bold"}>
            Available
          </TextMaxLine>
          <TextMaxLine
            line={1}
            sx={{ fontWeight: "400", fontSize: "1em", color: "text.secondary" }}>
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
        amount={Number(amount) || 0}
        balance={balance ?? 0}
        label={"Confirm"}
        onConfirmAction={handleConfirmWithdraw}
        onCloseAction={onClose}
      />
    </>
  );
};

export default FinanceWithdraw;
