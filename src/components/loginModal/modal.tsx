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
  const [activeConnector, setActiveConnector] = useState<any>(null);
  const [view, setView] = useState<'wallet' | 'profile' | 'create'>('wallet');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: sessionData } = useSession();
  const { address, isConnected, connector } = useAccount();
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

  // const refetchProfiles = useCallback(async () => {
  //   if (!address) {
  //     console.error('Wallet address not available.');
  //     return;
  //   }
  //   try {
  //     await fetchProfiles({
  //       for: address,
  //       includeOwned: true,
  //     });
  //   } catch (error) {
  //     console.error('Error re-fetching profiles:', error);
  //   }
  // }, [address, fetchProfiles]);

  useEffect(() => {
    (async () => {
      const web3AuthConnector = connectors.find((el) => el.id === 'web3auth');
      if (open && view === 'wallet') {
        if (web3AuthConnector && !isConnected) {
          await connect({ connector: web3AuthConnector })
        }
      }
    })()
  }, [open, view]);

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

  // useEffect(() => {
  //   if (isConnected && address && view === 'profile') {
  //     refetchProfiles();
  //   }
  // }, [isConnected, view, address]);

  useEffect(() => {
    if (error) {
      console.log('error', error);
      onClose();
    }
  }, [error]);

  const handleProfileCreateSuccess = () => {
    setSuccessMessage('Profile created successfully.');
    setView('profile');
  };

  const handleDisconnectWallet = async () => {
    if (sessionData?.authenticated) await logoutExecute();
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
                    activeConnector={activeConnector}
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
