// REACT IMPORTS
import React, { useEffect } from 'react';

// MUI IMPORTS
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material';

// HOOKS IMPORTS
import { useAuth } from 'src/hooks/use-auth';

// WAGMI IMPORTS
import { useAccount } from 'wagmi';

// UTILS IMPORTS
import { truncateAddress } from 'src/utils/wallet';

// ----------------------------------------------------------------------

interface ProfileSelectionProps {
  onLogin: () => void;
  onRegisterNewProfile: () => void;
  activeConnector: any;
  onDisconnect: () => void;
}

// ----------------------------------------------------------------------

export const ProfileSelectView: React.FC<ProfileSelectionProps> = ({ onLogin, onRegisterNewProfile, activeConnector, onDisconnect }) => {
  const { address } = useAccount();
  const { profiles, selectProfile, selectedProfile } = useAuth();

  useEffect(() => {
    if (selectedProfile) onLogin?.()
  }, [selectedProfile, onLogin]);

  const onSelectProfile = async (profile: any) => {
    selectProfile(profile)
  }

  return (
    <>
      <Typography variant="body1" fontWeight="bold" gutterBottom>
        Wallet connected
      </Typography>
      {activeConnector && (
        <Box display="flex" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar src={activeConnector.icon} sx={{ mr: 1, width: 30, height: 30 }} />
            <Box display="flex" flexDirection="column">
              <Typography variant="subtitle2">{activeConnector.name}</Typography>
              <Typography variant="subtitle2" color="text.secondary">{truncateAddress(address as string)}</Typography>
            </Box>
          </Box>
          <Button onClick={onDisconnect} sx={{ ml: 'auto' }}>
            Disconnect
          </Button>
        </Box>
      )}

      <Box sx={{ width: 'calc(100% + 4rem)', marginLeft: '-2rem', height: '1px', backgroundColor: 'rgba(255,255,255,0.4)', my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Select a profile to login
      </Typography>

      {profiles.length > 0 ? (
        <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
          <List>
            {profiles.map((profile) => (
              <ListItem
                key={profile.id}
                sx={{ width: '100%', p: 0 }}
                onClick={() => onSelectProfile(profile)}
              >
                <Button
                  sx={{
                    width: '100%',
                    display: 'flex',
                    p: 2,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: selectedProfile?.id === profile.id ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`} />
                  </ListItemAvatar>
                  <ListItemText primary={profile?.handle?.localName} sx={{ width: 'auto', display: 'flex' }} />
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No profiles found.
        </Typography>
      )}

      <Box display="flex" alignItems="center" justifyContent="end" sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={onRegisterNewProfile} sx={{ p: 1, width: '50%' }}>
          Register New Profile
        </Button>
      </Box>
    </>
  )
};
