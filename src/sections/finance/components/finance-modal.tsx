import { FC, useState, ReactNode } from 'react';

// MUI IMPORTS
import Tab from '@mui/material/Tab';
import DialogTitle from '@mui/material/DialogTitle';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Dialog, { DialogProps } from '@mui/material/Dialog';

interface TabConfig {
  value: string;
  label: string;
  disabled?: boolean;
  icon: any;
}

interface FinanceModalProps extends DialogProps {
  onClose: VoidFunction;
  title: string;
  tabs: TabConfig[];
  renderContent: (currentTab: string) => ReactNode;
}

const FinanceModal: FC<FinanceModalProps> = ({ open, onClose, title, tabs, renderContent, ...dialogProps }) => {
  const [currentTab, setCurrentTab] = useState('smartAccount');

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose} {...dialogProps}>
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>

      <Tabs
        key={`tabs-${title.toLowerCase()}`}
        value={currentTab}
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChangeTab}
        allowScrollButtonsMobile
        sx={{
          width: 1,
          zIndex: 9,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          [`& .${tabsClasses.flexContainer}`]: { justifyContent: 'center', px: 1 },
          [`& .${tabsClasses.scroller}`]: { display: 'flex', justifyContent: 'center' },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            icon={tab.icon}
            disabled={tab.disabled}
            key={tab.value}
            value={tab.value}
            label={tab.label}
          />
        ))}
      </Tabs>

      {renderContent(currentTab)}
    </Dialog>
  );
};

export default FinanceModal;
