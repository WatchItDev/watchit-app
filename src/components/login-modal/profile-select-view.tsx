// REACT IMPORTS
import React, { useEffect, useState } from 'react';

// MUI IMPORTS
import { Box, Typography, List, Button, Avatar } from '@mui/material';

// UTILS IMPORTS
import { truncateAddress } from '@src/utils/wallet';
import { Profile, useLazyProfiles } from '@lens-protocol/react-web';

import { useDispatch } from 'react-redux';
import { setAuthLoading, setBalance } from '@redux/auth';

import { notifyError } from '@src/libs/notifications/internal-notifications.ts';
import { LoadingScreen } from '@src/components/loading-screen';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import { filterHiddenProfiles } from "@src/libs/profile.ts";
import { UserItem } from '@src/components/user-item';
import { useAuth } from '@src/hooks/use-auth.ts';
import { ERRORS } from '@src/libs/notifications/errors.ts';
import {ProfileSelectionProps} from "@src/components/login-modal/types.ts"
import { clearBookmarks } from '@src/redux/bookmark';

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
  const { execute: getProfiles, loading } = useLazyProfiles();
  const { session: sessionData } = useAuth();

  useEffect(() => {
    if (!error) dispatch(setAuthLoading({ isSessionLoading: false }));
    if (error) notifyError(ERRORS.LOGIN_FAILED_ERROR);
  }, [error]);

  useEffect(() => {
    (async () => {
      // @ts-expect-error No error in this context
      const results = await getProfiles({ where: { ownedBy: address as string } });
      if (!results.isFailure()) setProfiles(filterHiddenProfiles(results?.value) as Profile[]);
    })();
  }, [address]);

  const handleProfileClick = async (profile: Profile) => {
    if (sessionData?.authenticated) {
      onClose?.();
    } else {
      // Set the balance to 0 to later refetch the balance correctly
      dispatch(setBalance({ balance: 0 }));

      onClose();
      dispatch(setAuthLoading({ isSessionLoading: true }));
      await login(profile);
      dispatch(setAuthLoading({ isSessionLoading: false }));
    }
    // Clear all bookmarks
    dispatch(clearBookmarks());
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
          Change Wallet
        </Button>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}
      />

      {loading ? <LoadingScreen sx={{ py: 16 }} /> : <></>}

      {profiles?.length > 0 && !loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100% - 8rem)' }}>
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
              Select your profile
            </Typography>
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
                    sx={{ width: !lgUp ? '100%' : isLastOddItem ? '100%' : '48%' }}
                  />
                );
              })}
            </List>
          </Box>
        </Box>
      ) : (
        <></>
      )}

      {profiles?.length === 0 && !loading ? (
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
      ) : (
        <></>
      )}
    </>
  );
};
