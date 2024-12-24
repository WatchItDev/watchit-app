import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// _mock
import { _bankingRecentTransitions } from '@src/_mock';

//
import FinanceContacts from '@src/sections/finance/components/finance-contacts.tsx';
import FinanceQuickTransfer from '@src/sections/finance/components/finance-quick-transfer.tsx';
import FinanceInviteFriends from '@src/sections/finance/components/finance-invite-friends.tsx';
import FinanceWidgetSummary from '@src/sections/finance/components/finance-widget-summary.tsx';
import FinanceBalanceStatistics from '@src/sections/finance/components/finance-balance-statistics.tsx';
import FinanceRecentTransitions from '@src/sections/finance/components/finance-recent-transitions.tsx';
import {useSelector} from "react-redux";
import {useProfileFollowing} from "@lens-protocol/react";
import FinanceTransferAccounts from "@src/sections/finance/components/finance-transfer-accounts.tsx";

// ----------------------------------------------------------------------

export default function OverviewBankingView() {

  const { balance: balanceFromRedux } = useSelector((state: any) => state.auth);
  const sessionData = useSelector((state: any) => state.auth.session);

  const { data: following } = useProfileFollowing({
    // @ts-ignore
    for: sessionData?.profile?.id,
  });

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
              title="Main Balance"
              icon="eva:diagonal-arrow-left-down-fill"
              percent={2.6}
              total={balanceFromRedux}
              chart={{
                series: [
                  { x: 2010, y: 88 },
                  { x: 2011, y: 120 },
                  { x: 2012, y: 156 },
                  { x: 2013, y: 123 },
                  { x: 2014, y: 88 },
                  { x: 2015, y: 66 },
                  { x: 2016, y: 45 },
                  { x: 2017, y: 29 },
                  { x: 2018, y: 45 },
                  { x: 2019, y: 88 },
                  { x: 2020, y: 132 },
                  { x: 2021, y: 146 },
                  { x: 2022, y: 169 },
                  { x: 2023, y: 184 },
                ],
              }}
            />

            <FinanceTransferAccounts />

            <FinanceWidgetSummary
              title="Pool Balance"
              color="warning"
              icon="eva:diagonal-arrow-right-up-fill"
              percent={-0.5}
              total={balanceFromRedux}
              chart={{
                series: [
                  { x: 2010, y: 88 },
                  { x: 2011, y: 120 },
                  { x: 2012, y: 156 },
                  { x: 2013, y: 123 },
                  { x: 2014, y: 88 },
                  { x: 2015, y: 166 },
                  { x: 2016, y: 145 },
                  { x: 2017, y: 129 },
                  { x: 2018, y: 145 },
                  { x: 2019, y: 188 },
                  { x: 2020, y: 132 },
                  { x: 2021, y: 146 },
                  { x: 2022, y: 169 },
                  { x: 2023, y: 184 },
                ],
              }}
            />
          </Stack>

          <Grid xs={12} md={8}>
            <Stack spacing={3}>
              <FinanceBalanceStatistics
                title="Balance Statistics"
                subheader="(+43% Income | +12% Expense) than last year"
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                  series: [
                    {
                      type: 'Week',
                      data: [
                        {
                          name: 'Income',
                          data: [10, 41, 35, 151, 49, 62, 69, 91, 48],
                        },
                        {
                          name: 'Expenses',
                          data: [10, 34, 13, 56, 77, 88, 99, 77, 45],
                        },
                      ],
                    },
                    {
                      type: 'Month',
                      data: [
                        {
                          name: 'Income',
                          data: [148, 91, 69, 62, 49, 51, 35, 41, 10],
                        },
                        {
                          name: 'Expenses',
                          data: [45, 77, 99, 88, 77, 56, 13, 34, 10],
                        },
                      ],
                    },
                    {
                      type: 'Year',
                      data: [
                        {
                          name: 'Income',
                          data: [76, 42, 29, 41, 27, 138, 117, 86, 63],
                        },
                        {
                          name: 'Expenses',
                          data: [80, 55, 34, 114, 80, 130, 15, 28, 55],
                        },
                      ],
                    },
                  ],
                }}
              />


              <FinanceRecentTransitions
                title="Recent Transitions"
                tableData={_bankingRecentTransitions}
                tableLabels={[
                  { id: 'description', label: 'Description' },
                  { id: 'date', label: 'Date' },
                  { id: 'amount', label: 'Amount' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
            </Stack>
          </Grid>

        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <FinanceQuickTransfer title="Quick transfer" list={following} />

            {following?.length ? (
              <FinanceContacts
                title="Contacts"
                subheader={`You have ${following?.length ?? 0} contacts`}
                list={following?.slice?.(-5) ?? []}
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
