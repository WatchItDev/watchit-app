// React and libraries imports
import "viem/window";
import {FC} from "react";
import {Address} from "viem";
import { useSnackbar } from 'notistack';

// @mui
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// Project imports
import TextMaxLine from "@src/components/text-max-line";
import {useResponsive} from "@src/hooks/use-responsive.ts";

type FinanceChangeWalletProps = {
  onChangingWallet?: (address: Address ) => void;
}

const FinanceChangeWallet: FC<FinanceChangeWalletProps> = ({onChangingWallet}) => {
  const { enqueueSnackbar } = useSnackbar();

  // Function to handle wallet changes (User can interchange wallets using MetaMask extension)
  const handleChangeWallet = async () => {
    window?.ethereum?.request({
      method: "wallet_requestPermissions",
      params: [{
        eth_accounts: {}
      }]
    }).then(() => window?.ethereum?.request({method: 'eth_requestAccounts'}).then((accounts: string[]) => {
      console.log('Changed wallet to:', accounts[0]);
      onChangingWallet?.(accounts[0] as Address);
      enqueueSnackbar('Wallet changed successfully!', { variant: 'success', autoHideDuration: 3000 });
    })).catch((error: any) => {
      console.error('Error changing wallet:', error);
      enqueueSnackbar(`Failed to change wallet: ${error.message}`, {variant: 'error', autoHideDuration: 5000});
    })
  }

  const mdUp = useResponsive('up', 'md');

  return (
    <Box sx={{ flexGrow: 1 }} >
      <Button
        variant="contained"
        color="secondary"
        onClick={handleChangeWallet}
      >
        <TextMaxLine line={1}>
          {mdUp ? 'Change Wallet' : 'Change'}
        </TextMaxLine>

      </Button>
    </Box>
  );
};

export default FinanceChangeWallet;
