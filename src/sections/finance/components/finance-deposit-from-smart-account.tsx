import { FC } from 'react'
import { useSelector } from 'react-redux'
import FinanceDeposit from './finance-deposit'
import { useDeposit } from '@src/hooks/use-deposit'

interface FinanceDepositFromSmartAccountProps {
  onClose: () => void;
}

const FinanceDepositFromSmartAccount: FC<FinanceDepositFromSmartAccountProps> = ({ onClose }) => {
  const sessionData = useSelector((state: any) => state.auth.session)
  const depositHook = useDeposit()
  const userAddress = sessionData?.address

  return (
    <FinanceDeposit
      address={userAddress} // the connected wallet (smart account)
      recipient={userAddress} // who receives the funds
      depositHook={depositHook} // the generic hook
      onClose={onClose}
    />
  )
}

export default FinanceDepositFromSmartAccount
