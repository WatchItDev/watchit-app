import "viem/window";
import { Address } from 'viem';
import { useSnackbar } from 'notistack';
import { FC, PropsWithChildren, useEffect, useState, useCallback } from "react";
import { useSelector } from 'react-redux';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Iconify from "@src/components/iconify";

import { formatBalanceNumber } from "@src/utils/format-number.ts";
import TextMaxLine from "@src/components/text-max-line";
import { InputAmount } from "@src/components/input-amount.tsx";
import { useGetMmcContractBalance } from '@src/hooks/use-get-mmc-contract-balance.ts';
import NeonPaper from '@src/sections/publication/NeonPaperContainer.tsx';
import { useDepositMetamask } from "@src/hooks/use-deposit-metamask.ts";
import { truncateAddress } from '@src/utils/wallet.ts';
import FinanceDialogsActions from "@src/sections/finance/components/finance-dialogs-actions.tsx";
import { useResponsive } from "@src/hooks/use-responsive.ts";
import { MetaMaskSDK } from "@metamask/sdk";
import {GLOBAL_CONSTANTS} from "@src/config-global.ts";
import {LoadingScreen} from "@src/components/loading-screen";

interface FinanceDepositFromMetamaskProps {
  onClose: () => void;
}

// TODO please finance-deposit.tsx
const FinanceDepositFromMetamask: FC<FinanceDepositFromMetamaskProps> = ({ onClose }) => {
  const [address, setAddress] = useState<Address | undefined>();
  const { balance } = useGetMmcContractBalance(address);
  const [amount, setAmount] = useState<number>(0);
  const [loadingMetamask, setLoadingMetamask] = useState(false);
  const [loading, setLoading] = useState(false);
  const sessionData = useSelector((state: any) => state.auth.session);
  const { enqueueSnackbar } = useSnackbar();
  const mdUp = useResponsive('up', 'md');

  const {
    deposit: depositWithMetamask,
    loading: depositLoading,
    error,
  } = useDepositMetamask();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(`An error occurred during transaction.`, { variant: "error" });
    }
  }, [error]);

  // Verify if the user has connected the wallet
  useEffect(() => {
    (async () => {
      const walletConnected = localStorage.getItem('walletConnected');
      if (walletConnected === 'true') {
        await handleConnectMetamask();
      }
    } )()
  }, []);

  const handleConnectMetamask = async () => {
    setLoadingMetamask(true);
    try {
      const MMSDK = new MetaMaskSDK({
        infuraAPIKey: GLOBAL_CONSTANTS.INFURA_API_KEY,
        dappMetadata: {
          name: "WatchitApp",
          url: window.location.href,
        },
        openDeeplink: (url) => {
          // @ts-ignore
          if(window.ethereum === 'undefined' || !window.ethereum.isMetaMask || localStorage.getItem('walletConnected') !== 'true'){
            setLoadingMetamask(false);
            window.location.href = 'https://metamask.app.link'
          }else{
            window.location.href = url;
          }
        },
      });

      await MMSDK.init();

      const accounts = await MMSDK.connect()

      const ethereum = MMSDK.getProvider();

      // @ts-ignore
      ethereum.request({ method: "eth_accounts", params: [] });

      setAddress(accounts?.[0] as Address);

      // Store in the local storage a flag to know that the user has connected the wallet
      localStorage.setItem('walletConnected', 'true');

    } catch (err) {
      enqueueSnackbar(`An error occurred during transaction.`, { variant: "error" });
    } finally {
      setLoadingMetamask(false);
    }
  };
  const handleConfirmDeposit = useCallback(async () => {
    if (amount > 0 && amount <= (balance ?? 0)) {
      try {
        setLoading(true);
        await depositWithMetamask({ recipient: sessionData?.address, amount });
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
  }, [sessionData?.address, amount, balance]);

  const RainbowEffect = loading || depositLoading ? NeonPaper : Box;
  if (loadingMetamask) return <Box sx={{m:3}}><LoadingScreen /></Box>;

  return (
    <Stack sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {address ? (
        <>
          <Stack
            sx={{ mt: 2, py: 2, px: 3, gap: 1, width: '100%' }}
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

            <Divider sx={{ width: '100%' }} />

            <BoxRow>
              <TextMaxLine line={1}>Enter the amount to deposit</TextMaxLine>
              <InputAmount
                autoFocus
                max={balance ?? 0}
                amount={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </BoxRow>
            <Divider sx={{ width: '100%' }} />
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
            onChangeWallet={setAddress}
          />
        </>
      ) : (<>
        <Button
          sx={{ m: 4 }}
          startIcon={<Iconify icon={'logos:metamask-icon'} />}
          variant={'outlined'}
          onClick={handleConnectMetamask}
        >
          Connect Metamask
        </Button>
        </>
      )}
    </Stack>
  );
}

export const BoxRow: FC<PropsWithChildren> = ({ children }) => (
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
