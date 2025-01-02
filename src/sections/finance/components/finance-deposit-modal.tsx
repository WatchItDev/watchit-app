// REACT IMPORTS
import { FC, useState } from 'react';

// MUI IMPORTS
import Tab from "@mui/material/Tab";
import DialogTitle from "@mui/material/DialogTitle";
import Tabs, {tabsClasses} from "@mui/material/Tabs";
import Dialog, {DialogProps} from "@mui/material/Dialog";

// LOCAL IMPORTS
import Iconify from '@src/components/iconify';
import FinanceDepositFromStripe from "@src/sections/finance/components/finance-deposit-from-stripe.tsx";
import FinanceDepositFromMetamask from "@src/sections/finance/components/finance-deposit-from-metamask.tsx";
import FinanceDepositFromSmartAccount from "@src/sections/finance/components/finance-deposit-from-smart-account.tsx";

// ----------------------------------------------------------------------

interface FinanceDepositModalProps extends DialogProps {
  onClose: VoidFunction;
}

// ----------------------------------------------------------------------

const TABS = [
  { value: 'fiat', label: 'Stripe', disabled: false, icon: <Iconify icon={'logos:stripe'} /> },
  { value: 'metamask', label: 'Metamask', disabled: false, icon: <Iconify icon={'logos:metamask-icon'} /> },
  { value: 'smartAccount', label: 'Smart Account', disabled: false, icon: <Iconify icon={'logos:ethereum-color'} /> },
];

// ----------------------------------------------------------------------

export const FinanceDepositModal: FC<FinanceDepositModalProps> = ({ open, onClose }) => {
  const [currentTab, setCurrentTab] = useState('metamask');

  const handleChangeTab = (_event: any, newValue: any) => {
    setCurrentTab(newValue);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Deposit to your vault balance</DialogTitle>

      <Tabs
        key={`tabs-deposit`}
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          width: 1,
          zIndex: 9,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          [`& .${tabsClasses.flexContainer}`]: { justifyContent: 'center' },
        }}
      >
        {TABS.map((tab) => (
          <Tab
            icon={tab.icon}
            disabled={tab.disabled}
            key={tab.value}
            value={tab.value}
            label={tab.label}
          />
        ))}
      </Tabs>

      {currentTab === 'fiat'  && (<FinanceDepositFromStripe />)}
      {currentTab === 'metamask' && (<FinanceDepositFromMetamask onClose={onClose} />)}
      {currentTab === 'smartAccount' && (<FinanceDepositFromSmartAccount onClose={onClose} />)}
    </Dialog>
  );
}
