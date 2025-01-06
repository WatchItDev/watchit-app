import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Iconify from '@src/components/iconify';
import { Address } from 'viem';
import { connectToMetaMask } from '@src/utils/metamask';
import { useDepositMetamask } from '@src/hooks/use-deposit-metamask';
import { LoadingScreen } from '@src/components/loading-screen';
import FinanceDeposit from './finance-deposit';

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

  // Try reconnecting if the user connected MetaMask before
  useEffect(() => {
    const walletConnected = localStorage.getItem('walletConnected');
    if (walletConnected === 'true') {
      handleConnectMetaMask();
    }
  }, []);

  const handleConnectMetaMask = async () => {
    setConnecting(true);
    try {
      const walletAddress = await connectToMetaMask();
      setAddress(walletAddress);
      localStorage.setItem('walletConnected', 'true');
    } catch (err) {
      enqueueSnackbar('Error connecting to MetaMask.', { variant: 'error' });
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
        onClick={handleConnectMetaMask}
      >
        Connect MetaMask
      </Button>
    );
  }

  // If the wallet IS connected, render the deposit component
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
