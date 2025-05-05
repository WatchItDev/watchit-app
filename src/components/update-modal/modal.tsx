// REACT IMPORTS
import React from 'react';

// MUI IMPORTS
import { Modal, Box, Fade, Backdrop } from '@mui/material';

// LOCAL IMPORTS
import { ProfileFormView } from '@src/components/login-modal/profile-form-view.tsx';

// Notifications
import { notifySuccess } from '@src/libs/notifications/internal-notifications.ts';
import { SUCCESS } from '@src/libs/notifications/success.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { getSocialLinks } from '@src/utils/profile.ts';
import { User } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

interface UpdateModalProps {
  open: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const UpdateModal: React.FC<UpdateModalProps> = ({ open, onClose }) => {
  const { session, isAuthLoading } = useAuth();
  const { refreshUser } = useAccountSession();

  const handleProfileUpdateSuccess = async () => {
    notifySuccess(SUCCESS.PROFILE_UPDATED_SUCCESSFULLY);
    await refreshUser();
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
          sx: { pointerEvents: isAuthLoading ? 'none' : 'all' },
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
              height: '85%',
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
              address={session?.address ?? ''}
              initialValues={{
                displayName: session?.user?.displayName ?? '',
                username: session?.user?.username ?? '',
                bio: session?.user?.bio ?? '',
                profilePicture: session?.user?.profilePicture ?? null,
                coverPicture: session?.user?.coverPicture ?? null,
                socialLinks: getSocialLinks(session.user as User),
              }}
            />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};
