// REACT IMPORTS
import { useState } from 'react';

// MUI IMPORTS
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// LOCAL IMPORTS
import Iconify from '@src/components/iconify';
import FinanceBalanceStatistics from '@src/sections/finance/components/finance-balance-statistics.tsx';
import FinanceTransactionsHistory from '@src/sections/finance/components/finance-transactions-history.tsx';

export const FinanceTabs = () => {
  const [currentTab, setCurrentTab] = useState('graph');

  const handleChangeTab = (_event: any, newValue: any) => {
    setCurrentTab(newValue);
  };

  const TABS = [
    { value: 'graph', label: 'Statistics', icon: <Iconify icon={'codicon:graph'} /> },
    { value: 'table', label: 'Transactions', icon: <Iconify icon={'majesticons:table'} /> },
  ];

  return (
    <>
      <Tabs
        key={`tabs-statistics`}
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mt: 2,
          width: 1,
          zIndex: 9,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          [`& .${tabsClasses.flexContainer}`]: { justifyContent: { xs: 'left', md: 'center' } },
        }}
      >
        {TABS.map((tab) => (
          <Tab icon={tab.icon} key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {currentTab === 'graph' && (
        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <FinanceBalanceStatistics />
          </Stack>
        </Grid>
      )}
      {currentTab === 'table' && (
        <>
          <Typography variant="h6" sx={{ pt: 2 }}>
            Recent Transactions{' '}
          </Typography>
          <FinanceTransactionsHistory />
        </>
      )}
    </>
  );
};
