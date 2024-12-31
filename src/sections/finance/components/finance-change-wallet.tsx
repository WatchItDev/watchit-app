import "viem/window";
// @mui
import Button from "@mui/material/Button";
// ----------------------------------------------------------------------

// Import necessary hooks and clients
import { useSnackbar } from 'notistack';
import Box from "@mui/material/Box";
import {FC} from "react";
import {Address} from "viem";
import TextMaxLine from "@src/components/text-max-line";

type FinanceChangeWalletProps = {
  onChangingWallet: (address: Address | undefined) => void;
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
      onChangingWallet(accounts[0] as Address);
      enqueueSnackbar('Wallet changed successfully!', { variant: 'success', autoHideDuration: 3000 });
    })).catch((error: any) => {
      console.error('Error changing wallet:', error);
      enqueueSnackbar(`Failed to change wallet: ${error.message}`, {variant: 'error', autoHideDuration: 5000});
    })
  }

  return (
    <Box sx={{ flexGrow: 1 }} >
      <Button
        variant="contained"
        color="secondary"
        onClick={handleChangeWallet}
      >
        <TextMaxLine line={1}>Change Wallet</TextMaxLine>

      </Button>
    </Box>
  );
};

export default FinanceChangeWallet;
