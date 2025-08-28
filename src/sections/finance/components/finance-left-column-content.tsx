import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FinanceContacts from '@src/sections/finance/components/finance-contacts';
import FinanceBalanceStatistics from '@src/sections/finance/components/finance-balance-statistics';
import FinanceTransactionsHistory from '@src/sections/finance/components/finance-transactions-history';
import { FinanceTabs } from '@src/sections/finance/components/finance-tabs';
import { LeftColumnContentProps } from '@src/sections/finance/types.ts';
import { useResponsive } from '@src/hooks/use-responsive.ts';

export const FinanceLeftColumnContent: React.FC<LeftColumnContentProps> = (
  props,
) => {
  const { following } = props;
  const lgUp = useResponsive('up', 'lg');

  return (
    <>
      {/* On smaller screens show contacts */}
      {!lgUp && following?.length ? (
        <FinanceContacts
          title="Contacts"
          chunkSize={2}
          subheader={`You have ${following.length ?? 0} contacts`}
          list={following ?? []}
        />
      ) : null}
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
        <FinanceTabs />
      )}
    </>
  );
};
