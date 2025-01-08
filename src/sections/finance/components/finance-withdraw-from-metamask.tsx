// REACT IMPORTS
import { FC } from 'react';

// LOCAL IMPORTS
import { useMetaMask } from '@src/hooks/use-metamask';
import { useWithdrawMetamask } from '@src/hooks/use-withdraw-metamask';
import { useGetVaultBalance } from '@src/hooks/use-get-vault-balance';
import FinanceWithdraw from '@src/sections/finance/components/finance-withdraw';
import FinanceMetamaskLoader from '@src/sections/finance/components/finance-metamask-loader.tsx';
import FinanceMetamaskButton from '@src/sections/finance/components/finance-metamask-button.tsx';

interface FinanceWithdrawFromMetamaskProps {
  onClose: () => void;
}

const FinanceWithdrawFromMetamask: FC<FinanceWithdrawFromMetamaskProps> = ({ onClose }) => {
  const withdrawHook = useWithdrawMetamask();
  const { address, connecting, connect, setAddress } = useMetaMask();
  const { balance } = useGetVaultBalance(address);

  if (connecting) return <FinanceMetamaskLoader />;
  if (!address) return <FinanceMetamaskButton connect={connect} />;

  return <FinanceWithdraw address={address} withdrawHook={withdrawHook} balance={balance} onClose={onClose} onChangeWallet={setAddress} />;
};

export default FinanceWithdrawFromMetamask;
