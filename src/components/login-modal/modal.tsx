// REACT IMPORTS
import React, { useState, useEffect } from 'react';

// MUI IMPORTS
import { Modal, Box, Fade, Backdrop } from '@mui/material';

// LENS IMPORTS
import { useLogout, useLogin, type Profile } from '@lens-protocol/react-web';
import { useWeb3Auth } from '@src/hooks/use-web3-auth';

// LOCAL IMPORTS
import { ProfileSelectView } from '@src/components/login-modal/profile-select-view.tsx';
import { ProfileFormView } from '@src/components/login-modal/profile-form-view.tsx';
import { WatchitLoader } from '../watchit-loader';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { closeLoginModal } from '@redux/auth';

// ----------------------------------------------------------------------

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'wallet' | 'profile' | 'create'>('wallet');
  const [address, setAddress] = useState('');

  const { web3Auth: w3 } = useWeb3Auth();
  const sessionData = useSelector((state: any) => state.auth.session);
  const { execute: logoutExecute } = useLogout();
  const { execute: loginExecute, error } = useLogin();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (w3?.provider && w3.connected) {
        // get accounts from provider
        const accounts: any = await w3.provider.request({
          method: 'eth_accounts',
        });

        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
        }
      }
    })();
  }, [address, w3.connected]);

  useEffect(() => {
    if (open && view === 'wallet' && w3.connected) {
      setView('profile');
      setLoading(false);
    }
  }, [open, view, w3.connected]);

  useEffect(() => {
    if (open && view === 'wallet' && !w3.connected) {
      (async () => {
        try {
          await w3?.connect();
          setView('profile');
          setLoading(false);
        } catch (err) {
          onClose();
          w3?.loginModal.closeModal();
          setLoading(false);
          setView('wallet');
        }
      })();
    }
  }, [open, view, w3.connected]);

  const handleProfileCreateSuccess = () => {
    enqueueSnackbar('Profile created successfully.', { variant: 'success' })
    dispatch(closeLoginModal());
  };

  const handleLogin = async (profile?: Profile) => {
    if (!profile || !address) return;
    const result = await loginExecute({
      address: address,
      profileId: profile.id,
    } as any);

    if (result.isFailure()) {
      console.error('Error during login:', result.error.message);
    }
  };

  const handleDisconnectWallet = async () => {
    if (sessionData?.authenticated) await logoutExecute();
    if (w3.connected) await w3?.logout();
    setView('wallet');
    setAddress('');
  };

  return (
    <>
      <Modal
        style={{ overflow: 'scroll', zIndex: view === 'profile' && address ? 3147483647 : 10000 }}
        disableScrollLock={true}
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500, onClick: () => {}}}
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
              maxHeight: '85%',
              bgcolor: loading ? 'transparent' : 'background.paper',
              borderRadius: 2,
              boxShadow: loading ? 0 : 24,
              outline: 'none',
              transition: 'all 0.5s ease-in-out',
              overflow: 'auto'
            }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <WatchitLoader />
              </Box>
            ) : (
              <>
                {view === 'profile' && address && (
                  <ProfileSelectView
                    error={error}
                    address={address}
                    login={handleLogin}
                    onRegisterNewProfile={() => setView('create')}
                    onDisconnect={handleDisconnectWallet}
                    onClose={onClose}
                  />
                )}

                {view === 'create' && address && (
                  <ProfileFormView
                    error={error}
                    address={address}
                    login={handleLogin}
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
    </>
  );
};
