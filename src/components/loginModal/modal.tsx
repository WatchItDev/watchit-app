// REACT IMPORTS
import React, { useState, useEffect } from 'react';

// MUI IMPORTS
import { Modal, Box, Fade, Backdrop } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// LENS IMPORTS
import { useLazyProfilesManaged, useLogout, useSession } from '@lens-protocol/react-web';
import { useWeb3Auth } from '@src/hooks/use-web3-auth';

// WAGMI IMPORTS
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { getAccount, disconnect as wagmiDisconnect, type GetAccountReturnType } from '@wagmi/core';

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
  const [successMessage, setSuccessMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

  const { disconnect } = useDisconnect();
  const { data: sessionData } = useSession();
  const { connector, isDisconnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { execute: logoutExecute } = useLogout();
  const { web3Auth: w3, wagmiConfig } = useWeb3Auth();

  // Fetch profiles associated with the connected wallet
  const {
    execute: fetchProfiles,
    data: profiles,
    loading: profilesLoading,
    // called: profilesCalled,
  } = useLazyProfilesManaged();

  const isLoading = (loading || profilesLoading) && view !== 'create';
  // Fetch profiles when the wallet address changes
  useEffect(() => {
    if (address && isConnected) {
      fetchProfiles({
        for: address,
        includeOwned: true,
      });
    }
  }, [address]);

  const waitForAccount = async (): Promise<GetAccountReturnType> => {
    return new Promise((resolve: any, reject: any) => {
      const waiting = () => {
        const account = getAccount(wagmiConfig);
        if (account.isDisconnected) reject();
        if (account.isConnecting) setTimeout(() => waiting(), 500)
        // if only if account is connected and connector is connected
        if (account.isConnected) {
          resolve(account)
        }
      }
      waiting()

    })
  }

  useEffect(() => {
    (async () => {
      if (connector && (isDisconnected || !address)) {
        const { address } = await waitForAccount()
        console.log("connected account ", address)
        setAddress(address as string)
        setIsConnected(true)
      }
    })()
  }, [connector, address, isDisconnected])

  useEffect(() => {
    if (open && view === 'wallet' && isDisconnected) {
      const web3AuthConnector = connectors.find((el) => el.id === 'web3auth');
      if (web3AuthConnector) {
        connect({ connector: web3AuthConnector })
        setView('profile');
        setLoading(false);
      }
    }
  }, [open, view, isDisconnected]);

  useEffect(() => {
    if (error) {
      onClose();
      // w3.removeAllListeners()
      w3.clearCache()
      setView('wallet');
      setLoading(false);
    }
  }, [error]);

  const handleProfileCreateSuccess = () => {
    setSuccessMessage('Profile created successfully.');
    setView('profile');
  };

  const handleDisconnectWallet = async () => {
    if (sessionData?.authenticated) await logoutExecute()
    await wagmiDisconnect(wagmi)
    setIsConnected(false)
    setAddress("")
    disconnect();
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
