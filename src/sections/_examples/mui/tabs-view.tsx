import { useState, useCallback } from 'react';
// @mui
import Masonry from '@mui/lab/Masonry';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'one',
    icon: <Iconify icon="solar:phone-bold" width={24} />,
    label: 'Item One',
  },
  {
    value: 'two',
    icon: <Iconify icon="solar:heart-bold" width={24} />,
    label: 'Item Two',
  },
  {
    value: 'three',
    icon: <Iconify icon="eva:headphones-fill" width={24} />,
    label: 'Item Three',
    disabled: true,
  },
  {
    value: 'four',
    icon: <Iconify icon="eva:headphones-fill" width={24} />,
    label: 'Item Four',
  },
  {
    value: 'five',
    icon: <Iconify icon="eva:headphones-fill" width={24} />,
    label: 'Item Five',
    disabled: true,
  },
  {
    value: 'six',
    icon: <Iconify icon="eva:headphones-fill" width={24} />,
    label: 'Item Six',
  },
  {
    value: 'seven',
    icon: <Iconify icon="eva:headphones-fill" width={24} />,
    label: 'Item Seven',
  },
];

// ----------------------------------------------------------------------

export default function TabsView() {
  const [currentTab, setCurrentTab] = useState('one');

  const [scrollableTab, setScrollableTab] = useState('one');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangeScrollableTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setScrollableTab(newValue);
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
            heading="Tabs"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Tabs' },
            ]}
            moreLink={['https://mui.com/components/tabs']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
          <ComponentBlock title="Text">
            <Stack spacing={2} sx={{ width: 1 }}>
              <Tabs value={currentTab} onChange={handleChangeTab}>
                {TABS.slice(0, 3).map((tab) => (
                  <Tab key={tab.value} value={tab.value} label={tab.label} />
                ))}
              </Tabs>

              {TABS.slice(0, 3).map(
                (tab) =>
                  tab.value === currentTab && (
                    <Box
                      key={tab.value}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.neutral',
                      }}
                    >
                      {tab.label}
                    </Box>
                  )
              )}
            </Stack>
          </ComponentBlock>

          <ComponentBlock title="Icon">
            <Tabs value={currentTab} onChange={handleChangeTab}>
              {TABS.slice(0, 3).map((tab) => (
                <Tab key={tab.value} icon={tab.icon} value={tab.value} />
              ))}
            </Tabs>
          </ComponentBlock>

          <ComponentBlock title="Top">
            <Tabs value={currentTab} onChange={handleChangeTab}>
              {TABS.slice(0, 3).map((tab) => (
                <Tab
                  iconPosition="top"
                  key={tab.value}
                  icon={tab.icon}
                  label={tab.label}
                  value={tab.value}
                  disabled={tab.disabled}
                />
              ))}
            </Tabs>
          </ComponentBlock>

          <ComponentBlock title="Bottom">
            <Tabs value={currentTab} onChange={handleChangeTab}>
              {TABS.slice(0, 3).map((tab) => (
                <Tab
                  iconPosition="bottom"
                  key={tab.value}
                  icon={tab.icon}
                  label={tab.label}
                  value={tab.value}
                  disabled={tab.disabled}
                />
              ))}
            </Tabs>
          </ComponentBlock>

          <ComponentBlock title="Start">
            <Tabs value={currentTab} onChange={handleChangeTab}>
              {TABS.slice(0, 3).map((tab) => (
                <Tab
                  key={tab.value}
                  icon={tab.icon}
                  label={tab.label}
                  value={tab.value}
                  disabled={tab.disabled}
                />
              ))}
            </Tabs>
          </ComponentBlock>

          <ComponentBlock title="End">
            <Tabs value={currentTab} onChange={handleChangeTab}>
              {TABS.slice(0, 3).map((tab) => (
                <Tab
                  iconPosition="end"
                  key={tab.value}
                  icon={tab.icon}
                  label={tab.label}
                  value={tab.value}
                  disabled={tab.disabled}
                />
              ))}
            </Tabs>
          </ComponentBlock>

          <ComponentBlock title="Scrollable">
            <Box
              sx={{
                flexGrow: 1,
                width: '100%',
                maxWidth: 320,
              }}
            >
              <Tabs value={scrollableTab} onChange={handleChangeScrollableTab}>
                {TABS.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
            </Box>
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
