import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Box,
} from '@mui/material';
import { WatchitLoader } from '@src/components/watchit-loader';
import { ProfileFormView } from './profile-form-view';
import { useAuth } from '@src/hooks/use-auth';
import { useAccountSession } from '@src/hooks/use-account-session';

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { session, isAuthLoading: accountLoading } = useAuth();
  const { login, logout, syncAddress } = useAccountSession();
  const [showForm, setShowForm] = useState(false);
  const loginTriggered = useRef(false);

  useEffect(() => {
    if (!open) {
      loginTriggered.current = false;
      setShowForm(false);
      return;
    }

    if (session.authenticated && session.user) {
      onClose();
      return;
    }

    if (!session.authenticated && !loginTriggered.current) {
      loginTriggered.current = true;
      (async () => {
        try {
          await login();
        } catch {
          loginTriggered.current = false;
          onClose();
        }
      })();
    }
  }, [open, session]);

  useEffect(() => {
    if (session.user) {
      setShowForm(false);
      onClose();
    } else if (session.address && !session.user) {
      setShowForm(true);
    }
  }, [session]);

  const handleSuccess = () => {
    syncAddress();
  }

  const handleCancel = () => {
    logout();
    onClose();
  }

  return (
    <Modal
      sx={{ overflow: 'scroll', display: open ? 'flex' : 'none', zIndex: session.address && !session.user && open ? 3147483647 : 10000 }}
      open={open}
      onClose={onClose}
      closeAfterTransition
      disableScrollLock={true}
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500, onClick: handleCancel }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            maxHeight: '85%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            outline: 'none',
            overflow: 'auto',
          }}
        >
          {accountLoading && (
            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
              <WatchitLoader />
            </Box>
          )}

          {!accountLoading && showForm && session.address && (
            <ProfileFormView
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              mode="register"
            />
          )}
        </Box>
      </Fade>
    </Modal>
  );
};
