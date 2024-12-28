import Box from "@mui/material/Box";
import { useSDK } from "@metamask/sdk-react";
import { useState } from "react";
import Button from "@mui/material/Button";
import { ethers } from "ethers";

const FinanceDepositFromMetamask = () => {
  const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  // Request permission to read the balance
  const getBalance = async (account: string) => {
    try {
      const balance = await provider.request({
        method: "eth_getBalance",
        // @ts-ignore
        params: [account, 'latest'],
      });
      // @ts-ignore
      const balanceInEther = ethers.formatEther(balance);
      console.log("balance in Ether", balanceInEther);
    } catch (err) {
      console.warn("failed to get balance..", err);
    }
  };

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.log("connected", accounts);
      setAccount(accounts?.[0]);
      // @ts-ignore
      await getBalance(accounts?.[0]);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };

  const revokePermissions = async () => {
    await provider // Or window.ethereum if you don't support EIP-6963.
      .request({
        method: "wallet_revokePermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
  }



  return (
    <Box>
      <Button
        variant={'outlined'}
        onClick={connect}
        //disabled={connected || connecting}
      >
        Connect to MetaMask
      </Button>

      <Button
        variant={'outlined'}
        onClick={revokePermissions}
      >
        Disconnect
      </Button>

      {connected && (
        <div>
          <>
            {chainId && `Connected chain: ${chainId}`}
            <p></p>
            {account && `Connected account: ${account}`}
          </>
        </div>
      )}
    </Box>
  );
}

export default FinanceDepositFromMetamask;
