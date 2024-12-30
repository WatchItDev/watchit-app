import "viem/window";
import {FC, PropsWithChildren, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ConnectWalletClient } from "@src/clients/viem/walletClient";
import { Address } from 'viem';
import Iconify from "@src/components/iconify";
import Stack from "@mui/material/Stack";
import {formatBalanceNumber} from "@src/utils/format-number.ts";
import TextMaxLine from "@src/components/text-max-line";
import {InputAmount} from "@src/components/input-amount.tsx";
import Divider from "@mui/material/Divider";
import { useGetMmcContractBalance } from '@src/hooks/use-get-mmc-contract-balance.ts';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import NeonPaper from '@src/sections/publication/NeonPaperContainer.tsx';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useDepositMetamask } from "@src/hooks/use-deposit-metamask.ts";
import { truncateAddress } from '@src/utils/wallet.ts';

interface FinanceDepositFromMetamaskProps {
  onClose: () => void;
}

const FinanceDepositFromMetamask: FC<FinanceDepositFromMetamaskProps> = ({ onClose }) => {
  const [address, setAddress] = useState<Address | undefined>();
  const { balance } = useGetMmcContractBalance(address);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const sessionData = useSelector((state: any) => state.auth.session);
  const { enqueueSnackbar } = useSnackbar();
  const {
    deposit: depositWithMetamask,
    loading: depositLoading,
    error,
  } = useDepositMetamask();

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

  const handleConfirmDeposit = async () => {
    if (amount > 0 && amount <= (balance ?? 0)) {
      try {
        setLoading(true);
        await depositWithMetamask({
          recipient: sessionData?.address, // o la dirección que quieras
          amount
        });
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

  return (
    <Stack sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      { address ? (
        <>
          <Stack
            sx={{mt:2, py: 2, px: 3, gap:1, width: '100%'}}
            direction={'column'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}>
            <BoxRow>
              <TextMaxLine line={1}>Connected Wallet</TextMaxLine>
              <TextMaxLine
                line={1}
                sx={{ fontWeight: "bold", fontSize: "1em", color: "text.secondary" }}
              >
                {truncateAddress(address)}
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

            <Divider  sx={{width: '100%'}}/>

            <BoxRow>
              <TextMaxLine line={1}>Enter the amount to deposit</TextMaxLine>
              <InputAmount
                max={balance ?? 0}
                amount={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </BoxRow>
            <Divider  sx={{width: '100%'}}/>
          </Stack>
          <DialogActions sx={{ width: '100%', pt: 1, px: 3 }}>
            <Button onClick={onClose}>Cancel</Button>

            <RainbowEffect borderRadius={"10px"} animationSpeed={"3s"} padding={"0"} width={"auto"}>
              <LoadingButton
                variant="contained"
                sx={{ backgroundColor: "#fff" }}
                onClick={handleConfirmDeposit}
                disabled={loading || depositLoading || amount <= 0 || amount > (balance ?? 0)}
                loading={loading || depositLoading}
              >
                Confirm & Deposit
              </LoadingButton>
            </RainbowEffect>
          </DialogActions>
        </>
      ) : (
        <Button
          startIcon={<Iconify icon={'logos:metamask-icon'} />}
          variant={'outlined'}
          onClick={handleConnectMetamask}
        >
          Connect MetaMask
        </Button>
      )}
    </Stack>
  );
}

export const BoxRow: FC<PropsWithChildren> = ({children}) => (
  <Box sx={{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}>
    {children}
  </Box>
)

export default FinanceDepositFromMetamask;
