// REACT IMPORTS
import { FC } from 'react';

// LOCAL IMPORTS
import FinanceDeposit from '@src/sections/finance/components/finance-deposit';
import FinanceMetamaskLoader from '@src/sections/finance/components/finance-metamask-loader.tsx';
import FinanceMetamaskButton from '@src/sections/finance/components/finance-metamask-button.tsx';
import FinanceMetamaskHelper from "@src/sections/finance/components/finance-metamask-helper.tsx";
import { useAuth } from '@src/hooks/use-auth.ts';
import { useMetaMask } from '@src/hooks/use-metamask';
import { useDepositMetamask } from '@src/hooks/protocol/use-deposit-metamask.ts';

interface FinanceDepositFromMetamaskProps {
  onClose: () => void;
}

const FinanceDepositFromMetamask: FC<FinanceDepositFromMetamaskProps> = ({ onClose }) => {
  const { session: sessionData } = useAuth();
  const depositHook = useDepositMetamask();
  const { account: address, loading, connect } = useMetaMask();

  if (loading) return <FinanceMetamaskLoader />;
  if (!address) return <><FinanceMetamaskButton connect={connect} /><FinanceMetamaskHelper /></>;

  return <FinanceDeposit address={address} recipient={sessionData?.address} depositHook={depositHook} onClose={onClose} />;
};

export default FinanceDepositFromMetamask;
