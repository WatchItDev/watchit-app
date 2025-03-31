// REACT IMPORTS
import { PropsWithChildren, useEffect } from 'react';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

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
import { useAuth } from '@src/hooks/use-auth.ts';
import { ProfileHeaderProps } from '@src/sections/user/types.ts';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

const ProfileHeader = (props: PropsWithChildren<ProfileHeaderProps>) => {
  const { profile: profileData, children } = props;
  const { session: sessionData, isSessionLoading } = useAuth();
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
    if (!campaign || !sessionData?.address) return;
    fetchIsActive(campaign, sessionData?.address);
  }, [campaign, sessionData?.address]);

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
            {authorizedLoading || isSessionLoading || (!showJoinButton && !showSponsoredAccessButton && isAuthorized) && (
              <LoadingButton
                variant={'contained'}
                sx={{
                  minWidth: { xs: 90, md: 120 },
                  height: 38,
                  minHeight: 38,
                  maxHeight: 38,
                  backgroundColor: '#24262A',
                }}
                disabled={true}
                loading={true}
              />
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
