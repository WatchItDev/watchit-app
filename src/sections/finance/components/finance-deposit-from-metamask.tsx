import { FC } from 'react'
import { useSelector } from 'react-redux'
import { useDepositMetamask } from '@src/hooks/use-deposit-metamask'
import { useMetaMask } from '@src/hooks/use-metamask'
import FinanceDeposit from '@src/sections/finance/components/finance-deposit'
import FinanceMetamaskButton from '@src/sections/finance/components/finance-metamask-button.tsx'
import FinanceMetamaskHelper from "@src/sections/finance/components/finance-metamask-helper.tsx"
import FinanceMetamaskLoader from '@src/sections/finance/components/finance-metamask-loader.tsx'

interface FinanceDepositFromMetamaskProps {
  onClose: () => void;
}

const FinanceDepositFromMetamask: FC<FinanceDepositFromMetamaskProps> = ({ onClose }) => {
  const sessionData = useSelector((state: any) => state.auth.session)
  const depositHook = useDepositMetamask()
  const { account: address, loading, connect } = useMetaMask()

  if (loading) return <FinanceMetamaskLoader />
  if (!address) return <><FinanceMetamaskButton connect={connect} /><FinanceMetamaskHelper /></>

  return <FinanceDeposit address={address} recipient={sessionData?.address} depositHook={depositHook} onClose={onClose} />
}

export default FinanceDepositFromMetamask
