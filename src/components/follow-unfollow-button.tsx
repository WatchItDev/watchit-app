// REACT IMPORTS
import { useState, useEffect, PropsWithChildren } from 'react';

// MUI IMPORTS
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Profile } from '@lens-protocol/api-bindings';

// LENS IMPORTS
import { useFollow, useUnfollow } from '@lens-protocol/react-web';

// LOCAL IMPORTS
import { useAuth } from '@src/hooks/use-auth';

// ----------------------------------------------------------------------

interface FollowUnfollowButtonProps {
  profile: Profile;
}

// ----------------------------------------------------------------------

const FollowUnfollowButton = ({ profile }: PropsWithChildren<FollowUnfollowButtonProps>) => {
  const { selectedProfile } = useAuth();
  const [isFollowed, setIsFollowed] = useState(false);

  // State to handle error and success messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Hooks for follow and unfollow actions
  const { execute: follow, error: followError, loading: followLoading } = useFollow();
  const { execute: unfollow, error: unfollowError, loading: unfollowLoading } = useUnfollow();

  // Handle errors from follow and unfollow actions
  useEffect(() => {
    if (followError) setErrorMessage(followError.message);
    if (unfollowError) setErrorMessage(unfollowError.message);
  }, [followError, unfollowError]);

  useEffect(() => {
    setIsFollowed(!!profile?.operations?.isFollowedByMe?.value);
  }, [selectedProfile, profile]);

  // Function to handle following a profile
  const handleFollow = async () => {
    if (!profile) return;

    try {
      const result = await follow({ profile });
      if (result.isSuccess()) {
        setSuccessMessage('Successfully followed the profile.');
        // Wait for transaction confirmation
        await result.value.waitForCompletion();
      } else {
        // Handle specific follow errors
        handleFollowError(result.error);
      }
    } catch (error) {
      console.log('hello error')
      console.log(error)
      setErrorMessage('An error occurred while trying to follow the profile.');
    }
  };

  // Function to handle unfollowing a profile
  const handleUnfollow = async () => {
    if (!profile) return;

    try {
      const result = await unfollow({ profile });
      if (result.isSuccess()) {
        setSuccessMessage('Successfully unfollowed the profile.');
        // Wait for transaction confirmation
        await result.value.waitForCompletion();
      } else {
        // Handle specific unfollow errors
        handleUnfollowError(result.error);
      }
    } catch (error) {
      console.log('hello error')
      console.log(error)
      setErrorMessage('An error occurred while trying to unfollow the profile.');
    }
  };

  // Function to handle specific follow errors
  const handleFollowError = (error: any) => {
    switch (error.name) {
      case 'BroadcastingError':
        setErrorMessage('There was an error broadcasting the transaction.');
        break;
      case 'PendingSigningRequestError':
        setErrorMessage('There is a pending signing request in your wallet.');
        break;
      case 'InsufficientAllowanceError':
        setErrorMessage(
          `You must approve the contract to spend at least: ${
            error.requestedAmount.asset.symbol
          } ${error.requestedAmount.toSignificantDigits(6)}`
        );
        break;
      case 'InsufficientFundsError':
        setErrorMessage(
          `You do not have enough funds to pay for this follow fee: ${
            error.requestedAmount.asset.symbol
          } ${error.requestedAmount.toSignificantDigits(6)}`
        );
        break;
      case 'WalletConnectionError':
        setErrorMessage('There was an error connecting to your wallet.');
        break;
      case 'PrematureFollowError':
        setErrorMessage('There is a pending unfollow request for this profile.');
        break;
      case 'UserRejectedError':
        // Optionally notify the user that they rejected the action
        break;
      default:
        setErrorMessage('An unknown error occurred.');
    }
  };

  // Function to handle specific unfollow errors
  const handleUnfollowError = (error: any) => {
    switch (error.name) {
      case 'BroadcastingError':
        setErrorMessage('There was an error broadcasting the transaction.');
        break;
      case 'PendingSigningRequestError':
        setErrorMessage('There is a pending signing request in your wallet.');
        break;
      case 'WalletConnectionError':
        setErrorMessage('There was an error connecting to your wallet.');
        break;
      case 'UserRejectedError':
        // Optionally notify the user that they rejected the action
        break;
      default:
        setErrorMessage('An unknown error occurred.');
    }
  };

  return (
    <>
      <LoadingButton
        title={isFollowed ? 'Unfollow' : 'Follow'}
        variant={isFollowed ? 'outlined' : 'contained'}
        sx={{
          minWidth: 120,
          backgroundColor: isFollowed ? '#24262A' : '#fff',
        }}
        onClick={isFollowed ? handleUnfollow : handleFollow}
        disabled={followLoading || unfollowLoading || !selectedProfile || profile?.id === selectedProfile?.id}
        loading={followLoading || unfollowLoading}
      >
        {isFollowed ? 'Unfollow' : 'Follow'}
      </LoadingButton>

      {/* Snackbar for error messages */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 1200, top: '80px !important' }}
      >
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar for success messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 1200, top: '80px !important' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FollowUnfollowButton
