import { useState, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import Dialog, { DialogProps } from '@mui/material/Dialog';
// hooks
import { useSelector} from "react-redux";
import {truncateAddress} from "@src/utils/wallet.ts";
import {Profile} from "@lens-protocol/api-bindings";
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";
import LoadingButton from "@mui/lab/LoadingButton";
import { supabase } from '@src/utils/supabase';
import {useNotificationPayload} from "@src/hooks/use-notification-payload.ts";
import {useNotifications} from "@src/hooks/use-notifications.ts";
import {useSnackbar} from "notistack";
import { InputAmountProps } from '@src/components/input-amount.tsx';

import { useTransfer } from '@src/hooks/use-transfer.ts';
type TConfirmTransferDialogProps = InputAmountProps & DialogProps;

interface ConfirmTransferDialogProps extends TConfirmTransferDialogProps {
  contactInfo?: Profile;
  address?: string;
  onClose: VoidFunction;
  amount: number
}

function FinanceQuickTransferModal({
  open,
  amount,
  contactInfo,
  onClose,
  address
}: ConfirmTransferDialogProps) {
  const sessionData = useSelector((state: any) => state.auth.session);
  const { generatePayload } = useNotificationPayload(sessionData);
  const { sendNotification } = useNotifications();
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState('');
  const isSame = contactInfo?.ownedBy?.address === address;
  const defaultImage = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${address}`;
  const defaultName = 'Destination wallet';
  const { transfer, loading: transferLoading, error } = useTransfer();

  useEffect(() => {
    if (error) enqueueSnackbar(error.message, { variant: 'error' });
  }, [error]);

  async function storeTransactionInSupabase(receiver_id?: string, sender_id?: string, payload?: any) {
    const { error } = await supabase
      .from('transactions')
      .insert([{ receiver_id, sender_id, payload }]);

    if (error) {
      console.error('Error storing transaction:', error);
    } else {
      console.log('Transaction stored successfully');
    }
  }

  const handleConfirmTransfer = async () => {
    await transfer({ amount, recipient: address ?? '' });

    const senderId = sessionData?.profile?.id ?? address;
    const notificationPayload = generatePayload('TRANSFER', {
      id: isSame ? (contactInfo?.id ?? '') : (address ?? ''),
      displayName: isSame ? (contactInfo?.metadata?.displayName ?? 'no name') : 'External wallet',
      avatar: (contactInfo?.metadata?.picture as any)?.optimized?.uri ?? '',
    }, {
      rawDescription: `${sessionData?.profile?.metadata?.displayName ?? address} sent you ${amount} MMC`,
      message,
    });

    await storeTransactionInSupabase(contactInfo?.id ?? address, senderId, {
      address: contactInfo?.ownedBy?.address ?? address,
      amount,
      message,
      ...notificationPayload,
    });

    await sendNotification(contactInfo?.id ?? address ?? '', sessionData?.profile?.id, notificationPayload);

    enqueueSnackbar('The transfer has been sent to ' + (isSame ? contactInfo?.metadata?.displayName : truncateAddress(address ?? '')) , { variant: 'success' })

    onClose();
  };

  const RainbowEffect = transferLoading ? NeonPaper : Box;
  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Transfer to</DialogTitle>
      <Stack direction="column" spacing={3} sx={{ px: 3 }}>
        <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
            <Avatar
             src={isSame ? (contactInfo?.metadata?.picture as any)?.optimized?.uri ?? defaultImage : defaultImage}
             sx={{ width: 48, height: 48 }} />

            <ListItemText
              primary={isSame ? contactInfo?.metadata?.displayName ?? defaultName : defaultName}
              secondary={truncateAddress(address ?? '')}
              secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
            />
          </Stack>

          <Stack direction={'column'} spacing={0} sx={{ py: 2, flexGrow: 1 }}>
            <ListItemText
              primary={'Amount:'}
              secondary={`${amount} MMC`}
              secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
            />
          </Stack>
        </Stack>
        <TextField
          onChange={(e) => setMessage(e.target.value)}
          fullWidth multiline rows={3} placeholder="Write a message..." />
      </Stack>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <RainbowEffect borderRadius={'10px'} animationSpeed={'3s'} padding={'0'} width={'auto'} >
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: '#fff' }}
            onClick={handleConfirmTransfer}
            disabled={transferLoading}
            loading={transferLoading}
          >
            Confirm & Transfer
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </Dialog>
  );
}

export default FinanceQuickTransferModal;
