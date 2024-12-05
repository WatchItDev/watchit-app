// REACT IMPORTS
import React, { useState } from 'react';

// MUI IMPORTS
import { Modal, Box, Fade, Backdrop } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// LOCAL IMPORTS
import { ProfileFormView } from '@src/components/loginModal/profileFormView';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useSession } from '@lens-protocol/react-web';

// ----------------------------------------------------------------------

interface UpdateModalProps {
  open: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const UpdateModal: React.FC<UpdateModalProps> = ({ open, onClose }) => {
  const { data: sessionData, loading }: ReadResult<ProfileSession> = useSession();
  // states
  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileUpdateSuccess = () => {
    setSuccessMessage('Profile updated successfully.');
    onClose?.();
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
        BackdropProps={{
          timeout: 500,
          sx: { pointerEvents: loading ? 'none' : 'all' },
        }}
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
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              outline: 'none',
              transition: 'all 0.5s easy-in-out',
            }}
          >
            <ProfileFormView
              onSuccess={handleProfileUpdateSuccess}
              onCancel={onClose}
              mode="update"
              initialValues={{
                name: sessionData?.profile?.metadata?.displayName,
                username: sessionData?.profile?.handle?.localName,
                bio: sessionData?.profile?.metadata?.bio,
                profileImage: (sessionData?.profile?.metadata?.picture as any)?.raw?.uri,
                backgroundImage: (sessionData?.profile?.metadata?.coverPicture as any)?.raw?.uri,
                socialLinks: {
                  twitter: '',
                  instagram: '',
                  orb: '',
                  farcaster: '',
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
