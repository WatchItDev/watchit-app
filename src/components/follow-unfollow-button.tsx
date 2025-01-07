// REACT IMPORTS
import { useState, useEffect, PropsWithChildren } from 'react';

// MUI IMPORTS
import LoadingButton from '@mui/lab/LoadingButton';

// LENS IMPORTS
import {
  ProfileId,
  useFollow,
  useUnfollow,
} from '@lens-protocol/react-web';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { useLazyProfile } from '@lens-protocol/react';

// REDUX IMPORTS
import { openLoginModal } from '@redux/auth';
import {useDispatch, useSelector} from 'react-redux';
import { removeFollowing, addFollowing } from '@redux/followers';

// NOTIFICATIONS IMPORTS
import { useSnackbar } from 'notistack';

// LOCAL IMPORTS
import {useNotifications} from "@src/hooks/use-notifications.ts";
import {useNotificationPayload} from "@src/hooks/use-notification-payload.ts";
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";
import Box from "@mui/material/Box";
import {ERRORS} from "@notifications/errors.ts";
import {notifyError} from "@notifications/internal-notifications.ts";

// ----------------------------------------------------------------------

interface FollowUnfollowButtonProps {
  profileId: string;
  followButtonMinWidth?: number;
  size?: 'small' | 'medium' | 'large';
}

// ----------------------------------------------------------------------

const FollowUnfollowButton = ({ profileId, size = 'medium', followButtonMinWidth = 120 }: PropsWithChildren<FollowUnfollowButtonProps>) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { data: profile, execute: getProfile, loading } = useLazyProfile();
  const sessionData = useSelector((state: any) => state.auth.session);
  const [isFollowed, setIsFollowed] = useState(profile?.operations?.isFollowedByMe?.value);

  // State to handle error and success messages
  const [isProcessing, setIsProcessing] = useState(false);

  // Hooks for follow and unfollow actions
  const { execute: follow, error: followError, loading: followLoading } = useFollow();
  const { execute: unfollow, error: unfollowError, loading: unfollowLoading } = useUnfollow();

  // Handle notifications for follow
  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(sessionData);

  useEffect(() => {
    if (profileId && profileId !== sessionData?.profile?.id)
      getProfile({ forProfileId: profileId as ProfileId });
  }, []);

  // Handle errors from follow and unfollow actions
  useEffect(() => {
    if (followError) handleActionError(followError);
    if (unfollowError) handleActionError(unfollowError);
  }, [followError, unfollowError]);

  useEffect(() => {
    getProfile({ forProfileId: profileId as ProfileId });
  }, [sessionData?.authenticated]);

  useEffect(() => {
    setIsFollowed(profile?.operations?.isFollowedByMe?.value);
  }, [profile?.operations?.isFollowedByMe?.value]);

  const handleUpdateProfile = () => {
    getProfile({ forProfileId: profileId as ProfileId });
  };

  // General function to handle follow/unfollow actions
  const handleAction = async (action: any, successMsg: string, followState: boolean) => {
    if (!profile) return;
    if (!sessionData?.authenticated) return dispatch(openLoginModal());

    setIsProcessing(true);
    try {
      const result = await action({ profile });
      if (result.isSuccess()) {
        enqueueSnackbar(successMsg, { variant: 'success' })
        setIsFollowed(followState);

        // Wait for transaction confirmation
        await result.value.waitForCompletion();
        handleUpdateProfile();

        // Update the following list
        if(action === unfollow) {
          dispatch(removeFollowing(profileId));
        }else{
          dispatch(addFollowing(profile));
        }

        // Send notification to the profile being followed
        const notificationPayload = generatePayload('FOLLOW', {
          id: profile.id,
          displayName: profile?.metadata?.displayName ?? 'no name',
          avatar: (profile?.metadata?.picture as any)?.optimized?.uri,
        }, {
          rawDescription: `${sessionData?.profile?.metadata?.displayName} now is following you`,
        });

        await sendNotification(profile.id, sessionData?.profile?.id, notificationPayload);
      } else {
        handleActionError(result.error);
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar('An error occurred while processing the action.', { variant: 'error' })
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle action errors
  /*const handleActionError = (error: any) => {
    /!*const errorMessages: { [key: string]: string } = {
      BROADCASTING_TRANSACTION_ERROR: 'There was an error broadcasting the transaction.',
      PENDING_SIGNING_REQUEST_ERROR: 'There is a pending signing request in your wallet.',
      INSUFFICIENT_ALLOWANCE_ERROR: `You must approve the contract to spend at least: ${error.requestedAmount.asset.symbol} ${error.requestedAmount.toSignificantDigits(6)}`,
      INSUFFICIENT_FUNDS_ERROR: `You do not have enough funds to pay for this follow fee: ${error.requestedAmount.asset.symbol} ${error.requestedAmount.toSignificantDigits(6)}`,
      WALLET_CONNECTION_ERROR: 'There was an error connecting to your wallet.',
      PREMATURE_ACTION_ERROR: 'There is a pending unfollow request for this profile.',
    };*!/
    // enqueueSnackbar(errorMessages[error.name] || ERRORS.UNKNOWN_ERROR, { variant: 'error' })
    // notifyError(ERRORS[error.name] || ERRORS.UNKNOWN_ERROR);
  };*/

  const handleActionError = (error: any) => {
    const errorName = ERRORS[error.name as keyof typeof ERRORS] || ERRORS.UNKNOWN_ERROR;
    notifyError(errorName);
  };

  const getFollowMessage = (profileName: string, action: string): string => {
    return `Successfully ${action} ${profileName}.`;
  }



  const RainbowEffect = (isProcessing || loading) ? NeonPaper : Box;

  return (
    <>
      <RainbowEffect
        {...((isProcessing || loading) && {
          borderRadius: '10px',
          animationSpeed: '3s',
          padding: '0',
          width: 'auto'
        })}
      >
        <LoadingButton
          size={size}
          title={isFollowed ? 'Unfollow' : 'Follow'}
          variant={isFollowed ? 'outlined' : 'contained'}
          sx={{
            minWidth: followButtonMinWidth,
            backgroundColor: isFollowed ? '#24262A' : '#fff',
          }}
          onClick={(event) => {
            event.stopPropagation();

            isFollowed
              ? handleAction(unfollow, getFollowMessage(profile?.handle?.localName ?? '', 'unfollowed'), false)
              : handleAction(follow, getFollowMessage(profile?.handle?.localName ?? '', 'followed'), true);
          }}
          disabled={isProcessing || profile?.id === sessionData?.profile?.id || loading}
          loading={followLoading || unfollowLoading}
        >
          {isFollowed ? 'Unfollow' : 'Follow'}
        </LoadingButton>
    </RainbowEffect>
    </>
  );
};

export default FollowUnfollowButton;
