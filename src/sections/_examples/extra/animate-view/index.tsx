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
import Inview from './inview';
import OtherView from './other';
import ScrollView from './scroll';
import DialogView from './dialog';
import BackgroundView from './background';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'inview', label: 'In View', component: <Inview /> },
  { value: 'scroll', label: 'Scroll', component: <ScrollView /> },
  { value: 'dialog', label: 'Dialog', component: <DialogView /> },
  { value: 'background', label: 'Background', component: <BackgroundView /> },
  { value: 'other', label: 'Other', component: <OtherView /> },
];

// ----------------------------------------------------------------------

export default function AnimateView() {
  const [currentTab, setCurrentTab] = useState('inview');

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
            heading="Animate"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Animate' },
            ]}
            moreLink={['https://www.framer.com/api/motion']}
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
