import { FC } from 'react';
import { useWithdraw } from '@src/hooks/use-withdraw';
import { useGetBalance } from '@src/hooks/use-get-balance';
import { useSelector } from 'react-redux';
import FinanceWithdraw from './finance-withdraw';

interface FinanceWithdrawFromSmartAccountProps {
  onClose: () => void;
}

const FinanceWithdrawFromSmartAccount: FC<FinanceWithdrawFromSmartAccountProps> = ({ onClose }) => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const userAddress = sessionData?.address;
  const { balance } = useGetBalance();
  const withdrawHook = useWithdraw();

  return (
    <FinanceWithdraw
      address={userAddress}
      withdrawHook={withdrawHook}
      balance={balance}
      onClose={onClose}
    />
  );
};

export default FinanceWithdrawFromSmartAccount;
