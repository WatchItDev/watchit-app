import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { connectToMetaMask } from '@src/utils/metamask';
import { notifyError } from '@notifications/internal-notifications.ts';
import { ERRORS } from '@notifications/errors.ts';

export const useMetaMask = () => {
  const [address, setAddress] = useState<Address | undefined>();
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const walletConnected = localStorage.getItem('walletConnected');
    if (walletConnected === 'true') {
      connect();
    }
  }, []);

  const connect = async () => {
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

  return { address, connecting, connect, setAddress };
};
