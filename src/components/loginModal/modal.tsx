// REACT IMPORTS
import React, { useState, useEffect } from 'react';

// MUI IMPORTS
import { Modal, Box, Fade, Backdrop } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// LENS IMPORTS
import { useLogout, useSession } from '@lens-protocol/react-web';
import { useWeb3Auth } from '@src/hooks/use-web3-auth';

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
  const [address, setAddress] = useState('');

  const { web3Auth: w3 } = useWeb3Auth();
  const { data: sessionData } = useSession();
  const { execute: logoutExecute } = useLogout();

  useEffect(() => {
    (async () => {
      if (w3?.provider) {
        // get accounts from provider
        const accounts: any = await w3.provider.request({
          method: 'eth_accounts'
        });

        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
        }
      }
    })()
  }, [address]);

  useEffect(() => {
    if (open && view === 'wallet' && w3.connected) {
      setView('profile');
      setLoading(false);
      return;
    }
  }, [open, view, w3.connected]);


  useEffect(() => {
    if (open && view === 'wallet' && !w3.connected) {
      (async () => {
        try {
          await w3?.connect()
          setView('profile');
          setLoading(false);
        } catch (err) {
          onClose();
          w3?.loginModal.closeModal()
          setView('wallet');
        }
      })()
    }
  }, [open, view, w3.connected]);

  const handleProfileCreateSuccess = () => {
    setSuccessMessage('Profile created successfully.');
    setView('profile');
  };

  const handleDisconnectWallet = async () => {
    console.log('W3', w3.connected)
    if (sessionData?.authenticated) await logoutExecute()
    if (w3.connected) await w3?.logout({ cleanup: true });
    setView('wallet');
  };

  return (
    <>
      <Modal
        style={{ overflow: 'scroll' }}
        disableScrollLock={true}
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
              bgcolor: loading ? 'transparent' : 'background.paper',
              borderRadius: 2,
              boxShadow: loading ? 0 : 24,
              outline: 'none',
              transition: 'all 0.5s ease-in-out',
            }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <WatchitLoader />
              </Box>
            ) : (
              <>
                {view === 'profile' && w3.connected && (
                  <ProfileSelectView
                    address={address}
                    onRegisterNewProfile={() => setView('create')}
                    onDisconnect={handleDisconnectWallet}
                    onClose={onClose}
                  />
                )}

                {view === 'create' && w3.connected && (
                  <ProfileFormView
                    address={address}
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
