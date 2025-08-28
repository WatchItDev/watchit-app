// React and libraries imports
import { FC } from 'react';

// Project components
import FinanceDeposit from './finance-deposit';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useDeposit } from '@src/hooks/protocol/use-deposit.ts';

interface FinanceDepositFromSmartAccountProps {
  onClose: () => void;
}

const FinanceDepositFromSmartAccount: FC<
  FinanceDepositFromSmartAccountProps
> = ({ onClose }) => {
  const { session: sessionData } = useAuth();
  const depositHook = useDeposit();
  const userAddress = sessionData?.address;

  return (
    <FinanceDeposit
      address={userAddress} // the connected wallet (smart account)
      recipient={userAddress} // who receives the funds
      depositHook={depositHook} // the generic hook
      onClose={onClose}
    />
  );
};

export default FinanceDepositFromSmartAccount;
