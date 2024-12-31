import Stack from "@mui/material/Stack";
import TextMaxLine from "@src/components/text-max-line";
import { formatBalanceNumber } from "@src/utils/format-number.ts";
import Divider from "@mui/material/Divider";
import { InputAmount } from "@src/components/input-amount.tsx";
import { BoxRow } from "@src/sections/finance/components/finance-deposit-from-metamask.tsx";
import { useSelector } from "react-redux";
import { useGetMmcContractBalance } from "@src/hooks/use-get-mmc-contract-balance.ts";
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import { FC, useEffect, useState } from 'react';
import { useDeposit } from "@src/hooks/use-deposit.ts";
import { truncateAddress } from '@src/utils/wallet.ts';
import {useResponsive} from "@src/hooks/use-responsive.ts";
import FinanceDialogsActions from "@src/sections/finance/components/finance-dialogs-actions.tsx";

interface FinanceDepositFromSmartAccountProps {
  onClose: () => void;
}

const FinanceDepositFromSmartAccount: FC<FinanceDepositFromSmartAccountProps> = ({ onClose }) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const sessionData = useSelector((state: any) => state.auth.session);
  const { balance } = useGetMmcContractBalance(sessionData?.address);
  const { enqueueSnackbar } = useSnackbar();
  const { deposit, loading: depositLoading, error } = useDeposit();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(`Deposit failed: ${error?.message}`, { variant: "error" });
    }
  }, [enqueueSnackbar, error]);

  const handleConfirmDeposit = async () => {
    if (amount > 0 && amount <= (balance ?? 0)) {
      try {
        setLoading(true);
        await deposit({ recipient: sessionData?.address, amount });
        enqueueSnackbar(`The deposit was successful`, { variant: "success" });
        onClose();
      } catch (err: any) {
        enqueueSnackbar(`Deposit failed: ${err?.message}`, { variant: "error" });
      } finally {
        setLoading(false);
      }
    } else {
      enqueueSnackbar("Invalid deposit amount", { variant: "warning" });
    }
  };

  const RainbowEffect = loading || depositLoading ? NeonPaper : Box;

  const mdUp = useResponsive('up', 'md');

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

        <Divider  sx={{width: '100%'}}/>

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
