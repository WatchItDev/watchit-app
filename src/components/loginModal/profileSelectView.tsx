// REACT IMPORTS
import React, { useCallback } from 'react';

// MUI IMPORTS
import {
  Box,
  Typography,
  List,
  Button,
  Avatar,
} from '@mui/material';

// WAGMI IMPORTS
import { useAccount } from 'wagmi';

// UTILS IMPORTS
import { truncateAddress } from '@src/utils/wallet';
import { UserItem } from '../user-item';
import { Profile, ProfileSession, useLogin, useSession } from '@lens-protocol/react-web';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';

// ----------------------------------------------------------------------

interface ProfileSelectionProps {
  onRegisterNewProfile: () => void;
  activeConnector: any;
  onDisconnect: () => void;
  onClose: () => void;
  profiles: any[];
}

// ----------------------------------------------------------------------

export const ProfileSelectView: React.FC<ProfileSelectionProps> = ({
                                                                     onRegisterNewProfile,
                                                                     activeConnector,
                                                                     onDisconnect,
                                                                     onClose,
                                                                     profiles,
                                                                   }) => {
  const { data: sessionData, error: sessionError, loading: sessionLoading }: ReadResult<ProfileSession> = useSession();
  const { execute: loginExecute, loading: loginLoading } = useLogin();
  const { address, isConnecting, isConnected, status, connector } = useAccount();

  console.log('sessionData', sessionData);
  console.log('sessionError', sessionError);
  console.log('sessionLoading', sessionLoading);
  console.log('loginLoading', loginLoading);
  console.log('isConnecting', isConnecting);
  console.log('isConnected', isConnected);
  console.log('status', status);
  console.log('connector', connector);

  const login = useCallback(
    async (profile?: Profile) => {
      const profileToUse = profile;

      if (!profileToUse) {
        console.warn('No profile selected or provided, please select one.');
        return;
      }

      if (!address) {
        console.error('Wallet address not available.');
        return;
      }

      try {
        console.log('loginExecute')
        console.log(address)
        console.log(profileToUse)

        const result = await loginExecute({
          address,
          profileId: profileToUse.id,
        } as any);

        if (result.isFailure()) {
          console.error('Error during login:', result.error.message);
        } else {
          console.log('Login initiated.');
        }
      } catch (err) {
        console.error('Error in login:', err);
      }
    },
    [loginExecute, address]
  );

  const handleProfileClick = async (profile: any) => {
    if (sessionData?.authenticated && (sessionData?.profile?.id === profile.id)) {
      onClose?.()
    } else {
      await login(profile);
      onClose();
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
              New Profile
            </Button>
          </Box>
          <Box sx={{ maxHeight: '600px', overflowY: 'auto' }}>
            <List style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 16, padding: 16, paddingTop: 3 }}>
               {profiles.map((profile, index) => {
                 const isLastOddItem = profiles.length % 2 !== 0 && index === profiles.length - 1;

                 return (
                   <UserItem
                     key={`profiles-list-item-${profile.id}`}
                     onClick={() => handleProfileClick(profile)}
                     profile={profile}
                     canFollow={false}
                     sx={{ width: isLastOddItem ? '100%' : '48%' }}
                   />
                 )
               })}
            </List>
          </Box>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 1, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ pt: 2, pb: 1 }}>
            No Profiles Found
          </Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ pb: 4, width: '80%' }}>
            It seems you don’t have any profiles yet. Register a new profile to get started.
          </Typography>
          <Button variant="outlined" onClick={onRegisterNewProfile} sx={{ p: 1, mb: 2, width: '50%' }}>
            Register New Profile
          </Button>
        </Box>
      )}
    </>
  );
};
