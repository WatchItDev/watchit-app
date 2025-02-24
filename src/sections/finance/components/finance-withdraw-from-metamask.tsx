import { FC } from 'react'
import { useMetaMask } from '@src/hooks/use-metamask'
import { useWithdraw } from '@src/hooks/use-withdraw.ts'
import FinanceMetamaskButton from '@src/sections/finance/components/finance-metamask-button.tsx'
import FinanceMetamaskHelper from "@src/sections/finance/components/finance-metamask-helper.tsx"
import FinanceMetamaskLoader from '@src/sections/finance/components/finance-metamask-loader.tsx'
import FinanceWithdraw from '@src/sections/finance/components/finance-withdraw'

interface FinanceWithdrawFromMetamaskProps {
  onClose: () => void;
}

const FinanceWithdrawFromMetamask: FC<FinanceWithdrawFromMetamaskProps> = ({ onClose }) => {
  const withdrawHook = useWithdraw()
  const { account: address, loading, connect } = useMetaMask()

  if (loading) return <FinanceMetamaskLoader />
  if (!address) return <><FinanceMetamaskButton connect={connect} /><FinanceMetamaskHelper/></>

  return <FinanceWithdraw address={address} withdrawHook={withdrawHook} onClose={onClose} />
}

export default FinanceWithdrawFromMetamask
