import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import FinanceContacts from '@src/sections/finance/components/finance-contacts.tsx';
import FinanceQuickTransfer from '@src/sections/finance/components/finance-quick-transfer.tsx';
import FinanceInviteFriends from '@src/sections/finance/components/finance-invite-friends.tsx';
import FinanceWidgetSummary from '@src/sections/finance/components/finance-widget-summary.tsx';
import FinanceBalanceStatistics from '@src/sections/finance/components/finance-balance-statistics.tsx';
import { useSelector } from 'react-redux';
import { useProfileFollowing } from '@lens-protocol/react';
import Typography from '@mui/material/Typography';
import FinanceTransactionsHistory from '@src/sections/finance/components/finance-transactions-history.tsx';
import useGetSmartWalletTransactions from '@src/hooks/use-get-smart-wallet-transactions.ts';
import { useEffect, useState } from 'react';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Iconify from '@src/components/iconify';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import FinanceEarnTokens from '@src/sections/finance/components/finance-earn-tokens.tsx';

// ----------------------------------------------------------------------

export default function OverviewBankingView() {
  const lgUp = useResponsive('up', 'lg');
  const mdUp = useResponsive('up', 'md');
  const { balance: balanceFromRedux } = useSelector((state: any) => state.auth);
  const sessionData = useSelector((state: any) => state.auth.session);
  const { transactions, loading } = useGetSmartWalletTransactions();
  const [widgetSeriesData, setWidgetSeriesData] = useState<{ x: string; y: number }[]>([]);
  const [percent, setPercent] = useState(0);
  const { data: following } = useProfileFollowing({
    // @ts-ignore
    for: sessionData?.profile?.id,
  });

  useEffect(() => {
    if (!transactions || loading) return;

    const { daySeriesData, calculatedPercent } = groupTransactionsForWidget(transactions);

    setWidgetSeriesData(daySeriesData);
    setPercent(calculatedPercent);
  }, [transactions, loading]);



  return (
    <Container
      sx={{
        marginTop: { xs: '1rem', md: '2rem' },
        marginBottom: '2rem',
        maxWidth: '100% !important',
      }}
    >
      <Grid container spacing={2}>
        <Grid xs={12} md={8}>
          <Stack
            direction={{ lg: 'column', xlg: 'row' }}
            spacing={{
              xs: 2,
              lg: 2,
            }}
          >
            <FinanceWidgetSummary
              title="Balance"
              color="primary"
              icon={
                percent > 0
                  ? 'eva:diagonal-arrow-right-up-fill'
                  : 'eva:diagonal-arrow-left-down-fill'
              }
              percent={percent}
              total={balanceFromRedux}
              chart={{
                series: widgetSeriesData,
              }}
            />

            {!mdUp ? <FinanceQuickTransfer list={following} /> : null}
            {lgUp ? <FinanceEarnTokens lgUp={lgUp} /> : null}
          </Stack>

          {following?.length && !lgUp ? (
            <FinanceContacts
              title="Contacts"
              chunkSize={2}
              subheader={`You have ${following?.length ?? 0} contacts`}
              list={following ?? []}
            />
          ) : undefined}

          {lgUp ? (
            <>
              <Grid xs={12}>
                <Stack spacing={3}>
                  <FinanceBalanceStatistics />
                </Stack>
              </Grid>

              <Typography variant="h6" sx={{ pt: 2 }}>
                Recent Transactions
              </Typography>
              <FinanceTransactionsHistory />
            </>
          ) : (
            <TabsComponent />
          )}
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={2}>
            <FinanceQuickTransfer
              list={following}
              sx={{
                display: { xs: 'none', md: 'flex' },
              }}
            />

            {following?.length && lgUp ? (
              <FinanceContacts
                title="Contacts"
                chunkSize={2}
                subheader={`You have ${following?.length ?? 0} contacts`}
                list={following ?? []}
              />
            ) : undefined}

            {!lgUp ? <FinanceEarnTokens lgUp={lgUp} /> : null}

            <FinanceInviteFriends
              price="50"
              title={`Refer and Earn!`}
              description="Get 50 MMC for every friend who signs up using your referral link."
              img="/assets/illustrations/characters/character_11.png"
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

export function groupTransactionsForWidget(transactions: any[]) {
  if (!transactions?.length) {
    return { daySeriesData: [], calculatedPercent: 0 };
  }

  let grouped: Record<string, number> = {};

  transactions.forEach((tx) => {
    const timestamp = Number(tx.timestamp) * 1000;
    const dateKey = new Date(timestamp).toISOString().slice(0, 10);
    const amount = parseFloat(tx.formattedAmount);
    const eventType = tx.event;

    if (!grouped[dateKey]) grouped[dateKey] = 0;

    if (eventType === 'deposit' || eventType === 'transferTo') {
      grouped[dateKey] += amount;
    } else if (eventType === 'withdraw' || eventType === 'transferFrom') {
      grouped[dateKey] -= amount;
    }
  });

  const daySeriesData = Object.keys(grouped)
    .sort()
    .map((day) => ({
      x: day,
      y: grouped[day],
    }));

  let calculatedPercent = 0;
  if (daySeriesData.length > 1) {
    const first = daySeriesData[0].y;
    const second = daySeriesData[1].y;
    calculatedPercent = ((second - first) / Math.abs(first)) * 100;
  }

  return { daySeriesData, calculatedPercent };
}

const TabsComponent = () => {
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
        <>
          <Grid xs={12} md={8}>
            <Stack spacing={3}>
              <FinanceBalanceStatistics />
            </Stack>
          </Grid>
        </>
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
