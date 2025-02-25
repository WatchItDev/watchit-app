import React, {useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";

// MUI components
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemText from "@mui/material/ListItemText";
import DialogActions from "@mui/material/DialogActions";
import Dialog, {DialogProps} from "@mui/material/Dialog";
import {truncateAddress} from "@src/utils/wallet.ts";

// LENS
import {Profile} from "@lens-protocol/api-bindings";

// Project components
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";
import LoadingButton from "@mui/lab/LoadingButton";
import {supabase} from "@src/utils/supabase";
import {useNotificationPayload} from "@src/hooks/use-notification-payload.ts";
import {useNotifications} from "@src/hooks/use-notifications.ts";
import {InputAmount, InputAmountProps} from "@src/components/input-amount.tsx";
import {useTransfer} from "@src/hooks/use-transfer.ts";

// Notifications
import {notifyError, notifySuccess} from "@notifications/internal-notifications.ts";
import {SUCCESS} from "@notifications/success.ts";
import {ERRORS} from "@notifications/errors.ts";
import {dicebear} from "@src/utils/dicebear.ts";
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import {MAX_POOL} from "@src/sections/finance/components/finance-quick-transfer.tsx";
import {handleAmountConstraints} from "@src/utils/format-number.ts";
import {useTheme} from "@mui/material/styles";

type TConfirmTransferDialogProps = InputAmountProps & DialogProps;

interface ConfirmTransferDialogProps extends TConfirmTransferDialogProps {
  contactInfo?: Profile;
  address?: string;
  onClose: VoidFunction;
  onFinish: VoidFunction;
  amount: number;
}

function FinanceQuickTransferModal({
  open,
  amount,
  contactInfo,
  onClose,
  onFinish,
  address,
}: ConfirmTransferDialogProps) {
  const theme = useTheme();
  const sessionData = useSelector((state: any) => state.auth.session);
  const {generatePayload} = useNotificationPayload(sessionData);
  const {transfer, loading: transferLoading, error} = useTransfer();
  const {sendNotification} = useNotifications();
  const [message, setMessage] = useState("");

  // For the transfer button when using user input
  const MAX_AMOUNT = useSelector((state: any) => state.auth.balance);
  const [value, setValue] = useState(0);
  const [canContinue, setCanContinue] = useState(true);

  // Check if we have a valid profile
  const hasProfile = !!contactInfo;

  // Check if the passed address matches the profile's address
  const isSame =
    hasProfile && contactInfo?.ownedBy?.address?.toLowerCase() === address?.toLowerCase();

  // If no valid profile, show "Destination wallet", else use profile’s displayName
  const displayName = hasProfile
    ? contactInfo?.metadata?.displayName || contactInfo?.handle?.localName
    : "Destination wallet";

  // For the avatar, if no valid profile or if the address doesn't match, use a dicebear fallback
  const avatarSrc =
    hasProfile && isSame
      ? (contactInfo?.metadata?.picture as any)?.optimized?.uri || dicebear(contactInfo?.id)
      : dicebear(address as string);

  // For the secondary text under the name, if we have a valid profile that matches, use its address
  // otherwise show the typed address
  const secondaryText = hasProfile && isSame ? contactInfo?.ownedBy?.address : address;

  useEffect(() => {
    if (error) {
      notifyError(error as ERRORS);
    }
  }, [error]);

  async function storeTransactionInSupabase(
    receiver_id?: string,
    sender_id?: string,
    payload?: any,
  ) {
    const {error: supaError} = await supabase
      .from("transactions")
      .insert([{receiver_id, sender_id, payload}]);

    if (supaError) {
      console.error("Error storing transaction:", supaError);
    } else {
      console.log("Transaction stored successfully");
    }
  }

  // Define the transfer amount: if a positive 'amount' is passed, use it; otherwise, use the entered value
  const transferAmount = amount > 0 ? amount : value;
  // Validation: if 'amount' is passed, assume it's valid; otherwise, ensure that the value is greater than 0 and input validation (canContinue) passes.
  const isTransferValid = transferAmount > 0 && (amount > 0 || canContinue);

  const handleConfirmTransfer = async () => {
    try {
      await transfer({amount: transferAmount, recipient: address ?? ""});

      onFinish();

      const senderId = sessionData?.profile?.id ?? address;

      // Build the notification payload
      const notificationPayload = generatePayload(
        "TRANSFER",
        {
          id: isSame ? (contactInfo?.id ?? "") : (address ?? ""),
          displayName: isSame
            ? (contactInfo?.metadata?.displayName ?? "No name")
            : "External wallet",
          avatar: (contactInfo?.metadata?.picture as any)?.optimized?.uri ?? "",
        },
        {
          rawDescription: `${sessionData?.profile?.metadata?.displayName ?? address} sent you ${transferAmount} MMC`,
          message,
        },
      );

      // Store transaction in Supabase
      await storeTransactionInSupabase(contactInfo?.id ?? address, senderId, {
        address: contactInfo?.ownedBy?.address ?? address,
        amount: transferAmount,
        message,
        ...notificationPayload,
      });

      // Send notification to the Lens profile or address
      await sendNotification(
        contactInfo?.id ?? address ?? "",
        sessionData?.profile?.id,
        notificationPayload,
      );

      notifySuccess(SUCCESS.TRANSFER_CREATED_SUCCESSFULLY, {
        destination: isSame
          ? (contactInfo?.metadata?.displayName ?? contactInfo?.handle?.localName)
          : truncateAddress(address ?? ""),
      });
    } catch (err: any) {
      notifyError(ERRORS.TRANSFER_FAILED_ERROR);
    }
  };

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      handleAmountConstraints({value, MAX_AMOUNT, MAX_POOL, setAmount: setValue, setCanContinue});
    },
    [MAX_AMOUNT],
  );

  const handleBlur = useCallback(() => {
    handleAmountConstraints({value, MAX_AMOUNT, MAX_POOL, setAmount: setValue, setCanContinue});
  }, [value, MAX_AMOUNT]);

  const RainbowEffect = transferLoading ? NeonPaper : Box;

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle
        sx={{
          borderBottom: `dashed 1px ${theme.palette.divider}`,
          padding: "16px 24px",
          marginBottom: "8px",
        }}>
        Send to
      </DialogTitle>
      <Stack direction="column" spacing={3} sx={{px: 3}}>
        <Stack
          direction="row"
          spacing={3}
          sx={{flexWrap: "wrap", alignItems: "center", justifyContent: "center"}}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{flexGrow: 1}}>
            <AvatarProfile src={avatarSrc} sx={{width: 48, height: 48}} />

            <ListItemText
              primary={displayName}
              secondary={truncateAddress(secondaryText ?? "")}
              secondaryTypographyProps={{component: "span", mt: 0.5}}
            />
          </Stack>

          <Stack direction="column" spacing={0} sx={{py: 2, flexGrow: 1}}>
            {amount > 0 ? (
              <ListItemText
                primary="Amount:"
                secondary={`${amount} MMC`}
                secondaryTypographyProps={{component: "span", mt: 0.5}}
              />
            ) : (
              <InputAmount
                max={MAX_POOL}
                amount={value}
                onBlur={handleBlur}
                onChange={handleChangeInput}
              />
            )}
          </Stack>
        </Stack>

        <TextField
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          rows={3}
          placeholder="Write a message..."
        />
      </Stack>

      <DialogActions
        sx={{
          borderTop: `dashed 1px ${theme.palette.divider}`,
          padding: "16px 24px",
          marginTop: "24px",
        }}>
        <Button onClick={onClose}>Cancel</Button>

        <RainbowEffect
          {...(transferLoading && {
            borderRadius: "10px",
            animationSpeed: "3s",
            padding: "0",
            width: "auto",
          })}>
          <LoadingButton
            variant="contained"
            sx={{backgroundColor: "#fff"}}
            onClick={handleConfirmTransfer}
            disabled={transferLoading || !isTransferValid}
            loading={transferLoading}>
            Confirm
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </Dialog>
  );
}

export default FinanceQuickTransferModal;
