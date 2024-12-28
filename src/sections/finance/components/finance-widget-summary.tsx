import { ApexOptions } from 'apexcharts';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// utils
import { fCurrency, fPercent } from '@src/utils/format-number';
// theme
import { ColorSchema } from '@src/theme/palette';
import { bgGradient } from '@src/theme/css';
// components
import Iconify from '@src/components/iconify';
import Chart, { useChart } from '@src/components/chart';
import Button from "@mui/material/Button";
import {useBoolean} from "@src/hooks/use-boolean.ts";
import Dialog, {DialogProps} from "@mui/material/Dialog";
import {useSnackbar} from "notistack";
import {useState} from "react";
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";

import DialogTitle from "@mui/material/DialogTitle";

import DialogActions from "@mui/material/DialogActions";
import LoadingButton from "@mui/lab/LoadingButton";
import Tabs, {tabsClasses} from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FinanceDepositFromStripe from "@src/sections/finance/components/finance-deposit-from-stripe.tsx";
import FinanceDepositFromMetamask from "@src/sections/finance/components/finance-deposit-from-metamask.tsx";
import FinanceDepositFromSmartAccount from "@src/sections/finance/components/finance-deposit-from-smart-account.tsx";
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

export default function FinanceWidgetSummary({
  title,
  total,
  icon,
  percent,
  color = 'primary',
  chart,
  sx,
  ...other
}: Props) {
  const confirmDeposit = useBoolean();

  //const confirmWithdraw = useBoolean();

  const theme = useTheme();

  const { series, options } = chart;

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
  }

  const handleDepositOpenModal = () => {
    confirmDeposit.onTrue?.();
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
          justifyContent: 'flex-end'
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

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:diagonal-arrow-right-up-fill" />}
        >
          Withdraw
        </Button>
        </Box>

      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography variant="subtitle2">{title}</Typography>
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="flex-start"
        >
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

          <Box sx={{ opacity: 0.8 }}>than last month</Box>
        </Stack>
      </Stack>

      <Chart type="area" series={[{ data: series }]} options={chartOptions} height={120} />

      <ConfirmTransferDialog
        open={confirmDeposit.value}
        onClose={handleFinishDeposit}
      />

    </Stack>
  )
}


interface ConfirmTransferDialogProps extends DialogProps {
  onClose: VoidFunction;
}

const TABS = [
  { value: 'fiat', label: 'Stripe', disabled: true },
  { value: 'metamask', label: 'Metamask', disabled: false },
  { value: 'smartAccount', label: 'Smart Account', disabled: false },
];

function ConfirmTransferDialog({
                                 open,
                                 onClose
                               }: ConfirmTransferDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [currentTab, setCurrentTab] = useState('metamask');

  const handleChangeTab = (_event: any, newValue: any) => {
    setCurrentTab(newValue);
  };


  const handleConfirmTransfer = async () => {
    setLoading(true);
    setTimeout(() => {
      // Notification for the user from wallet to wallet
      enqueueSnackbar(`The deposit was successful`, { variant: 'success' });
      onClose();
      setLoading(false);
    }, 2000);
  };

  const RainbowEffect = loading ? NeonPaper : Box;

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Deposit to your vault balance</DialogTitle>

      <Tabs
        key={`tabs-deposit`}
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          width: 1,
          zIndex: 9,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          [`& .${tabsClasses.flexContainer}`]: { justifyContent: 'center' },
        }}
      >
        {TABS.map((tab) => (
          <Tab
            disabled={tab.disabled}
            key={tab.value}
            value={tab.value}
            label={tab.label}
          />
        ))}
      </Tabs>


      {currentTab === 'fiat'  && (<FinanceDepositFromStripe />)}
      {currentTab === 'metamask' && (<FinanceDepositFromMetamask />)}
      {currentTab === 'smartAccount' && (<FinanceDepositFromSmartAccount />)}

     <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <RainbowEffect borderRadius={'10px'} animationSpeed={'3s'} padding={'0'} width={'auto'}>
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: '#fff' }}
            onClick={handleConfirmTransfer}
            disabled={loading}
            loading={loading}
          >
            Confirm & Deposit
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </Dialog>
  );
}
