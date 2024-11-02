// REACT IMPORTS
import React, { useState, useEffect, useCallback } from 'react';

// MUI IMPORTS
import {
  Modal,
  Box,
  Fade,
  Backdrop
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// HOOKS IMPORTS
import { useAuth } from 'src/hooks/use-auth';
import { useAccount, useDisconnect } from 'wagmi';

// LOCAL IMPORTS
import { WalletConnectView } from 'src/components/loginModal/walletConnectView';
import { ProfileSelectView } from 'src/components/loginModal/profileSelectView';
import { ProfileCreateView } from 'src/components/loginModal/profileCreateView';
import { WatchitLoader } from '../watchit-loader';

// ----------------------------------------------------------------------

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  // hooks
  const { authenticated, loading: authLoading, login, logout, profiles, selectProfile, refetchProfiles } = useAuth();
  const { address, isConnected, connector, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  // states
  const [loading, setLoading] = useState(true);
  const [activeConnector, setActiveConnector] = useState<any>(null);
  const [view, setView] = useState<'wallet' | 'profile' | 'create'>();
  const [successMessage, setSuccessMessage] = useState('');

  const isLoading = (loading || authLoading || isConnecting) && (view !== 'create')

  useEffect(() => {
    setLoading(false);

    if (isConnected && connector) {
      setActiveConnector({ ...connector, address });
      setView('profile');
    }

    if (!isConnected) {
      setActiveConnector(null);
      setView('wallet');
    }
  }, [isConnected, connector, address, isConnecting]);

  useEffect(() => {
    if (isConnected && address) {
      refetchProfiles();
    }
    // eslint-disable-next-line
  }, [isConnected, address]);

  const handleConnectWallet = async ({ connector: newConnector, icon }: any) => {
    setActiveConnector({ ...newConnector, icon, address });
    setView('profile');
  };

  const handleProfileSelect = useCallback(async (profile: any) => {
    console.log('hello profile select')
    console.log(profile)

    selectProfile(profile);
    await login(profile);
    onClose();
  }, [login, onClose, selectProfile]);

  const handleProfileCreateSuccess = () => {
    setSuccessMessage('Profile created successfully.');
    setView('profile');
  };

  const handleDisconnectWallet = async () => {
    if (authenticated) await logout();
    disconnect();
    setView('wallet');
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              bgcolor: isLoading ? 'transparent' : 'background.paper',
              borderRadius: 2,
              boxShadow: isLoading ? 0 : 24,
              outline: 'none',
              transition: 'all 0.5s easy-in-out'
            }}
          >
            { isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <WatchitLoader />
              </Box>
            ) : (
              <>
                {view === 'wallet' && !isConnected && (
                  <WalletConnectView
                    onConnectorsLoad={() => {
                      setLoading(false);
                    }}
                    onConnect={handleConnectWallet}
                  />
                )}

                {view === 'profile' && isConnected && (
                  <ProfileSelectView
                    onProfileSelect={handleProfileSelect}
                    activeConnector={activeConnector}
                    onRegisterNewProfile={() => setView('create')}
                    onDisconnect={handleDisconnectWallet}
                    onClose={onClose}
                    profiles={profiles}
                  />
                )}

                {view === 'create' && (
                  <ProfileCreateView
                    onSuccess={handleProfileCreateSuccess}
                    onCancel={() => setView('profile')}
                  />
                )}
              </>
            )}
          </Box>
        </Fade>
      </Modal>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

    </>
  );
};
