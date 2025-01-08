// REACT IMPORTS
import { FC } from 'react';

// REDUX IMPORTS
import { useSelector } from 'react-redux';

// LOCAL IMPORTS
import { useMetaMask } from '@src/hooks/use-metamask';
import { useDepositMetamask } from '@src/hooks/use-deposit-metamask';
import FinanceDeposit from '@src/sections/finance/components/finance-deposit';
import FinanceMetamaskLoader from '@src/sections/finance/components/finance-metamask-loader.tsx';
import FinanceMetamaskButton from '@src/sections/finance/components/finance-metamask-button.tsx';

interface FinanceDepositFromMetamaskProps {
  onClose: () => void;
}

const FinanceDepositFromMetamask: FC<FinanceDepositFromMetamaskProps> = ({ onClose }) => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const depositHook = useDepositMetamask();
  const { address, connecting, connect, setAddress } = useMetaMask();

  if (connecting) return <FinanceMetamaskLoader />;
  if (!address) return <FinanceMetamaskButton connect={connect} />;

  return <FinanceDeposit address={address} recipient={sessionData?.address} depositHook={depositHook} onClose={onClose} onChangeWallet={setAddress} />;
};

export default FinanceDepositFromMetamask;
