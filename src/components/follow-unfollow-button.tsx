// REACT IMPORTS
import { useState, useEffect, PropsWithChildren } from 'react';

// MUI IMPORTS
import LoadingButton from '@mui/lab/LoadingButton';

// REDUX IMPORTS
import { openLoginModal } from '@redux/auth';
import { useDispatch } from 'react-redux';
import { addFollower, removeFollower } from '@redux/followers';

// LOCAL IMPORTS
import Box from '@mui/material/Box';
import NeonPaper from '@src/sections/publication/components/neon-paper-container.tsx';
import { useNotifications } from '@src/hooks/use-notifications.ts';
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts';

// Notifications
import { notifyError, notifySuccess } from '@src/libs/notifications/internal-notifications';
import { useAuth } from '@src/hooks/use-auth.ts';
import { ERRORS } from '@src/libs/notifications/errors';
import { SUCCESS } from '@src/libs/notifications/success';
import {
  useGetIsFollowingLazyQuery,
  useGetUserLazyQuery,
  useToggleFollowMutation,
} from '@src/graphql/generated/hooks.tsx';
import { User } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

interface FollowUnfollowButtonProps {
  profileId: string;
  followButtonMinWidth?: number;
  size?: 'small' | 'medium' | 'large';
}

// ----------------------------------------------------------------------

const FollowUnfollowButton = ({
  profileId,
  size = 'medium',
  followButtonMinWidth = 120,
}: PropsWithChildren<FollowUnfollowButtonProps>) => {
  const dispatch = useDispatch();
  const [loadProfile, { data: profileData, loading: profileLoading }] = useGetUserLazyQuery({ fetchPolicy: 'cache-and-network' });
  const [toggleFollow, { loading: profileFollowLoading }] = useToggleFollowMutation();
  const [getIsFollowing, { data: isFollowingData, loading: isFollowingLoading }] = useGetIsFollowingLazyQuery();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const { session } = useAuth();
  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(session);
  const profile: User | null = profileData?.getUser;
  const isLoading = isProcessing || profileLoading || profileFollowLoading || isFollowingLoading;
  const RainbowEffect = isLoading ? NeonPaper : Box;

  useEffect(() => {
    if (profileId && profileId !== session?.address) loadProfile({variables: { address: profileId }});

    getIsFollowing({variables: { followerAddress: session?.address, targetAddress: profileId }});
  }, []);

  useEffect(() => {
    setIsProcessing(false);
    setIsFollowed(isFollowingData?.getIsFollowing ?? false);
  }, [isFollowingData]);

  const handleUpdateProfile = () => {
    loadProfile({variables: { address: profileId }});
  };

  // General function to handle follow/unfollow actions
  const handleAction = async () => {
    if (!profile) return;
    if (!session?.authenticated) return dispatch(openLoginModal());

    setIsProcessing(true);
    try {
      const result = await toggleFollow({ variables: { input: { targetAddress: profileId } } });

      notifySuccess(SUCCESS.FOLLOW_UNFOLLOW_SUCCESSFULLY, {
        actionLbl: result?.data?.toggleFollow ? 'followed' : 'unfollowed',
        profileName: profile?.displayName ?? 'no name',
      });

      setIsFollowed(result?.data?.toggleFollow);
      handleUpdateProfile();

      if (result?.data?.toggleFollow) {
        dispatch(addFollower(profile));
      } else {
        dispatch(removeFollower(profileId));
      }

      // Send notification to the profile being followed
      const notificationPayload = generatePayload(
        'FOLLOW',
        {
          id: profile.address,
          displayName: profile?.displayName ?? 'no name',
          avatar: profile?.profilePicture ?? '',
        },
        {
          rawDescription: `${session?.user?.displayName} now is following you`,
        }
      );

      await sendNotification(profile.address, session?.address ?? '', notificationPayload);
    } catch (err) {
      notifyError(ERRORS.FOLLOW_UNFOLLOW_OCCURRED_ERROR);
      console.log('Error while follow/unfollow: ', err)

    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <RainbowEffect
        {...((isLoading) && {
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
          disabled={isLoading || profile?.address === session?.address}
          loading={isLoading}
        >
          {isFollowed ? 'Unfollow' : 'Follow'}
        </LoadingButton>
      </RainbowEffect>
    </>
  );
};

export default FollowUnfollowButton;
