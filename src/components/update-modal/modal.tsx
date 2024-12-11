// REACT IMPORTS
import React from 'react';

// MUI IMPORTS
import { Modal, Box, Fade, Backdrop } from '@mui/material';

// LOCAL IMPORTS
import { ProfileFormView } from '@src/components/login-modal/profile-form-view.tsx';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useSession } from '@lens-protocol/react-web';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

interface UpdateModalProps {
  open: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const UpdateModal: React.FC<UpdateModalProps> = ({ open, onClose }) => {
  const { data: sessionData, loading }: ReadResult<ProfileSession> = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const handleProfileUpdateSuccess = () => {
    enqueueSnackbar('Profile updated successfully.', { variant: 'success' })
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
              address={sessionData?.profile?.ownedBy?.address}
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
    </>
  );
};
