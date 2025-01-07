import React, { useState, useCallback, FC } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import DialogActions from '@mui/material/DialogActions';
import Dialog, { DialogProps } from '@mui/material/Dialog';
// hooks
import { useBoolean } from '@src/hooks/use-boolean';
// components
import { useSelector } from 'react-redux';
import NeonPaper from '@src/sections/publication/NeonPaperContainer.tsx';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import { InputAmount, InputAmountProps } from '@src/components/input-amount.tsx';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Iconify from '@src/components/iconify';
import Slider from '@mui/material/Slider';
import { Divider, useTheme } from '@mui/material';
import Scrollbar from '@src/components/scrollbar';
import FinanceWalletTransferWidgetHorizontal from '@src/sections/finance/components/finance-wallet-transfer-widget-horizontal.tsx';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type ButtonSwapProps = {
  icon: string;
  tooltip?: string;
  onClick?: VoidFunction;
  flipIcon?: boolean;
};

const ButtonSwap: FC<ButtonSwapProps> = ({ onClick, tooltip, icon, flipIcon }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        marginX: 'auto',
        width: 40,
        height: 40,
        borderRadius: '50%',
      }}
    >
      <Tooltip key={'some-key'} title={tooltip} arrow placement="top">
        <Stack direction="row" alignItems="center">
          <Iconify
            sx={{
              transform: {
                xs: flipIcon ? 'rotate(90deg)' : 'rotate(0deg)',
                sm: 'rotate(0deg)',
                lg: 'rotate(0deg)',
              },
            }}
            icon={icon}
            width={30}
            height={30}
          />
        </Stack>
      </Tooltip>
    </IconButton>
  );
};

