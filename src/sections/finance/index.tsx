import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

//
import FinanceContacts from '@src/sections/finance/components/finance-contacts.tsx';
import FinanceQuickTransfer from '@src/sections/finance/components/finance-quick-transfer.tsx';
import FinanceInviteFriends from '@src/sections/finance/components/finance-invite-friends.tsx';
import FinanceWidgetSummary from '@src/sections/finance/components/finance-widget-summary.tsx';
import FinanceBalanceStatistics from '@src/sections/finance/components/finance-balance-statistics.tsx';

import {useSelector} from "react-redux";
import {useProfileFollowing} from "@lens-protocol/react";
import FinanceTransferAccounts from "@src/sections/finance/components/finance-transfer-accounts.tsx";
import {TableRowTransactionType, useTransactionData} from "@src/hooks/use-transaction-data";
import {
  groupedTransactionData,
  processDayData,
  processTransactionData
} from "@src/utils/finance-graphs/groupedTransactions.ts";
import FinanceTransactionsHistory from "@src/sections/finance/components/finance-transactions-history.tsx";
import Typography from "@mui/material/Typography";
import FinanceQuickActions from "@src/sections/finance/components/finance-quick-actions.tsx";

// ----------------------------------------------------------------------

export default function OverviewBankingView() {

  const { balance: balanceFromRedux } = useSelector((state: any) => state.auth);
  const sessionData = useSelector((state: any) => state.auth.session);

  const { data: following } = useProfileFollowing({
    // @ts-ignore
    for: sessionData?.profile?.id,
  });

  const {data: transactionsData, rawData: transactionsRawData} = useTransactionData()

  // remove the last element as it is the current day
  const processedData = groupedTransactionData(transactionsData);
  const dataForBalanceStatistics = processedData.slice(0, -1);
  const daySeriesData = processDayData(processedData);
  // Get the difference between daySeriesData[1] and daySeriesData[0] in y value to calculate the percent
  const percent = (daySeriesData[1]?.y - daySeriesData[0]?.y) / daySeriesData[0]?.y * 100;

  const processedTransactions: TableRowTransactionType[] = processTransactionData(transactionsRawData);

  const externalWalletConnected = false;

  return (
    <Container
      sx={{
        marginTop: '2rem',
        marginBottom: '2rem',
        maxWidth: '100% !important',
      }}
    >
     <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <FinanceWidgetSummary
              title="Balance"
              color="primary"
              icon={percent > 0 ? 'eva:diagonal-arrow-right-up-fill' : 'eva:diagonal-arrow-left-down-fill'}
              percent={percent}
              total={balanceFromRedux}
              chart={{
                series: daySeriesData,
              }}
            />

            {/*<FinanceTransferAccounts />*/}

            <FinanceQuickActions
              connectedWalllet={externalWalletConnected}
              title={externalWalletConnected ? 'Balance\'s Vault Metamask.' : 'Connect external wallet'}
              info={externalWalletConnected ? 'Metamask connected. If you wish to change, click below button.' : 'You can connect Metamask wallet to view your vault balance'}
              balance={balanceFromRedux + 1000}
            />
          </Stack>

          <Grid xs={12} md={8}>
            <Stack spacing={3}>
              <FinanceBalanceStatistics
                title="Balance Statistics"
                subheader="(+43% Income | +12% Expense) than last year"
                chart={{
                  series: dataForBalanceStatistics,
                }}
              />
            </Stack>
          </Grid>

            <Typography variant="h6" sx={{ p: 2 }}>
              Recent Transactions
            </Typography>
            <FinanceTransactionsHistory transactionsData={processedTransactions} />

        </Grid>



        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <FinanceQuickTransfer title="Quick transfer" list={following} />

            {following?.length ? (
              <FinanceContacts
                title="Contacts"
                subheader={`You have ${following?.length ?? 0} contacts`}
                list={following ?? []}
              />
            ) : undefined}

            <FinanceInviteFriends
              price="50"
              title={`Invite friends \n and earn`}
              description="Invite your friends to join our platform and earn MMC 50 for each successful referral."
              img="/assets/illustrations/characters/character_11.png"
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
