// MUI IMPORTS
import { CircularProgress } from '@mui/material';

// REDUX IMPORTS
import { useDispatch } from 'react-redux';
import { closeLoginModal, openLoginModal } from '@redux/auth';

// LOCAL IMPORTS
import { usePopover } from '@src/components/custom-popover';
import { useRouter } from '@src/routes/hooks';
import { LoginModal } from '@src/components/login-modal';
import { AccountPopoverButton } from '@src/layouts/_common/account-popover/account-popover-button';
import { AccountPopoverMenu } from '@src/layouts/_common/account-popover/account-popover-menu';
import { useAuth } from '@src/hooks/use-auth.ts';

// ----------------------------------------------------------------------

/**
 * `AccountPopover` is the top-level component that:
 *  - Shows a spinner if session is loading
 *  - Renders the popover trigger (avatar or login button)
 *  - Renders the popover menu
 *  - Includes the Login modal
 */
export function AccountPopover() {
  const dispatch = useDispatch();
  const router = useRouter();
  const popover = usePopover();
  const { isLoginModalOpen, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <CircularProgress size={24} sx={{ color: '#fff' }} />;
  }

  // Handlers for opening/closing the login modal
  const handleOpenModal = () => dispatch(openLoginModal());
  const handleCloseModal = () => dispatch(closeLoginModal());

  // Render the main popover button + menu + login modal
  return (
    <>
      {/* The area that toggles the popover (avatar or Social Login button) */}
      <AccountPopoverButton
        popover={popover}
        onOpenLoginModal={handleOpenModal}
      />

      {/* The popover menu itself */}
      <AccountPopoverMenu
        popover={popover}
        router={router}
      />

      {/* The login modal */}
      <LoginModal open={isLoginModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default AccountPopover
