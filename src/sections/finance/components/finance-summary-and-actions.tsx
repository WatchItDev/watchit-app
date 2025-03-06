import React from 'react';
import Stack from '@mui/material/Stack';
import FinanceWidgetSummary from '@src/sections/finance/components/finance-widget-summary';
import FinanceQuickTransfer from '@src/sections/finance/components/finance-quick-transfer';
import FinanceEarnTokens from '@src/sections/finance/components/finance-earn-tokens';
import { SummaryAndActionsProps } from '@src/sections/finance/types.ts';
import { useResponsive } from '@src/hooks/use-responsive.ts';

export const SummaryAndActions: React.FC<SummaryAndActionsProps> = (props) => {
  const {
    percent,
    widgetSeriesData,
    balanceFromRedux,
    following,
    loadingProfiles,
  } = props;
  const lgUp = useResponsive('up', 'lg');
  const mdUp = useResponsive('up', 'md');

  return (
    <Stack direction={{ lg: 'column', xlg: 'row' }} spacing={{ xs: 2, lg: 2 }}>
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
        chart={{ series: widgetSeriesData }}
      />
      {!mdUp && <FinanceQuickTransfer list={following} loading={loadingProfiles} />}
      {lgUp && <FinanceEarnTokens lgUp={lgUp} />}
    </Stack>
  );
};
