// REACT IMPORTS
import React, { useState, useEffect, useCallback } from 'react';

// MUI IMPORTS
import { Modal, Box, Fade, Backdrop } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// LENS IMPORTS
import { useLazyProfilesManaged, useLogout, useSession } from '@lens-protocol/react-web';

// WAGMI IMPORTS
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// LOCAL IMPORTS
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
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'wallet' | 'profile' | 'create'>('wallet');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: sessionData } = useSession();
  const { address, isConnected, isDisconnected, connector } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { execute: logoutExecute } = useLogout();
  const { disconnect } = useDisconnect();

  // Fetch profiles associated with the connected wallet
  const {
    execute: fetchProfiles,
    data: profiles,
    loading: profilesLoading,
    called: profilesCalled,
  } = useLazyProfilesManaged();

  const isLoading = (loading || profilesLoading) && view !== 'create';
  // Fetch profiles when the wallet address changes
  useEffect(() => {
    if (address && !profilesLoading && !profilesCalled) {
      fetchProfiles({
        for: address,
        includeOwned: true,
      });
    }
  }, [address]);

  useEffect(() => {
    // if (isConnected && view === 'wallet') { setView('profile'); }
    if (open && view === 'wallet' && isDisconnected) {
      const web3AuthConnector = connectors.find((el) => el.id === 'web3auth');
      if (web3AuthConnector) {
        connect({ connector: web3AuthConnector })
        setView('profile');
        setLoading(false);
      }
    }

    return ()=> disconnect()
  }, [open, view, isDisconnected]);

  useEffect(() => {
    if (error) {
      onClose();
      setView('wallet');
    }
  }, [error]);

  const handleProfileCreateSuccess = () => {
    setSuccessMessage('Profile created successfully.');
    setView('profile');
  };

  const handleDisconnectWallet = async () => {
    if (sessionData?.authenticated) await logoutExecute()
    disconnect({ connector });
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
              width: {
                xs: '90%',
                sm: 500,
              },
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
                    activeConnector={{ ...(connector && { connector, address } || {}) }}
                    onRegisterNewProfile={() => setView('create')}
                    onDisconnect={handleDisconnectWallet}
                    onClose={onClose}
                    profiles={profiles ?? []}
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
