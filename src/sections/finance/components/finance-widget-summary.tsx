import { useEffect } from 'react';
// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

// @mui
import LoadingButton from '@mui/lab/LoadingButton';
// CHARTS IMPORTS
import { ApexOptions } from 'apexcharts';

// LOCAL IMPORTS
import { bgGradient } from '@src/theme/css';
import Iconify from '@src/components/iconify';
import { ColorSchema } from '@src/theme/palette';
import { useBoolean } from '@src/hooks/use-boolean.ts';
import Chart, { useChart } from '@src/components/chart';
import { fCurrency, fPercent } from '@src/utils/format-number';
import { FinanceDepositModal } from '@src/sections/finance/components/finance-deposit-modal.tsx';
import { useWithdraw } from '@src/hooks/protocol/use-withdraw.ts';
import { FinanceWithdrawModal } from '@src/sections/finance/components/finance-withdraw-modal.tsx';

// Notifications
import { notifyError } from '@src/libs/notifications/internal-notifications';
import { ERRORS } from '@src/libs/notifications/errors';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  percent: number;
  color?: ColorSchema;
  icon: string;
  chart: {
    series: {
      x: string;
      y: number;
    }[];
    options?: ApexOptions;
  };
}

// ----------------------------------------------------------------------

export default function FinanceWidgetSummary({
  title,
  total,
  percent,
  color = 'primary',
  chart,
  sx,
  ...other
}: Props) {
  const confirmDeposit = useBoolean();
  const confirmWithdraw = useBoolean();
  const theme = useTheme();
  const { series, options } = chart;
  const { loading: withdrawLoading, error } = useWithdraw();

  useEffect(() => {
    if (error) notifyError(error as ERRORS);
  }, [error]);

  const chartOptions = useChart({
    colors: [theme.palette[color].dark],
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: series?.reduce((max, item) => Math.max(max, item.y) + 10, 0),
      labels: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      marker: {
        show: false,
      },
      y: {
        formatter: (value: number) => fCurrency(value),
        title: {
          formatter: () => '',
        },
      },
    },
    ...options,
  });

  const totalOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 };
  const formattedTotal = new Intl.NumberFormat('en-US', totalOptions).format(total);

  const handleFinishDeposit = () => {
    confirmDeposit.onFalse?.();
  };

  const handleFinishWithdraw = () => {
    confirmWithdraw.onFalse?.();
  };

  const handleDepositOpenModal = () => {
    confirmDeposit.onTrue?.();
  };

  const handleWithdrawOpenModal = () => {
    confirmWithdraw.onTrue?.();
  };

  return (
    <Stack
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.2),
        }),
        width: 1,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          p: 1.5,
          top: 12,
          right: 6,
          width: '100%',
          height: 48,
          position: 'absolute',
          color: `${color}.lighter`,
          gap: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={handleDepositOpenModal}
          variant="contained"
          color="warning"
          startIcon={<Iconify icon="eva:diagonal-arrow-left-down-fill" />}
        >
          Deposit
        </Button>

        <LoadingButton
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:diagonal-arrow-right-up-fill" />}
          loading={withdrawLoading}
          onClick={handleWithdrawOpenModal}
        >
          Withdraw
        </LoadingButton>
      </Box>

      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography variant="subtitle2">{title}</Typography>
        <Stack direction="row" alignItems="flex-end" justifyContent="flex-start">
          <Box sx={{ typography: 'h3' }}>{formattedTotal}</Box>
          <Box sx={{ typography: 'h6', opacity: 0.5, ml: 1, mb: 0.6 }}>MMC</Box>
        </Stack>

        <Stack
          spacing={0.5}
          direction="row"
          flexWrap="wrap"
          alignItems="center"
          sx={{ typography: 'body2' }}
        >
          <Iconify icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />

          <Box sx={{ typography: 'subtitle2' }}>
            {percent > 0 && '+'}
            {fPercent(percent)}
          </Box>

          <Box sx={{ opacity: 0.8 }}>compared to last month</Box>
        </Stack>
      </Stack>

      <Chart type="area" series={[{ data: series }]} options={chartOptions} height={120} />

      <FinanceDepositModal open={confirmDeposit.value} onClose={handleFinishDeposit} />

      <FinanceWithdrawModal open={confirmWithdraw.value} onClose={handleFinishWithdraw} />
    </Stack>
  );
}
