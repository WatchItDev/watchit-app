import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {Accumulator, CampaignStatusTypes, StrategyType } from "@src/types/marketing";
import { Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import Label from "@src/components/label";
import Button from "@mui/material/Button";
import Iconify from "@src/components/iconify";
import {generateRandomData} from "@src/sections/marketing/fakeData.ts";
import StrategyList from "@src/sections/marketing/components/StrategyList.tsx";

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

  const AddStrategyButton = () => {
    return (
      <Button startIcon={<Iconify icon={'typcn:plus'}/>} variant="contained" sx={{
        color: 'white',
        background: '#8E33FF'}}>New strategy</Button>
    )
  }

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
          <AddStrategyButton />
        </Grid>
      </Grid>

      <StrategyList data={filteredData} />
    </Container>
  )
}

export default MarketingView;
