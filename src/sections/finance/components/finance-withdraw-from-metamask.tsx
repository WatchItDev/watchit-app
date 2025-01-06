// React and libraries imports
import {FC, useEffect, useState} from 'react';
import {Address} from 'viem';

// @MUI Imports
import Button from '@mui/material/Button';

// Import Components
import Iconify from '@src/components/iconify';
import FinanceWithdraw from './finance-withdraw.tsx';
import {useWithdrawMetamask} from '@src/hooks/use-withdraw-metamask';
import {useGetVaultBalance} from '@src/hooks/use-get-vault-balance';
import {connectToMetaMask} from '@src/utils/metamask';
import {LoadingScreen} from '@src/components/loading-screen';

import {ERRORS} from "@src/utils/errors";
import {notifyError} from "@src/utils/internal-notifications";

interface FinanceWithdrawFromMetamaskProps {
  onClose: () => void;
}

const FinanceWithdrawFromMetamask: FC<FinanceWithdrawFromMetamaskProps> = ({ onClose }) => {
  const [address, setAddress] = useState<Address | undefined>();
  const [connecting, setConnecting] = useState(false);
  const { balance } = useGetVaultBalance(address);
  const withdrawHook = useWithdrawMetamask();

  // Auto-reconnect if MetaMask was previously connected
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
      notifyError(ERRORS.METAMASK_CONNECTING_ERROR);
    } finally {
      setConnecting(false);
    }
  };

  if (connecting) {
    return <LoadingScreen />;
  }

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

  return (
    <FinanceWithdraw
      address={address}
      withdrawHook={withdrawHook}
      balance={balance}
      onClose={onClose}
    />
  );
};

export default FinanceWithdrawFromMetamask;
