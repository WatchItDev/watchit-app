// REACT IMPORTS
import React, { useCallback, useEffect, useState } from 'react';

// MUI IMPORTS
import { Backdrop, Box, Fade, Modal } from '@mui/material';

// LENS IMPORTS
import { type Profile, useLogin, useLogout } from '@lens-protocol/react-web';
import { useWeb3Auth } from '@src/hooks/use-web3-auth';

// LOCAL IMPORTS
import { ProfileSelectView } from '@src/components/login-modal/profile-select-view.tsx';
import { ProfileFormView } from '@src/components/login-modal/profile-form-view.tsx';
import { WatchitLoader } from '../watchit-loader';
import { useDispatch } from 'react-redux';
import {closeLoginModal, setEmail} from '@redux/auth';
import { notifySuccess } from '@notifications/internal-notifications.ts';
import { SUCCESS } from '@notifications/success.ts';
// @ts-ignore
import {type AuthUserInfo} from "@web3auth/auth/dist/types/utils/interfaces";
import useReferrals from '@src/hooks/use-referrals.ts';
import { useAuth } from '@src/hooks/use-auth.ts';

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
  const { session: sessionData } = useAuth();
  const { execute: logoutExecute } = useLogout();
  const { execute: loginExecute, error } = useLogin();
  const { acceptOrCreateInvitationForUser } = useReferrals();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (w3?.provider && w3.connected) {
        // get accounts from provider
        const accounts: any = await w3.provider.request({
          method: 'eth_accounts',
        });

        // Obtain user info from the provider to get the email
        await w3.getUserInfo().then((r:Partial<AuthUserInfo>) => dispatch(setEmail(r?.email)));

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

          // Once the user is authenticated, store the session expiration
          const sessionTimeMs = 60 * 60 * 24 * 30 * 1000; // 30 days
          const expirationTimestamp = Date.now() + sessionTimeMs;
          localStorage.setItem("sessionExpiration", expirationTimestamp.toString());

        } catch (err) {
          onClose();
          w3?.loginModal.closeModal();
          setLoading(false);
          setView('wallet');
        }
      })();
    }
  }, [open, view, w3.connected]);

  const handleProfileCreateSuccess = useCallback(() => {
    acceptOrCreateInvitationForUser();
    notifySuccess(SUCCESS.PROFILE_CREATED_SUCCESSFULLY);
    dispatch(closeLoginModal());
  }, []);

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

  const handleBackdropClick = () => {
    if (view === 'profile') {
      onClose();
    }
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
        BackdropProps={{ timeout: 500, onClick: handleBackdropClick }}
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
              overflow: 'auto',
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
