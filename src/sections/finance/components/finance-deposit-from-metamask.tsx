// React and libraries imports
import { FC, useEffect, useState } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Address } from 'viem';

// @mui components
import Button from '@mui/material/Button';

// Projects imports
import Iconify from '@src/components/iconify';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { useDepositMetamask } from '@src/hooks/use-deposit-metamask';
import FinanceDeposit from './finance-deposit';
import { LoadingScreen } from '@src/components/loading-screen';

interface FinanceDepositFromMetamaskProps {
  onClose: () => void;
}

const FinanceDepositFromMetamask: FC<FinanceDepositFromMetamaskProps> = ({ onClose }) => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const { enqueueSnackbar } = useSnackbar();

  const [address, setAddress] = useState<Address | undefined>();
  const [connecting, setConnecting] = useState(false);

  // Specific hook for Metamask
  const depositHook = useDepositMetamask();

  // Try reconnecting if the user connected Metamask before
  useEffect(() => {
    const walletConnected = localStorage.getItem('walletConnected');
    if (walletConnected === 'true') {
      handleConnectMetamask();
    }
  }, []);

  const handleConnectMetamask = async () => {
    setConnecting(true);
    try {
      const MMSDK = new MetaMaskSDK({
        infuraAPIKey: GLOBAL_CONSTANTS.INFURA_API_KEY,
        dappMetadata: {
          name: 'WatchitApp',
          url: window.location.href,
        },
        openDeeplink: (url) => {
          // @ts-ignore
          const isMM = window.ethereum.isMetaMask;

          if (typeof window.ethereum === 'undefined' || !isMM || localStorage.getItem('walletConnected') !== 'true') {
            setConnecting(false);
            window.location.href = 'https://metamask.app.link';
          } else {
            window.location.href = url;
          }
        },
      });

      await MMSDK.init();
      const accounts = await MMSDK.connect();
      setAddress(accounts[0] as Address);
      localStorage.setItem('walletConnected', 'true');
    } catch (err) {
      enqueueSnackbar('Error connecting to Metamask.', { variant: 'error' });
    } finally {
      setConnecting(false);
    }
  };

  if (connecting) {
    return <LoadingScreen />;
  }

  // If the wallet is NOT connected, show a button
  if (!address) {
    return (
      <Button
        sx={{ m: 4, p: 1.5 }}
        startIcon={<Iconify icon="logos:metamask-icon" />}
        variant="outlined"
        onClick={handleConnectMetamask}
      >
        Connect Metamask
      </Button>
    );
  }

  // If the wallet IS connected, render the same FinanceDeposit
  return (
    <FinanceDeposit
      address={address}
      recipient={sessionData?.address}
      depositHook={depositHook}
      onClose={onClose}
    />
  );
};

export default FinanceDepositFromMetamask;
