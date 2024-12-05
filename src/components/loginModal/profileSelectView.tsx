// REACT IMPORTS
import React, { useEffect, useState } from 'react';

// MUI IMPORTS
import {
  Box,
  Typography,
  List,
  Button,
  Avatar,
} from '@mui/material';

// UTILS IMPORTS
import { truncateAddress } from '@src/utils/wallet';
import { UserItem } from '../user-item';
import { Profile, ProfileSession, useLogin, useSession, useLazyProfiles } from '@lens-protocol/react-web';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';

import { useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { setAuthLoading } from '@redux/auth';
import { useResponsive } from "@src/hooks/use-responsive.ts";

// ----------------------------------------------------------------------

interface ProfileSelectionProps {
  onRegisterNewProfile: () => void;
  activeConnector: any;
  onDisconnect: () => void;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const ProfileSelectView: React.FC<ProfileSelectionProps> = ({
  onRegisterNewProfile,
  activeConnector,
  onDisconnect,
  onClose
}) => {
  const dispatch = useDispatch();
  const [profiles, setProfiles] = useState([] as Profile[])
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const { execute: getProfiles } = useLazyProfiles();
  const { execute: loginExecute, data, error } = useLogin();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const lgUp = useResponsive('up', 'lg');

  useEffect(() => {
    if (data !== undefined && !error) dispatch(setAuthLoading({ isAuthLoading: false }));
    if (error) setErrorMessage(error.message);
  }, [data, error])


  useEffect(() => {
    (async () => {
      console.log(sessionData)
      if (sessionData?.authenticated)
        return;
      // available profiles
      const results = await getProfiles({
        where: { ownedBy: activeConnector.address }
      });

      if (results.isFailure()) {
        console.error('Error during login:', results.error.message);
        return
      }

      setProfiles(results?.value as Profile[])

    })()
  }, [activeConnector.address, sessionData?.authenticated])

  const login = async (profile?: Profile) => {

    if (!profile) {
      console.warn('No profile selected or provided, please select one.');
      return;
    }

    if (!activeConnector.address) {
      console.error('Wallet address not available.');
      return;
    }

    const result = await loginExecute({
      address: activeConnector.address,
      profileId: profile.id,
    } as any);

    if (result.isFailure()) {
      console.error('Error during login:', result.error.message);
    }

  }

  const handleProfileClick = async (profile: any) => {
    if (sessionData?.authenticated && (sessionData?.profile?.id === profile.id)) {
      onClose?.()
    } else {
      onClose();
      dispatch(setAuthLoading({ isAuthLoading: true }))
      await login(profile);
    }
  }

  return (
    <>
      <Box display="flex" alignItems="center" sx={{ p: 4 }}>
        <Box display="flex" alignItems="center">
          <Avatar
            src={activeConnector.icon}
            sx={{ mr: 1, width: 30, height: 30 }}
          />
          <Box display="flex" flexDirection="column">
            <Typography variant="subtitle2">
              {activeConnector.name}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {truncateAddress(`${activeConnector.address}`)}
            </Typography>
          </Box>
        </Box>
        <Button onClick={onDisconnect} sx={{ ml: 'auto' }}>
          Change wallet
        </Button>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}
      />
      {profiles?.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
            <Typography
              sx={{
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                fontWeight: 'bold',
              }}
            >
              Please select one profile
            </Typography>
            <Button variant="outlined" onClick={onRegisterNewProfile} sx={{ p: 1, width: '40%' }}>
              New profile
            </Button>
          </Box>
          <Box sx={{ maxHeight: '600px', overflowY: 'auto', overflow: 'auto' }}>
            <List style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 16, padding: 16, paddingTop: 3 }}>
              {profiles.map((profile, index) => {
                const isLastOddItem = profiles.length % 2 !== 0 && index === profiles.length - 1;

                return (
                  <UserItem
                    key={`profiles-list-item-${profile.id}`}
                    onClick={() => handleProfileClick(profile)}
                    profile={profile}
                    canFollow={false}
                    sx={{ width: !lgUp ? '100%' : isLastOddItem ? '100%' : '48%' }}
                  />
                )
              })}
            </List>
          </Box>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 1, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ pt: 2, pb: 1 }}>
            No profiles found
          </Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ pb: 4, width: '80%' }}>
            It seems you don’t have any profiles yet. Register a new profile to get started.
          </Typography>
          <Button variant="outlined" onClick={onRegisterNewProfile} sx={{ p: 1, mb: 2, width: '50%' }}>
            Register new profile
          </Button>
        </Box>
      )}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 1200 }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 1200 }}
      >
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
