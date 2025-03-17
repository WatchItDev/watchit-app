// REACT IMPORTS
import { useEffect, useState } from 'react';

// MUI IMPORTS
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

//REDUX IMPORTS
import { useSelector } from 'react-redux';

// LENS IMPORTS
import { useProfileFollowing } from '@lens-protocol/react';

// LOCAL IMPORTS
import useGetSmartWalletTransactions from '@src/hooks/protocol/use-get-smart-wallet-transactions.ts';
import { groupTransactionsForWidget } from '@src/utils/finance-graphs/groupedTransactions.ts';
import {filterHiddenProfiles} from "@src/utils/profile.ts";
import { SummaryAndActions } from '@src/sections/finance/components/finance-summary-and-actions.tsx';
import { FinanceLeftColumnContent } from '@src/sections/finance/components/finance-left-column-content.tsx';
import { FinanceRightColumnContent } from '@src/sections/finance/components/finance-right-column-content.tsx';

// ----------------------------------------------------------------------

export default function FinanceView() {
  const { balance: balanceFromRedux } = useSelector((state: any) => state.auth);
  const sessionData = useSelector((state: any) => state.auth.session);
  const { transactions, loading } = useGetSmartWalletTransactions();
  const [widgetSeriesData, setWidgetSeriesData] = useState<{ x: string; y: number }[]>([]);
  const [percent, setPercent] = useState(0);
  const { data: results, loading: loadingProfiles } = useProfileFollowing({
    for: sessionData?.profile?.id,
  });

  // Filter hidden profiles
  const following = filterHiddenProfiles(results);

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
            loadingProfiles={loadingProfiles}
          />

          <FinanceLeftColumnContent following={following}/>
        </Grid>

        <Grid xs={12} md={4}>
          <FinanceRightColumnContent following={following} loadingProfiles={loadingProfiles} />
        </Grid>
      </Grid>
    </Container>
  );
}
