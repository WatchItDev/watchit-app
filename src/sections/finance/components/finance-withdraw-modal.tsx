// REACT IMPORTS
import {FC, useState} from 'react';

// MUI IMPORTS

import DialogTitle from "@mui/material/DialogTitle";

import Dialog, {DialogProps} from "@mui/material/Dialog";

// LOCAL IMPORTS

import FinanceWithdrawFromSmartAccount from "@src/sections/finance/components/finance-withdraw-from-smart-account";
import Iconify from "@src/components/iconify";
import Tabs, {tabsClasses} from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FinanceWithdrawFromMetamask from "@src/sections/finance/components/finance-withdraw-from-metamask.tsx";

const TABS = [
  { value: 'metamask', label: 'Metamask', disabled: false, icon: <Iconify icon={'logos:metamask-icon'} /> },
  { value: 'smartAccount', label: 'Smart Account', disabled: false, icon: <Iconify icon={'logos:ethereum-color'} /> },
];

// ----------------------------------------------------------------------

interface FinanceWitdrawModalProps extends DialogProps {
  onClose: VoidFunction;
}

// ----------------------------------------------------------------------

export const FinanceWithdrawModal: FC<FinanceWitdrawModalProps> = ({ open, onClose }) => {
  const [currentTab, setCurrentTab] = useState('metamask');

  const handleChangeTab = (_event: any, newValue: any) => {
    setCurrentTab(newValue);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Withdraw from your vault balance</DialogTitle>

      <Tabs
        key={`tabs-deposit`}
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          width: 1,
          zIndex: 9,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          [`& .${tabsClasses.flexContainer}`]: { justifyContent: { xs: 'left', md: 'center' }},
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

      {currentTab === 'metamask' && (<FinanceWithdrawFromMetamask onClose={onClose} />)}
      {currentTab === 'smartAccount' && (<FinanceWithdrawFromSmartAccount onClose={onClose} />)}

    </Dialog>
  );
}
