import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// _mock
import { _bankingRecentTransitions } from '@src/_mock';
// components
import { useSettingsContext } from '@src/components/settings';
//
import BankingContacts from '@src/sections/finance/components/banking-contacts';
import BankingQuickTransfer from '@src/sections/finance/components/banking-quick-transfer';
import BankingInviteFriends from '@src/sections/finance/components/banking-invite-friends';
import BankingWidgetSummary from '@src/sections/finance/components/banking-widget-summary';
import BankingBalanceStatistics from '@src/sections/finance/components/banking-balance-statistics';
import BankingRecentTransitions from '@src/sections/finance/components/banking-recent-transitions';
import {useSelector} from "react-redux";
import {useProfileFollowing} from "@lens-protocol/react";

// ----------------------------------------------------------------------

export default function OverviewBankingView() {

  const settings = useSettingsContext();

  const { balance: balanceFromRedux } = useSelector((state: any) => state.auth);
  const sessionData = useSelector((state: any) => state.auth.session);

  const { data: following } = useProfileFollowing({
    // @ts-ignore
    for: sessionData?.profile?.id,
  });

  return (
    <Container sx={{
      marginTop: '2rem',
      marginBottom: '2rem',
    }} maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <BankingWidgetSummary
              title="Main Wallet"
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

            <BankingWidgetSummary
              title="Pool Wallet"
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
              <BankingBalanceStatistics
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


              <BankingRecentTransitions
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
            <BankingQuickTransfer title="Quick transfer" list={following} />

            <BankingContacts
              title="Contacts"
              subheader={`You have ${following?.length ?? 0} contacts`}
              list={following?.slice?.(-5) ?? []}
            />

            <BankingInviteFriends
              price="MMC 50"
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
