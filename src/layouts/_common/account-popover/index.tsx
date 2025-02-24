import { closeLoginModal, openLoginModal } from '@redux/auth'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress } from '@mui/material'
import { usePopover } from '@src/components/custom-popover'
import { LoginModal } from '@src/components/login-modal'
import { AccountPopoverButton } from '@src/layouts/_common/account-popover/account-popover-button'
import { AccountPopoverMenu } from '@src/layouts/_common/account-popover/account-popover-menu'
import { useRouter } from '@src/routes/hooks'

/**
 * `AccountPopover` is the top-level component that:
 *  - Shows a spinner if session is loading
 *  - Renders the popover trigger (avatar or login button)
 *  - Renders the popover menu
 *  - Includes the Login modal
 */
export function AccountPopover() {
  const dispatch = useDispatch()
  const router = useRouter()
  const popover = usePopover()
  // From Redux
  const isLoginModalOpen: boolean = useSelector((state: any) => state.auth.isLoginModalOpen)
  const isSessionLoading: boolean = useSelector((state: any) => state.auth.isSessionLoading)

  // If the Lens session is still loading, show a spinner.
  if (isSessionLoading) {
    return <CircularProgress size={24} sx={{ color: '#fff' }} />
  }

  // Handlers for opening/closing the login modal
  const handleOpenModal = () => dispatch(openLoginModal())
  const handleCloseModal = () => dispatch(closeLoginModal())

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
  )
}

export default AccountPopover
