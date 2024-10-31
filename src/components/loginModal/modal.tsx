// // REACT IMPORTS
// import React, { useState } from 'react';
//
// // MUI IMPORTS
// import {
//   Modal,
//   Box,
//   CircularProgress
// } from '@mui/material';
//
// // HOOKS IMPORTS
// import { useAuth } from 'src/hooks/use-auth';
// import { useAccount, useDisconnect } from 'wagmi';
//
// // COMPONENTS IMPORTS
// import { WalletConnectView } from 'src/components/loginModal/walletConnectView';
// import { ProfileSelectView } from 'src/components/loginModal/profileSelectView';
// import { NewProfileData, ProfileCreateView } from 'src/components/loginModal/profileCreateView';
//
// // ----------------------------------------------------------------------
//
// interface LoginModalProps {
//   open: boolean
//   onClose: () => void
// }
//
// // ----------------------------------------------------------------------
//
// export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
//   // hooks
//   const { loading: authLoading, login, registerProfile } = useAuth();
//   const { address }: any = useAccount();
//   const { disconnect } = useDisconnect();
//
//   // states
//   const [loading, setLoading] = useState(false);
//   const [activeConnector, setActiveConnector] = useState();
//   const [view, setView] = useState<'wallet' | 'profile' | 'create'>('wallet');
//
//   const handleConnectWallet = async ({ connector, icon } : any) => {
//     setActiveConnector({ ...connector, icon, address })
//     setView('profile');
//   };
//
//   const handleLogin = async () => {
//     await login();
//     onClose();
//   };
//
//   const handleCreateProfile = async ({ username }: NewProfileData) => {
//     setLoading(true)
//     await registerProfile(username);
//     setLoading(false)
//     setView('profile');
//   };
//
//   const handleDisconnectWallet = () => {
//     disconnect();
//     setView('wallet');
//   };
//
//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: 400,
//           bgcolor: 'background.paper',
//           borderRadius: 2,
//           boxShadow: 24,
//           p: 4,
//         }}
//       >
//         {loading || authLoading ? (
//           <Box display="flex" justifyContent="center" alignItems="center" height="100%">
//             <CircularProgress sx={{ color: '#fff' }} />
//           </Box>
//         ) : (
//           <>
//             {view === 'wallet' && (
//               <WalletConnectView onConnectorsLoad={() => { console.log('hello load connects'); setLoading(false); }} onConnect={handleConnectWallet} />
//             )}
//
//             {view === 'profile' && (
//               <ProfileSelectView
//                 onLogin={handleLogin}
//                 activeConnector={activeConnector}
//                 onRegisterNewProfile={() => setView('create')}
//                 onDisconnect={handleDisconnectWallet}
//               />
//             )}
//
//             {view === 'create' && (
//               <ProfileCreateView
//                 onCreate={handleCreateProfile}
//                 onCancel={() => setView('profile')}
//               />
//             )}
//           </>
//         )}
//       </Box>
//     </Modal>
//   );
// };
// REACT IMPORTS
import React, { useState, useEffect, useCallback } from 'react';

// MUI IMPORTS
import {
  Modal,
  Box,
  CircularProgress,
  Fade,
  Backdrop
} from '@mui/material';

// HOOKS IMPORTS
import { useAuth } from 'src/hooks/use-auth';
import { useAccount, useDisconnect } from 'wagmi';

// COMPONENTS IMPORTS
import { WalletConnectView } from 'src/components/loginModal/walletConnectView';
import { ProfileSelectView } from 'src/components/loginModal/profileSelectView';
import { ProfileCreateView } from 'src/components/loginModal/profileCreateView';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ProfileData } from '../../auth/context/lens/types';

// ----------------------------------------------------------------------

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  // hooks
  const { loading: authLoading, login, registerProfile, profiles, selectProfile } = useAuth();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  // states
  const [loading, setLoading] = useState(false);
  const [activeConnector, setActiveConnector] = useState<any>(null);
  const [view, setView] = useState<'wallet' | 'profile' | 'create'>('wallet');

  const handleConnectWallet = async ({ connector, icon }: any) => {
    setActiveConnector({ ...connector, icon, address });
    setView('profile');
  };

  const handleProfileSelect = useCallback(async (profile: any) => {
    selectProfile(profile);
    await login();
    onClose();
  }, [login, onClose, selectProfile]);

  const handleCreateProfile = async (data: ProfileData) => {
    setLoading(true);
    await registerProfile(data);
    setLoading(false);
    setView('profile');
  };

  const handleDisconnectWallet = () => {
    disconnect();
    setView('wallet');
  };

  return (
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
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: 'none',
          }}
        >
          {loading || authLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress sx={{ color: '#000' }} />
            </Box>
          ) : (
            <>
              {view === 'wallet' && (
                <WalletConnectView
                  onConnectorsLoad={() => {
                    setLoading(false);
                  }}
                  onConnect={handleConnectWallet}
                />
              )}

              {view === 'profile' && profiles.length === 0 && (
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    No tienes ningún perfil creado.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setView('create')}
                    sx={{ mt: 2 }}
                  >
                    Crear Perfil
                  </Button>
                </Box>
              )}

              {view === 'profile' && profiles.length > 0 && (
                <ProfileSelectView
                  onProfileSelect={handleProfileSelect}
                  activeConnector={activeConnector}
                  onRegisterNewProfile={() => setView('create')}
                  onDisconnect={handleDisconnectWallet}
                  profiles={[profiles[0]]} // Mostrar solo el primer perfil
                />
              )}

              {view === 'create' && (
                <ProfileCreateView
                  onCreate={handleCreateProfile}
                  onCancel={() => setView('profile')}
                />
              )}
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};
