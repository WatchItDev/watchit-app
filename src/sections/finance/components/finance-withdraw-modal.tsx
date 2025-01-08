// REACT IMPORTS
import { FC, useState } from 'react';

// MUI IMPORTS

import DialogTitle from '@mui/material/DialogTitle';

import Dialog, { DialogProps } from '@mui/material/Dialog';

// LOCAL IMPORTS

import FinanceWithdrawFromSmartAccount from '@src/sections/finance/components/finance-withdraw-from-smart-account';
import Iconify from '@src/components/iconify';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FinanceWithdrawFromMetamask from '@src/sections/finance/components/finance-withdraw-from-metamask.tsx';

const TABS = [
  {
    value: 'metamask',
    label: 'Metamask',
    disabled: false,
    icon: <Iconify icon={'logos:metamask-icon'} />,
  },
  {
    value: 'smartAccount',
    label: 'Smart Account',
    disabled: false,
    icon: <Iconify icon={'logos:ethereum-color'} />,
  },
];

// ----------------------------------------------------------------------

interface FinanceWithdrawModalProps extends DialogProps {
  onClose: VoidFunction;
}

// ----------------------------------------------------------------------

export const FinanceWithdrawModal: FC<FinanceWithdrawModalProps> = ({ open, onClose }) => {
  const [currentTab, setCurrentTab] = useState('smartAccount');

  const handleChangeTab = (_event: any, newValue: any) => {
    setCurrentTab(newValue);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle sx={{ pb: 1 }}>Withdraw</DialogTitle>

      <Tabs
        key={`tabs-deposit`}
        value={currentTab}
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile={true}
        sx={{
          width: 1,
          zIndex: 9,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          [`& .${tabsClasses.flexContainer}`]: { justifyContent: 'center', px: 1 },
          [`& .${tabsClasses.scroller}`]: { display: 'flex' },
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

      {currentTab === 'metamask' && <FinanceWithdrawFromMetamask onClose={onClose} />}
      {currentTab === 'smartAccount' && <FinanceWithdrawFromSmartAccount onClose={onClose} />}
    </Dialog>
  );
};
