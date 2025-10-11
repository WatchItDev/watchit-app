// REACT IMPORTS
import { useState, useEffect, PropsWithChildren } from 'react';

// MUI IMPORTS
import LoadingButton from '@mui/lab/LoadingButton';

// REDUX IMPORTS
import { openLoginModal } from '@redux/auth';
import { useDispatch } from 'react-redux';

// LOCAL IMPORTS
import Box from '@mui/material/Box';
import NeonPaper from '@src/sections/publication/components/neon-paper-container.tsx';
import { useNotifications } from '@src/hooks/use-notifications.ts';
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts';

// Notifications
import {
  notifyError,
  notifySuccess,
} from '@src/libs/notifications/internal-notifications';
import { useAuth } from '@src/hooks/use-auth.ts';
import { ERRORS } from '@src/libs/notifications/errors';
import { SUCCESS } from '@src/libs/notifications/success';
import {
  useGetUserLazyQuery,
} from '@src/graphql/generated/hooks.tsx';
import { User } from '@src/graphql/generated/graphql.ts';
import { EdgeState } from '@src/graphql/generated/graphql';
import { useGetEdgeStatusLazyQuery, useSetEdgeStatusMutation } from '@src/graphql/hooks/edge';

// ----------------------------------------------------------------------

interface FollowUnfollowButtonProps {
  profileId: string;
  onActionFinish?: () => void;
  followButtonMinWidth?: number;
  size?: 'small' | 'medium' | 'large';
}

// ----------------------------------------------------------------------

const FollowUnfollowButton = ({
  profileId,
  size = 'medium',
  followButtonMinWidth = 120,
  onActionFinish = () => {},
}: PropsWithChildren<FollowUnfollowButtonProps>) => {
  const dispatch = useDispatch();
  const [loadProfile, { data: profileData, loading: profileLoading }] = useGetUserLazyQuery();
  const [setEdgeStatus, { loading: edgeMutationLoading }] = useSetEdgeStatusMutation();
  const [
    loadEdgeStatus,
    { data: edgeStatusData, loading: edgeStatusLoading },
  ] = useGetEdgeStatusLazyQuery();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const { session } = useAuth();
  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(session);
  const profile: User | null = profileData?.getUser;
  const isLoading =
    isProcessing ||
    profileLoading ||
    edgeMutationLoading ||
    edgeStatusLoading;
  const RainbowEffect = isLoading ? NeonPaper : Box;

  useEffect(() => {
    if (!profileId) return;
    loadProfile({ variables: { input: { address: profileId } } });
  }, [loadProfile, profileId]);

  useEffect(() => {
    if (!profile?.id) return;
    setIsProcessing(true);
    loadEdgeStatus({ variables: { input: { toUserId: profile.id } } })
      .then((result) => {
        setIsFollowed(result.data?.getEdgeStatus?.isFollowing ?? false);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [loadEdgeStatus, profile?.id]);

  const handleUpdateProfile = () => {
    loadProfile({ variables: { input: { address: profileId } } });
  };

  // General function to handle follow/unfollow actions
  const handleAction = async () => {
    if (!profile) return;
    if (!session?.authenticated) return dispatch(openLoginModal());

    setIsProcessing(true);
    try {
      const nextState = !isFollowed;
      await setEdgeStatus({
        variables: {
          input: {
            toUserId: profile.id,
            status: nextState ? EdgeState.Follow : EdgeState.None,
          },
        },
      });

      notifySuccess(SUCCESS.FOLLOW_UNFOLLOW_SUCCESSFULLY, {
        actionLbl: nextState ? 'followed' : 'unfollowed',
        profileName: profile?.displayName ?? 'no name',
      });

      setIsFollowed(nextState);
      handleUpdateProfile();
      onActionFinish();

      // Send notification to the profile being followed
      const notificationPayload = generatePayload(
        'FOLLOW',
        {
          id: profile.address,
          displayName: profile?.displayName ?? 'no name',
          avatar: profile?.profile?.picture ?? '',
        },
        {
          rawDescription: `${session?.user?.displayName} now is following you`,
        },
      );

      await sendNotification(
        profile.address,
        session?.address ?? '',
        notificationPayload,
      );
    } catch (err) {
      notifyError(ERRORS.FOLLOW_UNFOLLOW_OCCURRED_ERROR);
      console.log('Error while follow/unfollow: ', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <RainbowEffect
        {...(isLoading && {
          borderRadius: '10px',
          animationSpeed: '3s',
          padding: '0',
          width: 'auto',
        })}
      >
        <LoadingButton
          size={size}
          title={isFollowed ? 'Unfollow' : 'Follow'}
          variant={isFollowed ? 'outlined' : 'contained'}
          sx={{
            minWidth: { xs: 90, md: followButtonMinWidth },
            backgroundColor: isFollowed ? '#24262A' : '#fff',
          }}
          onClick={(event) => {
            event.stopPropagation();
            handleAction();
          }}
          disabled={isLoading || !profile || profile?.address === session?.address}
          loading={isLoading}
        >
          {isFollowed ? 'Unfollow' : 'Follow'}
        </LoadingButton>
      </RainbowEffect>
    </>
  );
};

export default FollowUnfollowButton;
