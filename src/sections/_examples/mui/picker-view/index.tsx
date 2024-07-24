import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PickerDate from './picker-date';
import PickerTime from './picker-time';
import PickerDateTime from './picker-date-time';
import PickerDateRange from './picker-date-range';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'date', label: 'Date', component: <PickerDate /> },
  { value: 'datetime', label: 'DateTime', component: <PickerDateTime /> },
  { value: 'time', label: 'Time', component: <PickerTime /> },
  { value: 'range', label: 'Range', component: <PickerDateRange /> },
];

// ----------------------------------------------------------------------

export default function PickerView() {
  const [currentTab, setCurrentTab] = useState('date');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Date / Time pickers"
            links={[
              { name: 'Components', href: paths.components },
              { name: 'Date / Time pickers' },
            ]}
            moreLink={[
              'https://mui.com/components/pickers',
              'https://mui.com/x/react-date-pickers/getting-started/',
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Tabs value={currentTab} onChange={handleChangeTab}>
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}
