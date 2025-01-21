// React and libraries imports
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// @MUI components
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Project components
import { bgGradient } from '@src/theme/css';
import { COLORS } from '@src/layouts/config-layout.ts';

import { notifyError, notifySuccess } from '@notifications/internal-notifications.ts';
import { SUCCESS } from '@notifications/success.ts';
import { ERRORS } from '@notifications/errors.ts';

import useReferrals from "@src/hooks/use-referrals";
import LoadingButton from '@mui/lab/LoadingButton';

interface Props extends BoxProps {
  img?: string;
  title?: string;
  price?: string;
  description?: string;
}

export default function FinanceInviteFriends({
  img,
  price,
  title,
  description,
  sx,
  ...other
}: Props) {
  const {
    sendInvitation,
    checkIfInvitationSent,
    checkIfEmailAlreadyAccepted,
  } = useReferrals();
  const theme = useTheme();
  const sessionData = useSelector((state: any) => state.auth.session);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleInviteClick = async () => {
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notifyError(ERRORS.INVITATION_EMAIL_ERROR);
      return;
    }

    setLoading(true);

    // Check if there's an existing invitation from the current user to this email
    const alreadySent = await checkIfInvitationSent(email);
    if (alreadySent) {
      // You can adapt the notification message to match your requirements
      notifyError(ERRORS.ALREADY_SENT_INVITATION);
      setLoading(false);
      return;
    }

    // Check if the user (the email) already has an accepted invitation (i.e., is enrolled)
    const alreadyAccepted = await checkIfEmailAlreadyAccepted(email);
    if (alreadyAccepted) {
      notifyError(ERRORS.ALREADY_ENROLLED);
      setLoading(false);
      return;
    }

    // Build the payload
    const payload = {
      data: {
        from: {
          id: sessionData?.profile?.id,
          displayName: sessionData?.profile?.metadata?.displayName,
          avatar: (sessionData?.profile?.metadata?.picture as any)?.optimized?.uri,
        },
      },
    };

    // Send the invitation
    try {
      await sendInvitation(email, payload);
      notifySuccess(SUCCESS.INVITATIONS_SUCCESSFULLY);
      setEmail('');
      setLoading(false);
    } catch (err) {
      // Handle any errors coming from sendInvitation
      console.error(err);
      notifyError(ERRORS.INVITATION_SEND_ERROR);
      setLoading(false);
    }
  };

  return (
    <Box {...other}>
      <Box
        component="img"
        alt="invite"
        src={img}
        sx={{
          left: 40,
          zIndex: 9,
          width: 140,
          position: 'relative',
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))',
          ...sx,
        }}
      />

      <Box
        sx={{
          mt: -15,
          position: 'relative',
          color: 'common.white',
          borderRadius: 2,
          p: theme.spacing(16, 5, 5, 5),
          ...bgGradient({
            direction: '135deg',
            startColor: theme.palette.primary.main,
            endColor: theme.palette.primary.dark,
          }),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant={'h3'} textAlign={'center'}>
            {title}
            <Stack
              sx={{ display: 'inline-flex', ml: 2 }}
              direction="row"
              alignItems="flex-end"
              justifyContent="center"
            >
              <Box
                sx={{
                  typography: 'h1',
                  color: 'warning.main',
                  textShadow: `1px 1px 5px ${COLORS.GRAY_LIGHT}`,
                }}
              >
                {price}
              </Box>
              <Box sx={{ typography: 'h6', opacity: 0.5, ml: 1, mb: 1 }}>MMC</Box>
            </Stack>
          </Typography>
        </Stack>

        <Box sx={{ mt: 2, mb: 3, typography: 'body1', fontWeight: 300, opacity: 0.8 }}>
          {description}
        </Box>

        <InputBase
          fullWidth
          placeholder="Email"
          value={email}
          onChange={handleInputChange}
          endAdornment={
            <LoadingButton
              color="warning"
              variant="contained"
              size="small"
              sx={{ mr: 0.5 }}
              onClick={handleInviteClick}
              loading={loading}
            >
              Invite
            </LoadingButton>
          }
          sx={{
            pl: 1.5,
            height: 40,
            borderRadius: 1,
            color: 'primary.main',
            bgcolor: 'common.white',
          }}
        />
      </Box>
    </Box>
  );
}
