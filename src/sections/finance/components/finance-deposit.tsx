// TODO Please keep ordered the dependencies
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { FC, useEffect, useState, useCallback } from 'react';

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextMaxLine from "@src/components/text-max-line";
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";
import FinanceDialogsActions from "@src/sections/finance/components/finance-dialogs-actions.tsx";

import { formatBalanceNumber } from "@src/utils/format-number.ts";
import { InputAmount } from "@src/components/input-amount.tsx";
import { BoxRow } from "@src/sections/finance/components/finance-deposit-from-metamask.tsx";
import { useGetMmcContractBalance } from "@src/hooks/use-get-mmc-contract-balance.ts";
import { useResponsive } from "@src/hooks/use-responsive.ts";
import {  UseDepositHook } from "@src/hooks/use-deposit.ts";
import { truncateAddress } from '@src/utils/wallet.ts';

interface FinanceDepositFromSmartAccountProps {
  useDeposit:() => UseDepositHook;
  onClose: () => void;
}

const FinanceDepositFromSmartAccount: FC<FinanceDepositFromSmartAccountProps> = ({ onClose, useDeposit }) => {
  // TODO Use this component as generic finance deposit and create new sub components for metamask & smart account
  // TODO Please keep declaration on top
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const sessionData = useSelector((state: any) => state.auth.session);
  const { deposit, loading: depositLoading, error } = useDeposit();
  const { balance } = useGetMmcContractBalance(sessionData?.address);

  // TODO we can have a list of errors centralized in a library to throw, in favor of reutilization
  const errorDueInvalidAmount = () => enqueueSnackbar("Invalid deposit amount.", { variant: "warning" });
  const errorDuringDeposit = () => enqueueSnackbar(`Oops! Something went wrong with your deposit. Please try again.`, { variant: "error" });

  const RainbowEffect = loading || depositLoading ? NeonPaper : Box;
  const mdUp = useResponsive('up', 'md');
  // TODO any extra connection like:
  // useEffect(() => {
  //   handleConnectMetamask();
  // }, []);
  // could be handled in the specific component

  useEffect(() => {
    if (error) errorDuringDeposit()
  }, [error]);
  
  const handleConfirmDeposit = useCallback(async () => {
    // fail fast
    // TODO validation formatUint(amount) > balance
    if (amount == 0 || amount >= (balance ?? 0))
      return errorDueInvalidAmount();

    try {
      setLoading(true);
      // TODO deposit can return a OK?
      await deposit({ recipient: sessionData?.address, amount });
      enqueueSnackbar(`The deposit was successful`, { variant: "success" });
      onClose();
    } catch (err: any) {
      errorDuringDeposit();
    } finally {
      setLoading(false);
    }

  }, [sessionData?.address, amount, balance]);


  return (
    <>
      <Stack
        sx={{ mt: 2, p: 2, gap: 1 }}
        direction={"column"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <BoxRow>
          <TextMaxLine line={1}>Connected Wallet</TextMaxLine>
          <TextMaxLine
            line={1}
            sx={{ fontWeight: "bold", fontSize: "1em", color: "text.secondary" }}
          >
            {truncateAddress(sessionData?.address)}
          </TextMaxLine>
        </BoxRow>

        <Divider sx={{ width: '100%' }} />

        <BoxRow>
          <TextMaxLine line={1}>Balance</TextMaxLine>
          <TextMaxLine
            line={1}
            sx={{ fontWeight: "bold", fontSize: "1em", color: "text.secondary" }}
          >
            {formatBalanceNumber(balance ?? 0)} MMC
          </TextMaxLine>
        </BoxRow>

        <Divider sx={{ width: "100%" }} />

        <BoxRow>
          <TextMaxLine line={1}>Amount to deposit</TextMaxLine>
          <InputAmount
            max={balance ?? 0}
            amount={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </BoxRow>
      </Stack>

      <FinanceDialogsActions
        rainbowComponent={RainbowEffect}
        loading={loading}
        actionLoading={depositLoading}
        amount={amount}
        balance={balance ?? 0}
        label={mdUp ? 'Confirm & Deposit' : 'Deposit'}
        onConfirmAction={handleConfirmDeposit}
        onCloseAction={onClose}
      />
    </>
  );
};

export default FinanceDepositFromSmartAccount;
