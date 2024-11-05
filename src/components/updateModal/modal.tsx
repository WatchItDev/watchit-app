// REACT IMPORTS
import React, { useState } from 'react';

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
import { useAuth } from '@src/hooks/use-auth';

// LOCAL IMPORTS
import { ProfileFormView } from '@src/components/loginModal/profileFormView';

// ----------------------------------------------------------------------

interface UpdateModalProps {
  open: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const UpdateModal: React.FC<UpdateModalProps> = ({ open, onClose }) => {
  // hooks
  const { selectedProfile, loading} = useAuth();

  // states
  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileUpdateSuccess = () => {
    setSuccessMessage('Profile updated successfully.');
    onClose?.()
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
          sx: { pointerEvents: loading ? 'none' : 'all' }
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
              outline: 'none',
              transition: 'all 0.5s easy-in-out'
            }}
          >
            <ProfileFormView
              onSuccess={handleProfileUpdateSuccess}
              onCancel={onClose}
              mode="update"
              initialValues={{
                name: selectedProfile?.metadata?.displayName,
                username: selectedProfile?.handle?.localName,
                bio: selectedProfile?.metadata?.bio,
                profileImage: (selectedProfile?.metadata?.picture as any)?.raw?.uri,
                backgroundImage: (selectedProfile?.metadata?.coverPicture as any)?.raw?.uri,
                socialLinks: {
                  twitter: '',
                  instagram: '',
                  orb: '',
                  farcaster: ''
                },
              }}
            />
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