// ----------------------------------------------------------------------
export default function FinanceTransferAccounts() {
  const sessionData = useSelector((state: any) => state.auth.session);

  const balanceETH = useSelector((state: any) => state.auth.balance);
  const watchitBalance = balanceETH + 1000; // Just for testing purposes

  const confirm = useBoolean();

  const [maxBalance, setMaxBalance] = useState<number>(balanceETH);
  const [fromWallet, setFromWallet] = useState(sessionData?.address);
  // @TODO: JACOB
  // @TODO: Review this default value
  const [toWallet, setToWallet] = useState('0x4B0897b0513fdc7C541B6d9D7E929C4e5364D2dB');
  const [labelFrom, setLabelFrom] = useState('From ETH Wallet');
  const [labelTo, setLabelTo] = useState('To Watchit Wallet');

  const handleTransferFinish = () => {
    confirm.onFalse?.();
  };

  const handleOpenModal = () => {
    confirm.onTrue?.();
  };

  const handleSwapWallets = () => {
    // Swap the wallets
    setFromWallet(toWallet);
    setToWallet(fromWallet);

    // Swap the labels
    setLabelFrom((prevLabel) =>
      prevLabel === 'From ETH Wallet' ? 'From Watchit Wallet' : 'From ETH Wallet'
    );
    setLabelTo((prevLabel) =>
      prevLabel === 'To Watchit Wallet' ? 'To ETH Wallet' : 'To Watchit Wallet'
    );

    // Swap the max balance
    setMaxBalance(() => (labelTo === 'To Watchit Wallet' ? watchitBalance : balanceETH));
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ButtonSwap
          flipIcon={true}
          icon={'tabler:transfer'}
          onClick={handleOpenModal}
          tooltip={'Transfer between your wallets'}
        />
      </Box>
      <ConfirmTransferDialog
        balanceETH={balanceETH}
        balanceWatchit={watchitBalance}
        max={maxBalance}
        open={confirm.value}
        onClose={handleTransferFinish}
        fromWallet={fromWallet}
        toWallet={toWallet}
        labelFrom={labelFrom}
        labelTo={labelTo}
        onSwapWallets={handleSwapWallets}
        amount={0}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type TConfirmTransferDialogProps = InputAmountProps & DialogProps;

interface ConfirmTransferDialogProps extends TConfirmTransferDialogProps {
  address?: string;
  onClose: VoidFunction;
  fromWallet: string;
  toWallet: string;
  labelFrom: string;
  labelTo: string;
  onSwapWallets: VoidFunction;
  balanceETH: number;
  balanceWatchit: number;
}

function ConfirmTransferDialog({
  open,
  onClose,
  fromWallet,
  toWallet,
  labelFrom,
  labelTo,
  max,
  onSwapWallets,
  balanceETH,
  balanceWatchit,
}: ConfirmTransferDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const handleConfirmTransfer = async () => {
    setLoading(true);
    setTimeout(() => {
      // Notification for the user from wallet to wallet
      enqueueSnackbar(
        `The transfer was successful ${labelFrom.toLowerCase()} to ${labelTo.toLowerCase()}`,
        { variant: 'success' }
      );
      onClose();
      setLoading(false);
    }, 2000);
  };

  const handleInputChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    // const value = event.target.value;
  };

  const handleChangeSlider = useCallback((_event: Event, newValue: number | number[]) => {
    setAmount(newValue as number);
  }, []);

  const handleChangeInput = useCallback((_event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(_event.target.value));
  }, []);

  const handleBlur = useCallback(() => {
    if (amount < 0) {
      setAmount(0);
    } else if (amount > max) {
      setAmount(max);
    }
  }, [amount]);

  const RainbowEffect = loading ? NeonPaper : Box;

  const renderFromWalletInput = (
    <Box sx={{ mb: 1 }}>
      <TextField
        fullWidth
        label={labelFrom}
        value={fromWallet}
        onChange={handleInputChange}
        disabled
      />
    </Box>
  );
  const renderToWalletInput = (
    <Box sx={{ my: 1 }}>
      <TextField fullWidth label={labelTo} value={toWallet} onChange={handleInputChange} disabled />
    </Box>
  );

  const theme = useTheme();

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Transfer between your wallets</DialogTitle>
      <Stack sx={{ px: 3 }}>
        <Card
          sx={{
            backgroundColor: theme.palette.background.neutral,
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 4 }}
            >
              <FinanceWalletTransferWidgetHorizontal
                title="ETH"
                value={balanceETH}
                icon="solar:wallet-2-bold-duotone"
                color={theme.palette.secondary.main}
              />

              <FinanceWalletTransferWidgetHorizontal
                title="Watchit"
                value={balanceWatchit}
                icon="solar:wallet-money-bold"
                color={theme.palette.warning.main}
              />
            </Stack>
          </Scrollbar>
        </Card>
      </Stack>

      <Stack direction="column" spacing={0} sx={{ px: 3 }}>
        {renderFromWalletInput}
        <ButtonSwap
          icon={'tabler:transfer-vertical'}
          tooltip={'Interchange wallets'}
          onClick={onSwapWallets}
        />
        {renderToWalletInput}

        <Stack direction={'column'} sx={{ py: 1, flexGrow: 1 }}>
          <InputAmount max={max} amount={amount} onBlur={handleBlur} onChange={handleChangeInput} />
        </Stack>

        <Stack direction={'column'} spacing={0} sx={{ py: 1, flexGrow: 1 }}>
          <Slider
            color={'secondary'}
            value={typeof amount === 'number' ? amount : 0}
            valueLabelDisplay="auto"
            step={50}
            marks
            min={10}
            max={max}
            onChange={handleChangeSlider}
          />
        </Stack>
      </Stack>

      <DialogActions>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
            Max: {max} MMC
          </Typography>
        </Box>
        <Button onClick={onClose}>Cancel</Button>

        <RainbowEffect borderRadius={'10px'} animationSpeed={'3s'} padding={'0'} width={'auto'}>
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: '#fff' }}
            onClick={handleConfirmTransfer}
            disabled={loading}
            loading={loading}
          >
            Confirm & Transfer
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </Dialog>
  );
}
