// REACT IMPORTS
import React, { useEffect, useState } from 'react';

// MUI IMPORTS
import { Box, Typography, List, Button, Avatar } from '@mui/material';

// UTILS IMPORTS
import { truncateAddress } from '@src/utils/wallet';
import { Profile, useSession, useLazyProfiles, LoginError } from '@lens-protocol/react-web';
// @ts-ignore
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useDispatch } from 'react-redux';
import { setAuthLoading } from '@redux/auth';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import { UserItem } from '../user-item';
// ----------------------------------------------------------------------

interface ProfileSelectionProps {
  address: string;
  error?: LoginError;
  onRegisterNewProfile: () => void;
  onDisconnect: () => void;
  onClose: () => void;
  login: (profile?: Profile) => Promise<void>;
}

// ----------------------------------------------------------------------

export const ProfileSelectView: React.FC<ProfileSelectionProps> = ({
  address,
  error,
  onRegisterNewProfile,
  onDisconnect,
  onClose,
  login,
}) => {
  const dispatch = useDispatch();
  const lgUp = useResponsive('up', 'lg');

  const [profiles, setProfiles] = useState([] as Profile[]);
  const { execute: getProfiles } = useLazyProfiles();
  const { data: sessionData } = useSession();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!error) dispatch(setAuthLoading({ isAuthLoading: false }));
    if (error) setErrorMessage(error.message);
  }, [error]);

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const results = await getProfiles({ where: { ownedBy: address as string } });
      if (!results.isFailure()) setProfiles(results?.value as Profile[]);
    })();
  }, [address]);

  const handleProfileClick = async (profile: any) => {
    if (sessionData?.authenticated) {
      onClose?.();
    } else {
      onClose();
      dispatch(setAuthLoading({ isAuthLoading: true }));
      await login(profile);
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center" sx={{ p: 4 }}>
        <Box display="flex" alignItems="center">
          <Avatar src={''} sx={{ mr: 1, width: 30, height: 30 }} />
          <Box display="flex" flexDirection="column">
            <Typography variant="subtitle2">Web3Auth</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {truncateAddress(`${address}`)}
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
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}
      />
      {profiles?.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
            }}
          >
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
            <List
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 16,
                padding: 16,
                paddingTop: 3,
              }}
            >
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
                );
              })}
            </List>
          </Box>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 1, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ pt: 2, pb: 1 }}>
            No profiles found
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            textAlign="center"
            sx={{ pb: 4, width: '80%' }}
          >
            It seems you don’t have any profiles yet. Register a new profile to get started.
          </Typography>
          <Button
            variant="outlined"
            onClick={onRegisterNewProfile}
            sx={{ p: 1, mb: 2, width: '50%' }}
          >
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
