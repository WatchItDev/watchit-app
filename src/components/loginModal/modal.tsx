// REACT IMPORTS
import React, { useState, useEffect, useCallback } from 'react';

// MUI IMPORTS
import { Modal, Box, Fade, Backdrop } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// WAGMI IMPORTS
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// LOCAL IMPORTS
import { useAuth } from '@src/hooks/use-auth';
import { ProfileSelectView } from '@src/components/loginModal/profileSelectView';
import { ProfileFormView } from '@src/components/loginModal/profileFormView';
import { WatchitLoader } from '../watchit-loader';

// ----------------------------------------------------------------------

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { authenticated, loading: authLoading, login, logout, profiles, selectProfile, refetchProfiles } = useAuth();
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  const [loading, setLoading] = useState(true);
  const [activeConnector, setActiveConnector] = useState<any>(null);
  const [view, setView] = useState<'wallet' | 'profile' | 'create'>('wallet');
  const [successMessage, setSuccessMessage] = useState('');

  const isLoading = (loading || authLoading) && view !== 'create';

  const onLogin = useCallback(async () => {
    if (connectors.length > 0 && !isConnected) {
      const web3AuthConnector = connectors.find((el) => el.id === 'web3auth');
      if (web3AuthConnector) {
        await connect({ connector: web3AuthConnector });
      }
    }
  }, [connect, connectors, isConnected]);

  useEffect(() => {
    if (open && view === 'wallet') {
      onLogin();
    }
  }, [open, onLogin, view]);

  useEffect(() => {
    if (isConnected && connector) {
      setActiveConnector({ ...connector, address });
      setView('profile');
    } else {
      setActiveConnector(null);
      setView('wallet');
    }
    setLoading(false);
  }, [isConnected, connector, address]);

  useEffect(() => {
    if (isConnected && address && view === 'profile') {
      refetchProfiles();
    }
  }, [isConnected, view, address]);

  useEffect(() => {
    console.log('error', error);
    if (error) {
      console.log('error', error);
      onClose();
    }
  }, [error]);

  const handleProfileSelect = useCallback(async (profile: any) => {
    await login(profile);
    selectProfile(profile);
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
        BackdropProps={{ timeout: 500 }}
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
              transition: 'all 0.5s ease-in-out',
            }}
          >
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <WatchitLoader />
              </Box>
            ) : (
              <>
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

                {view === 'create' && isConnected && (
                  <ProfileFormView
                    onSuccess={handleProfileCreateSuccess}
                    onCancel={() => setView('profile')}
                    mode="register"
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
