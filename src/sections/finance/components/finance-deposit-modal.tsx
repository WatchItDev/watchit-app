import { FC } from 'react'
import Iconify from '@src/components/iconify'
import FinanceDepositFromMetamask from '@src/sections/finance/components/finance-deposit-from-metamask'
import FinanceDepositFromSmartAccount from '@src/sections/finance/components/finance-deposit-from-smart-account'
import FinanceDepositFromStripe from '@src/sections/finance/components/finance-deposit-from-stripe'
import FinanceModal from '@src/sections/finance/components/finance-modal'

interface FinanceDepositModalProps {
  open: boolean;
  onClose: VoidFunction;
}

const depositTabs = [
  { value: 'fiat', label: 'Stripe', disabled: false, icon: <Iconify icon={'logos:stripe'} /> },
  { value: 'metamask', label: 'Metamask', disabled: false, icon: <Iconify icon={'logos:metamask-icon'} /> },
  { value: 'smartAccount', label: 'Smart Account', disabled: false, icon: <Iconify icon={'logos:ethereum-color'} /> },
]

export const FinanceDepositModal: FC<FinanceDepositModalProps> = ({ open, onClose }) => {
  const renderContent = (currentTab: string) => {
    switch (currentTab) {
      case 'fiat':
        return <FinanceDepositFromStripe />
      case 'metamask':
        return <FinanceDepositFromMetamask onClose={onClose} />
      case 'smartAccount':
        return <FinanceDepositFromSmartAccount onClose={onClose} />
      default:
        return null
    }
  }

  return (
    <FinanceModal
      open={open}
      onClose={onClose}
      title="Deposit from"
      tabs={depositTabs}
      renderContent={renderContent}
      maxWidth="xs"
      fullWidth
    />
  )
}

export default FinanceDepositModal
