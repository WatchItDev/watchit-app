import { useState } from "react";
// MUI components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";

import {Accumulator, CampaignStatusTypes, StrategyType } from "@src/types/marketing";
import Label from "@src/components/label";
import {generateRandomData} from "@src/sections/marketing/fakeData.ts";
import StrategyList from "@src/sections/marketing/components/StrategyList.tsx";
import StrategyCreate from "@src/sections/marketing/components/StrategyCreate.tsx";

const TABS = [
  { value: 'all', label: 'All' },
  ...CampaignStatusTypes
];

const fakeData = generateRandomData(20);

const counts = fakeData.reduce<Accumulator>((acc, item: StrategyType) => {
  if (!acc[item.status]) {
    acc[item.status] = 0;
  }
  acc[item.status] += 1;
  return acc;
}, {});

const totalItems = fakeData.length;

const tabsWithCounts = TABS.map((tab) => ({
  ...tab,
  key: tab.value,
  count: tab.value === 'all' ? totalItems : counts[tab.value] ?? 0,
}));

const MarketingView = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const handleChangeTab = (_event: any, newValue: any) => {
    setCurrentTab(newValue);
  };

  const filteredData = currentTab === 'all' ? fakeData : fakeData.filter(item => item.status === currentTab);

  return (
    <Container
      sx={{
        marginTop: { xs: '1rem', md: '2rem' },
        marginBottom: '2rem',
        maxWidth: '100% !important',
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              px: 2.5,
            }}
          >
            {
              tabsWithCounts.map((tab) => (
                <Tab
                  key={tab.value}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={<Label variant={'filled'} color={
                    (tab.value === 'all' && 'default') ||
                    (tab.value === 'active' && 'success') ||
                    (tab.value === 'paused' && 'warning') ||
                    'default'
                  } >{tab.count}</Label>}
                />))
            }
          </Tabs>
        </Grid>
        <Grid item>
          <StrategyCreate />
        </Grid>
      </Grid>

      <StrategyList data={filteredData} />
    </Container>
  )
}

export default MarketingView;
