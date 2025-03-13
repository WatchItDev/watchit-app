// REACT IMPORTS
import { PropsWithChildren, useEffect } from 'react';

// Redux
import { useSelector } from 'react-redux';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

// LENS IMPORTS
import { appId, PublicationType, usePublications } from '@lens-protocol/react-web';

// VIEM IMPORTS
import { Address } from 'viem';

// LOCAL IMPORTS
import ProfileCover from './profile-cover.tsx';
import FollowUnfollowButton from '@src/components/follow-unfollow-button.tsx';
import { useHasAccess } from '@src/hooks/protocol/use-has-access.ts';
import { useIsPolicyAuthorized } from '@src/hooks/protocol/use-is-policy-authorized.ts';
import { useGetPolicyAttestation } from '@src/hooks/protocol/use-get-policy-attestation.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

// Profile Components
import ProfileReport from '@src/sections/user/components/profile-report.tsx';
import ProfileRightSidebar from "@src/sections/user/components/profile-right-sidebar.tsx";
import ProfileJoin from "@src/sections/user/components/profile-join.tsx";
import ProfileUserInfo from "@src/sections/user/components/profile-user-info.tsx";
import ProfileWrapper from './profile-wrapper.tsx';
import ProfileToolbar from "@src/sections/user/components/profile-toolbar.tsx";
import { useGetSubscriptionCampaign } from '@src/hooks/protocol/use-get-subscription-campaign.ts';
import { useGetCampaignIsActive } from '@src/hooks/protocol/use-get-campaign-is-active.ts';
import { SponsoredAccessTrialButton } from '@src/components/sponsored-access-button/sponsored-access-button.tsx';
import { ProfileHeaderProps } from '@src/sections/user/types.ts';
import {RootState} from "@redux/store.ts"

// ----------------------------------------------------------------------

const ProfileHeader = (props: PropsWithChildren<ProfileHeaderProps>) => {
  const { profile: profileData, children } = props;
  const sessionData = useSelector((state: RootState) => state.auth.session);
  const profile =
    sessionData && sessionData?.profile?.id === profileData?.id ? sessionData.profile : profileData;

  const {
    attestation,
    loading: attestationLoading,
    refetch: refetchAttestation,
  } = useGetPolicyAttestation(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    sessionData?.profile?.ownedBy?.address as Address,
    profile?.ownedBy?.address as Address
  );
  const {
    hasAccess,
    loading: accessLoading,
    fetch: refetchAccess,
  } = useHasAccess(profile?.ownedBy?.address as Address);
  const { isAuthorized, loading: authorizedLoading } = useIsPolicyAuthorized(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    profile?.ownedBy?.address as Address
  );
  const { campaign, fetchSubscriptionCampaign } = useGetSubscriptionCampaign();
  const { isActive, loading: isActiveLoading, fetchIsActive } = useGetCampaignIsActive();
  const showJoinButton = isAuthorized && (!isActive || hasAccess) && !isActiveLoading && !authorizedLoading && profile?.id !== sessionData?.profile?.id;
  const showSponsoredAccessButton = isActive && isAuthorized && !isActiveLoading && !authorizedLoading && !hasAccess;

  usePublications({
    where: {
      from: [...(profile?.id ? [profile.id] : [])],
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
  });

  useEffect(() => {
    fetchSubscriptionCampaign(profile?.ownedBy?.address);
  }, []);

  useEffect(() => {
    if (!campaign || !profile?.ownedBy?.address) return;

    fetchIsActive(campaign, profile?.ownedBy?.address);
  }, [campaign, profile?.ownedBy?.address]);

  // Function to handle following a profile
  const onSubscribe = async () => {
    refetchAccess();
    refetchAttestation();
  };

  const profileImage = (profile?.metadata?.picture as any)?.optimized?.uri;

  return (
    <Box sx={{ my: 3, position: 'relative' }}>
      <ProfileCover profile={profile} sx={{ height: { xs: 200, md: 300 } }} />

      {sessionData?.authenticated ? <ProfileReport profile={profile} /> : <></>}

      <ProfileWrapper sidebar={<ProfileRightSidebar profile={profile} sidebarProps={{
        attestationLoading, attestation, hasAccess, accessLoading, isAuthorized, authorizedLoading
      }} />}>

        <ProfileToolbar profile={profile} profileImage={profileImage} />

        <Stack
          direction="column"
          sx={{ width: '100%', maxWidth: { xs: 'calc(100% - 2rem)', md: '100%' } }}
        >

          <ProfileUserInfo profile={profile} />

          <Stack direction="row" sx={{ width: '100%', mb: 2, gap: 2, flexWrap: 'wrap' }}>
            {authorizedLoading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  maxWidth: '100%',
                  flexWrap: 'wrap',
                }}
              >
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              </Box>
            )}

            { showJoinButton && (
              <ProfileJoin profile={profile} profileJoinProps={{
                hasAccess, accessLoading, onSubscribe
              }} />
            )}

            {
              showSponsoredAccessButton && (
                <SponsoredAccessTrialButton
                  isActive={isActive}
                  holderAddress={profile?.ownedBy?.address as Address}
                  campaignAddress={campaign}
                  onSuccess={onSubscribe}
                />
              )
            }

            {profile?.id !== sessionData?.profile?.id && (
              <FollowUnfollowButton profileId={profile?.id} />
            )}

          </Stack>
        </Stack>
      </ProfileWrapper>
      {children}
    </Box>
  );
};

export default ProfileHeader;
