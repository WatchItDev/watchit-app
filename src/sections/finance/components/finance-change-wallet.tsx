// React and libraries imports
import 'viem/window';
import { FC } from 'react';
import { Address } from 'viem';

// @mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Project imports
import TextMaxLine from '@src/components/text-max-line';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import { notifyError, notifySuccess } from '@notifications/internal-notifications.ts';
import { SUCCESS } from '@notifications/success.ts';
import { ERRORS } from '@notifications/errors.ts';

type FinanceChangeWalletProps = {
  onChangingWallet?: (address: Address) => void;
};

const FinanceChangeWallet: FC<FinanceChangeWalletProps> = ({ onChangingWallet }) => {
  // Function to handle wallet changes (User can interchange wallets using MetaMask extension)
  const handleChangeWallet = async () => {
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
          onChangingWallet?.(accounts[0] as Address);
          notifySuccess(SUCCESS.WALLET_CHANGED_SUCCESFULLY);
        })
      )
      .catch((error: any) => {
        notifyError(ERRORS.FAILED_CHANGE_WALLET_ERROR);
      });
  };

  const mdUp = useResponsive('up', 'md');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Button variant="contained" color="secondary" onClick={handleChangeWallet}>
        <TextMaxLine line={1}>{mdUp ? 'Change Wallet' : 'Change'}</TextMaxLine>
      </Button>
    </Box>
  );
};

export default FinanceChangeWallet;
