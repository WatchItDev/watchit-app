import Stack from "@mui/material/Stack";
import TextMaxLine from "@src/components/text-max-line";
import { formatBalanceNumber } from "@src/utils/format-number.ts";
import Divider from "@mui/material/Divider";
import { InputAmount } from "@src/components/input-amount.tsx";
import { BoxRow } from "@src/sections/finance/components/finance-deposit-from-metamask.tsx";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogActions from "@mui/material/DialogActions";
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState } from 'react';
import TextField from "@mui/material/TextField";
import {isValidAddress} from "@src/sections/finance/components/finance-quick-transfer.tsx";
import {useWithdrawMetamask} from "@src/hooks/use-withdraw-metamask";
import {Address} from "viem";
import {ConnectWalletClient} from "@src/clients/viem/walletClient.ts";
import {truncateAddress} from "@src/utils/wallet.ts";
import {useGetVaultBalance} from "@src/hooks/use-get-vault-balance.ts";
import FinanceChangeWallet from "@src/sections/finance/components/finance-change-wallet.tsx";
import {useResponsive} from "@src/hooks/use-responsive.ts";

interface FinanceDepositFromSmartAccountProps {
  onClose: () => void;
}

const FinanceWithdrawFromMetamask: FC<FinanceDepositFromSmartAccountProps> = ({ onClose }) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address | undefined>();
  const { balance } = useGetVaultBalance(address);
  const { enqueueSnackbar } = useSnackbar();
  const { withdraw, loading: withdrawLoading, error } = useWithdrawMetamask();
  const [destinationAddress, setDestinationAddress] = useState('');
  const [addressError, setAddressError] = useState(false);


  useEffect(() => {
    if (error) {
      enqueueSnackbar(`Deposit failed: ${error?.message}`, { variant: "error" });
    }
  }, [enqueueSnackbar, error]);


  useEffect(() => {
    handleConnectMetamask();
  }, []);

  async function handleConnectMetamask() {
    try {
      const walletClient = await ConnectWalletClient();
      const [addr] = await walletClient.requestAddresses();
      setAddress(addr);
    } catch (error) {
      alert(`Transaction failed: ${error}`);
    }
  }

  const handleConfirmWithdraw = async () => {
    if (amount > 0 && amount <= (balance ?? 0)) {
      try {
        setLoading(true);
        await withdraw({amount: amount, recipient: destinationAddress});
        enqueueSnackbar(`The withdraw was successful`, { variant: "success" });
        onClose();
      } catch (err: any) {
        enqueueSnackbar(`Withdraw failed: ${err?.message}`, { variant: "error" });
      } finally {
        setLoading(false);
      }
    } else {
      enqueueSnackbar("Invalid withdraw amount", { variant: "warning" });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDestinationAddress(value);


    if (isValidAddress(value)) {
      setAddressError(false);
    } else {
      setAddressError(true);
    }
  };

  const RainbowEffect = loading || withdrawLoading ? NeonPaper : Box;
  const mdUp = useResponsive('up', 'md');
  return (
    <>
      <Stack
        sx={{ p: 2, gap: 1 }}
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
            {truncateAddress(address ?? '')}
          </TextMaxLine>
        </BoxRow>
        <Divider sx={{ width: "100%" }} />
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
          <TextMaxLine line={1}>Amount to withdraw</TextMaxLine>
          <InputAmount
            max={balance ?? 0}
            amount={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </BoxRow>
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
      <DialogActions sx={{width: '100%', pt: 1, alignItems: 'center',
        display: 'flex',
        //flexDirection: mdUp ? 'row':'column',
        justifyContent: 'space-between'}}>

        <FinanceChangeWallet onChangingWallet={setAddress} />

        {/*<Button onClick={onClose}>Cancel</Button>*/}

        <RainbowEffect borderRadius={"10px"} animationSpeed={"3s"} padding={"0"} width={"auto"}>
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: "#fff", width: '100%'}}
            onClick={handleConfirmWithdraw}
            disabled={loading || withdrawLoading || amount <= 0 || amount > (balance ?? 0)}
            loading={loading || withdrawLoading}
          >
            <TextMaxLine line={1}>Confirm & Withdraw</TextMaxLine>
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </>
  );
};

export default FinanceWithdrawFromMetamask;
