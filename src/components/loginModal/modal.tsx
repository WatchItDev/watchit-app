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
// import { useAccount, useConnect, useDisconnect } from 'wagmi';

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
  const { web3Auth: w3 } = useWeb3Auth();
  // const { address, isConnected, isDisconnected, connector } = useAccount();
  const isConnected = w3?.connected;
  const isDisconnected = !isConnected;
  // const { connect, connectors, error} = useConnect();
  // const connect = () => {};
  // const connectors = [];
  const error = '';
  const { execute: logoutExecute } = useLogout();
  // const { disconnect } = useDisconnect();
  const [address, setAddress] = useState('');

  console.log('hello web3Auth instance')
  console.log(w3)
  console.log(w3?.connected)

  // Fetch profiles associated with the connected wallet
  const {
    execute: fetchProfiles,
    data: profiles,
    loading: profilesLoading,
    // called: profilesCalled,
  } = useLazyProfilesManaged();

  const isLoading = (loading || profilesLoading) && view !== 'create';

  console.log('loading')
  console.log(loading)
  console.log(profilesLoading)
  console.log(view !== 'create')
  console.log(isLoading)

  useEffect(() => {
    const getAddress = async () => {
      console.log('getAddress');
      console.log(w3);
      if (w3?.provider) {
        console.log('hello inside');
        const accounts: any = await w3.provider.request({ method: 'eth_accounts' });
        console.log('hello accounts');
        console.log(accounts);
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
        }
      }
    };

    getAddress();
  }, []);

  // Fetch profiles when the wallet address changes
  useEffect(() => {
    if (address && isConnected) {
      fetchProfiles({
        for: address,
        includeOwned: true,
      });
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (open && view === 'wallet' && !isDisconnected) {
      setView('profile');
      setLoading(false);
    }

    if (open && view === 'wallet' && isDisconnected) {
      w3?.connect().then((provider) => {
        console.log('connected to wallet');
        console.log(provider);
        setView('profile');
        setLoading(false);
      });
      // const web3AuthConnector = connectors.find((el) => el.id === 'web3auth');
      // if (web3AuthConnector) {
        // const povider = connect({ connector: web3AuthConnector })
        // console.log('on login')
        // console.log(povider)
        // setView('profile');
        // setLoading(false);
      // }
    }
  }, [open, view, isDisconnected]);

  useEffect(() => {
    if (error) {
      onClose();
      w3?.loginModal.closeModal()
      w3?.removeAllListeners()
      w3?.clearCache()
      setView('wallet');
    }
  }, [error]);

  const handleProfileCreateSuccess = () => {
    setSuccessMessage('Profile created successfully.');
    setView('profile');
  };

  const handleDisconnectWallet = async () => {
    if (sessionData?.authenticated) await logoutExecute()
    // disconnect({ connector });
    setView('wallet');
  };

  console.log('view')
  console.log(view)
  console.log(isConnected)

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
                    address={address}
                    onRegisterNewProfile={() => setView('create')}
                    onDisconnect={handleDisconnectWallet}
                    onClose={onClose}
                  />
                )}

                {view === 'create' && isConnected && (
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
