// React and libraries imports
import { FC } from 'react';
import { useSelector } from 'react-redux';

// Project components
import { useDeposit } from '@src/hooks/use-deposit';
import FinanceDeposit from './finance-deposit';

interface FinanceDepositFromSmartAccountProps {
  onClose: () => void;
}

const FinanceDepositFromSmartAccount: FC<FinanceDepositFromSmartAccountProps> = ({ onClose }) => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const depositHook = useDeposit();
  const userAddress = sessionData?.address;

  return (
    <FinanceDeposit
      address={userAddress}      // the connected wallet (smart account)
      recipient={userAddress}    // who receives the funds
      depositHook={depositHook}  // the generic hook
      onClose={onClose}
    />
  );
};

export default FinanceDepositFromSmartAccount;
