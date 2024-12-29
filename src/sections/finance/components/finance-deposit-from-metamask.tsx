import "viem/window";
import {FC, PropsWithChildren, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ConnectWalletClient, ConnectPublicClient } from "@src/clients/viem/walletClient";
import {formatEther} from "viem";
import Iconify from "@src/components/iconify";
import Stack from "@mui/material/Stack";
import {formatBalanceNumber} from "@src/utils/format-number.ts";
import TextMaxLine from "@src/components/text-max-line";
import {InputAmount} from "@src/components/input-amount.tsx";
import Divider from "@mui/material/Divider";

const FinanceDepositFromMetamask = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  //Verify if the user has a wallet connected reading the address from the wallet client
  useEffect(() => {
    // Call an async function to retrieve the wallet address
    (async () => {
      // Instantiate a Wallet Client
      const walletClient = await ConnectWalletClient();
      // Retrieve the wallet address using the Wallet Client
      const [address] = await walletClient.requestAddresses();

      // Update the state variable with the retrieved address
      setAddress(address);

      // If the address is not null, retrieve the balance of the address using the Public Client
      if(address){
        // Instantiate a Public Client
        const publicClient = ConnectPublicClient();
        // Retrieve the balance of the address using the Public Client
        const balance = formatEther(await publicClient.getBalance({ address }));
        // Update the state variable with the retrieved balance
        setBalance(parseInt(balance));
      }
    })()

  }, []);

 // Function to handle the button click event
  async function handleClick() {
    try {
      // Instantiate a Wallet Client and a Public Client
      const walletClient = await ConnectWalletClient();
      const publicClient = ConnectPublicClient();

      // Retrieve the wallet address using the Wallet Client
      const [address] = await walletClient.requestAddresses();
      // const [address] = await walletClient.getAddresses();

      // Retrieve the balance of the address using the Public Client
      const balance = formatEther(await publicClient.getBalance({ address }));

      // Update the state variables with the retrieved address and balance
      setAddress(address);
      // @ts-ignore
      setBalance(balance);
    } catch (error) {
      // Error handling: Display an alert if the transaction fails
      alert(`Transaction failed: ${error}`);
    }
  }


  // Component to display the wallet status (connected or disconnected)
  function Status({
                    address,
                    balance,
                  }: {
    address: string | null;
    balance: string;
  }) {
    if (!address) {
      // If no address is provided, display "Disconnected" status
      return (
          <Button
            startIcon={<Iconify icon={'logos:metamask-icon'} />}
            variant={'outlined'}
            onClick={handleClick}
          >
            Connect MetaMask
          </Button>

      );
    }

    // If an address is provided, display the address and balance
    return (
      <Stack
        sx={{my:2, p: 2, gap:1 }}
        direction={'column'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}>

        <Box sx={{fontWeight: 'bold', width:'100%'}}>
          <TextMaxLine line={1}>Connected Wallet</TextMaxLine>
          <TextMaxLine line={1} sx={{color: 'text.secondary'}}>{address}</TextMaxLine>
        </Box>

        <Divider  sx={{width: '100%'}}/>

        <BoxRow>
          <TextMaxLine line={1}>Balance</TextMaxLine>
          <TextMaxLine line={1} sx={{fontWeight: 'bold',fontSize: '1.5em',color: 'text.secondary'}}>{formatBalanceNumber(balance as any)} MMC</TextMaxLine>
        </BoxRow>

        <Divider  sx={{width: '100%'}}/>

        <BoxRow>
          <TextMaxLine line={1}>Enter the amount to deposit</TextMaxLine>
          <InputAmount max={100} amount={0} />
        </BoxRow>
        <Divider  sx={{width: '100%'}}/>
      </Stack>
    );
  }

  return (
    <Stack sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/*// @ts-ignore*/}
      <Status address={address} balance={balance} />
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
