import 'viem/window';

// @mui
import Stack from '@mui/material/Stack';
import { CardProps } from '@mui/material/Card';
import Button from '@mui/material/Button';

// theme
import { bgGradient } from '@src/theme/css';

// components
import Iconify from '@src/components/iconify';
import FinanceExternalWallet from './finance-external-wallet.tsx';
import SeoIllustration from '@src/assets/illustrations/seo-illustration.tsx';
// ----------------------------------------------------------------------

// Import necessary hooks and clients
import { useState, useEffect, FC } from 'react';
import { ConnectWalletClient } from '@src/clients/viem/walletClient';
import { useGetVaultBalance } from '@src/hooks/use-get-vault-balance'; // Ensure correct path
import { useSnackbar } from 'notistack';

const FinanceQuickActions: FC<CardProps> = ({ sx, ...other }) => {
  const [connectedWallet, setConnectedWallet] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { balance } = useGetVaultBalance(walletAddress as any);
  const { enqueueSnackbar } = useSnackbar();

  // Function to connect to MetaMask
  const connectWallet = async () => {
    try {
      const walletClient = await ConnectWalletClient();
      const [address] = await walletClient.requestAddresses();
      if (address) {
        setWalletAddress(address);
        setConnectedWallet(true);
        enqueueSnackbar('MetaMask connected successfully!', {
          variant: 'success',
          autoHideDuration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error connecting to wallet:', error);
      enqueueSnackbar(`Failed to connect wallet: ${error.message}`, {
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  };

  // Function to handle wallet changes (User can interchange wallets using MetaMask extension)
  const handleChangeWallet = async () => {
    setConnectedWallet(false);

    window?.ethereum
      ?.request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
      .then(() =>
        window?.ethereum?.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => {
          setWalletAddress(accounts[0]);
          setConnectedWallet(true);
        })
      )
      .catch((error: any) => {
        console.error('Error changing wallet:', error);
        enqueueSnackbar(`Failed to change wallet: ${error.message}`, {
          variant: 'error',
          autoHideDuration: 5000,
        });
      });
  };

  // Automatically attempt to connect wallet on component mount
  useEffect(() => {
    (async () => {
      try {
        const walletClient = await ConnectWalletClient();
        const [address] = await walletClient.requestAddresses();
        if (address) {
          setWalletAddress(address);
          setConnectedWallet(true);
        }
      } catch (error) {
        console.log('Wallet not connected');
      }
    })();
  }, []);

  // Determine title and info based on connection status
  const title = connectedWallet ? "Balance's Vault Metamask." : 'Connect external wallet';
  const info = connectedWallet
    ? 'MetaMask connected. If you wish to change, click the button below.'
    : 'You can connect your MetaMask wallet to view your vault balance.';

  // Format the balance for display
  const totalOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 };
  const formattedTotal =
    balance !== null ? new Intl.NumberFormat('en-US', totalOptions).format(balance) : '0';

  return (
    <Stack
      sx={{
        ...bgGradient({
          direction: '135deg',
        }),
        width: 1,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      <FinanceExternalWallet
        connectedWallet={connectedWallet}
        title={title}
        info={info}
        description={formattedTotal}
        img={<SeoIllustration />}
        action={
          <>
            {connectedWallet ? (
              <Button
                sx={{ mb: 2, mt: 2 }}
                startIcon={<Iconify icon="solar:wallet-2-outline" />}
                variant="contained"
                color="secondary"
                onClick={handleChangeWallet}
              >
                Change Wallet
              </Button>
            ) : (
              <Button
                sx={{ mb: 3 }}
                startIcon={<Iconify icon="solar:wallet-2-outline" />}
                variant="contained"
                color="secondary"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}
          </>
        }
      />
    </Stack>
  );
};

export default FinanceQuickActions;
