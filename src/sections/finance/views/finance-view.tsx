// REACT IMPORTS
import { useEffect, useState } from 'react';

// MUI IMPORTS
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

// LOCAL IMPORTS
import useGetSmartWalletTransactions from '@src/hooks/protocol/use-get-smart-wallet-transactions.ts';
import { groupTransactionsForWidget } from '@src/libs/finance-graphs/groupedTransactions.ts';
import { SummaryAndActions } from '@src/sections/finance/components/finance-summary-and-actions.tsx';
import { FinanceLeftColumnContent } from '@src/sections/finance/components/finance-left-column-content.tsx';
import { FinanceRightColumnContent } from '@src/sections/finance/components/finance-right-column-content.tsx';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useGetUserFollowingLazyQuery } from '@src/graphql/generated/hooks.tsx';

// ----------------------------------------------------------------------

export default function FinanceView() {
  const [widgetSeriesData, setWidgetSeriesData] = useState<{ x: string; y: number }[]>([]);
  const [percent, setPercent] = useState(0);
  const { session: sessionData, balance: balanceFromRedux } = useAuth();
  const { transactions, loading } = useGetSmartWalletTransactions();
  const [loadFollowing, { data: profileFollowing, loading: profileFollowingLoading }] = useGetUserFollowingLazyQuery({ fetchPolicy: 'network-only' });
  const following = profileFollowing?.getUserFollowing;

  useEffect(() => {
    if (!sessionData?.user?.address) return;
    loadFollowing({variables: { address: sessionData?.user?.address, limit: 50 }});
  }, [sessionData?.user?.address]);

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
        maxWidth: '100vw !important',
      }}
    >
      <Grid container spacing={2}>
        <Grid xs={12} md={8}>
          <SummaryAndActions
            percent={percent}
            widgetSeriesData={widgetSeriesData}
            balanceFromRedux={balanceFromRedux}
            following={following}
            loadingProfiles={profileFollowingLoading}
          />

          <FinanceLeftColumnContent following={following}/>
        </Grid>

        <Grid xs={12} md={4}>
          <FinanceRightColumnContent following={following} loadingProfiles={profileFollowingLoading} />
        </Grid>
      </Grid>
    </Container>
  );
}
