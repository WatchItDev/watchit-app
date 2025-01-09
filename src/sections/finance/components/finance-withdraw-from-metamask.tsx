// REACT IMPORTS
import { FC } from 'react';

// LOCAL IMPORTS
import { useMetaMask } from '@src/hooks/use-metamask';
import FinanceWithdraw from '@src/sections/finance/components/finance-withdraw';
import FinanceMetamaskLoader from '@src/sections/finance/components/finance-metamask-loader.tsx';
import FinanceMetamaskButton from '@src/sections/finance/components/finance-metamask-button.tsx';
import { useWithdraw } from '@src/hooks/use-withdraw.ts';

interface FinanceWithdrawFromMetamaskProps {
  onClose: () => void;
}

const FinanceWithdrawFromMetamask: FC<FinanceWithdrawFromMetamaskProps> = ({ onClose }) => {
  const withdrawHook = useWithdraw();
  const { address, connecting, connect } = useMetaMask();

  if (connecting) return <FinanceMetamaskLoader />;
  if (!address) return <FinanceMetamaskButton connect={connect} />;

  return <FinanceWithdraw address={address} withdrawHook={withdrawHook} onClose={onClose} />;
};

export default FinanceWithdrawFromMetamask;
