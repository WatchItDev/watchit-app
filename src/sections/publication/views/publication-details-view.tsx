// REACT IMPORTS
import { useEffect, useState } from 'react';

// REDUX IMPORTS
import { openLoginModal } from '@redux/auth';
import { useDispatch } from 'react-redux'

// MUI IMPORTS
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';

// LENS IMPORTS
import { usePublication } from '@lens-protocol/react';
import { AnyPublication } from '@lens-protocol/api-bindings';
import { appId, PublicationType, usePublications } from '@lens-protocol/react-web';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';

// LOCAL IMPORTS
import MoviePlayView from '@src/sections/publication/components/publication-player.tsx';
import PublicationDetailMain from '@src/components/publication-detail-main';
import { useAuth } from '@src/hooks/use-auth.ts';
import { LoadingScreen } from '@src/components/loading-screen';
import { useHasAccess } from '@src/hooks/protocol/use-has-access.ts';
import { useGetCampaignIsActive } from '@src/hooks/protocol/use-get-campaign-is-active.ts';
import { useIsPolicyAuthorized } from '@src/hooks/protocol/use-is-policy-authorized.ts';
import { PublicationDetailsViewProps } from '@src/sections/publication/types.ts';
import { SubscribeProfileModal } from '@src/components/subscribe-profile-modal.tsx';
import { PublicationHidden } from '@src/sections/publication/components/publication-hidden.tsx';
import { useGetSubscriptionCampaign } from '@src/hooks/protocol/use-get-subscription-campaign.ts';
import { PublicationTitleDescription } from '@src/sections/publication/components/publication-description.tsx';
import { PublicationRecommendations } from '@src/sections/publication/components/publication-recommendations.tsx';
import { PublicationPosterWallpaper } from '@src/sections/publication/components/publication-poster-wallpaper.tsx';
import { PublicationSponsorsAndBackers } from '@src/sections/publication/components/publication-sponsors-and-bakers.tsx';
import { PublicationSponsoredButton } from '@src/sections/publication/components/publication-sponsored-button.tsx';
import { PublicationJoinButton } from '@src/sections/publication/components/publication-join-button.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

// ----------------------------------------------------------------------

export default function PublicationDetailsView({ id }: Readonly<PublicationDetailsViewProps>) {
  // STATES HOOKS
  const dispatch = useDispatch();
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);
  const { isFullyAuthenticated: isAuthenticated, isSessionLoading: sessionLoading, session: sessionData } = useAuth();
  const { data: publicationData, loading: publicationLoading }: ReadResult<AnyPublication> = usePublication({ forId: id });
  const ownerAddress = publicationData?.by?.ownedBy?.address;
  const { hasAccess, loading: accessLoading, fetch: refetchAccess } = useHasAccess(ownerAddress);
  const { isAuthorized, loading: isAuthorizedLoading } = useIsPolicyAuthorized(GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS, ownerAddress);
  const { campaign, loading: campaignLoading, fetchSubscriptionCampaign } = useGetSubscriptionCampaign();
  const { isActive: isCampaignActive, loading: isActiveLoading, fetchIsActive } = useGetCampaignIsActive();
  const { data: publications, loading: pubsLoading } = usePublications({
    where: {
      from: [publicationData?.by?.id],
      publicationTypes: [PublicationType.Post],
      metadata: { publishedOn: [appId('watchit')] },
    },
  });

  const isAccessFullyChecked = !accessLoading && !isAuthorizedLoading && !isActiveLoading && !campaignLoading;
  const allLoaded = !publicationLoading && !sessionLoading && !pubsLoading && isAccessFullyChecked;
  const isSponsoredButtonVisible = isCampaignActive && isAuthorized && isAccessFullyChecked;
  const isJoinButtonVisible = isAuthorized && !isCampaignActive && isAccessFullyChecked && !isSponsoredButtonVisible;
  const isPlayerVisible = hasAccess && isAuthenticated && !accessLoading && !sessionLoading;

  useEffect(() => {
    if (!ownerAddress || publicationLoading) return;
    fetchSubscriptionCampaign(ownerAddress);
  }, [ownerAddress, publicationLoading]);

  useEffect(() => {
    if (!campaign || !sessionData?.address) return;
    fetchIsActive(campaign, sessionData?.address);
  }, [campaign, sessionData?.address]);

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal());
      return;
    }
    setOpenSubscribeModal(true);
  }

  const handleRefetchAccess = () => {
    refetchAccess();
  }

  const filteredPublications = publications?.filter((publication) => publication.id !== id) ?? [];

  if (!allLoaded) return <LoadingScreen />;
  if (publicationData.isHidden) return <PublicationHidden />;

  return (
    <>
      <StyledContainer>
        <StyledStack>
          <StyledCard>
            <StyledCardContent>
              {isPlayerVisible ? (
                <MoviePlayView publication={publicationData} loading={publicationLoading} />
              ) : (
                <PublicationPosterWallpaper publication={publicationData}>
                  {isSponsoredButtonVisible && (
                    <PublicationSponsoredButton
                      isActive={isCampaignActive}
                      publication={publicationData}
                      campaign={campaign}
                      onSponsorSuccess={handleRefetchAccess}
                    />
                  )}
                  {isJoinButtonVisible && (
                    <PublicationJoinButton
                      joinButtonLoading={accessLoading}
                      onJoin={handleSubscribe}
                    />
                  )}
                </PublicationPosterWallpaper>
              )}
              <StyledInnerBox>
                <PublicationTitleDescription publication={publicationData} />
                <PublicationSponsorsAndBackers />
                <PublicationRecommendations author={publicationData?.by?.metadata?.displayName.split(' ')[0]} publications={filteredPublications}  />
              </StyledInnerBox>
            </StyledCardContent>
          </StyledCard>
        </StyledStack>

        <PublicationDetailMain
          post={publicationData}
          handleSubscribe={handleSubscribe}
          handleRefetchAccess={handleRefetchAccess}
          loadingSubscribe={accessLoading}
          subscribeDisabled={accessLoading || hasAccess}
          hasAccess={!!hasAccess}
        />
      </StyledContainer>
      <SubscribeProfileModal
        isOpen={openSubscribeModal}
        onClose={() => setOpenSubscribeModal(false)}
        onSubscribe={handleRefetchAccess}
        profile={publicationData?.by}
      />
    </>
  );
}

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxHeight: '100%',
  position: 'relative',
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  }
}));

const StyledStack = styled(Stack)(() => ({
  display: 'flex',
  flexGrow: 1,
}));

const StyledCard = styled(Card)(() => ({
  width: '100%',
}));

const StyledCardContent = styled(CardContent)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInnerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginBottom: 2,
  padding: '0 !important',
  [theme.breakpoints.up('md')]: {
    marginBottom: 8,
  }
}));
