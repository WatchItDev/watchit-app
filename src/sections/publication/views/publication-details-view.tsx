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
import { useGetSubscriptionCampaign } from '@src/hooks/protocol/use-get-subscription-campaign.ts';
import { PublicationTitleDescription } from '@src/sections/publication/components/publication-description.tsx';
import { PublicationRecommendations } from '@src/sections/publication/components/publication-recommendations.tsx';
import { PublicationPosterWallpaper } from '@src/sections/publication/components/publication-poster-wallpaper.tsx';
import { PublicationSponsorsAndBackers } from '@src/sections/publication/components/publication-sponsors-and-bakers.tsx';
import { PublicationSponsoredButton } from '@src/sections/publication/components/publication-sponsored-button.tsx';
import { PublicationJoinButton } from '@src/sections/publication/components/publication-join-button.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useGetPostLazyQuery, useGetPostsByAuthorLazyQuery } from '@src/graphql/generated/hooks.tsx';
import { Post } from '@src/graphql/generated/graphql.ts';
import { Address } from 'viem';

// ----------------------------------------------------------------------

export default function PublicationDetailsView({ id }: Readonly<PublicationDetailsViewProps>) {
  // STATES HOOKS
  const dispatch = useDispatch();
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);
  const { session, isAuthLoading } = useAuth();
  const [loadPublication, { data: publicationData, loading: publicationLoading }] = useGetPostLazyQuery();
  const publication: Post = publicationData?.getPost;
  const ownerAddress: Address = publication?.author?.address as Address;
  const { hasAccess, loading: accessLoading, fetch: refetchAccess } = useHasAccess(ownerAddress);
  const { isAuthorized, loading: isAuthorizedLoading } = useIsPolicyAuthorized(GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS, ownerAddress);
  const { campaign, loading: campaignLoading, fetchSubscriptionCampaign } = useGetSubscriptionCampaign();
  const { isActive: isCampaignActive, loading: isActiveLoading, fetchIsActive } = useGetCampaignIsActive();
  const [loadPublications, { data: profilePublications, loading: profilePublicationsLoading }] = useGetPostsByAuthorLazyQuery();

  const isAccessFullyChecked = !accessLoading && !isAuthorizedLoading && !isActiveLoading && !campaignLoading;
  const allLoaded = !publicationLoading && !isAuthLoading && !profilePublicationsLoading && isAccessFullyChecked;
  const isSponsoredButtonVisible = isCampaignActive && isAuthorized && isAccessFullyChecked;
  const isJoinButtonVisible = isAuthorized && !isCampaignActive && isAccessFullyChecked && !isSponsoredButtonVisible;
  const isPlayerVisible = hasAccess && session.authenticated && !accessLoading && !isAuthLoading;

  useEffect(() => {
    if (!ownerAddress || publicationLoading) return;
    fetchSubscriptionCampaign(ownerAddress);
    loadPublications({variables: { author: ownerAddress, limit: 50 }});
  }, [ownerAddress, publicationLoading]);

  useEffect(() => {
    if (!campaign || !session?.address) return;
    fetchIsActive(campaign, session?.address);
  }, [campaign, session?.address]);

  useEffect(() => {
    loadPublication({variables: { getPostId: id }});
  }, [id]);

  const handleSubscribe = () => {
    if (!session.authenticated) {
      dispatch(openLoginModal());
      return;
    }
    setOpenSubscribeModal(true);
  }

  const handleRefetchAccess = () => {
    refetchAccess();
  }

  const filteredPublications = profilePublications?.getPostsByAuthor?.filter((publication: Post) => publication.id !== id) ?? [];

  if (!allLoaded) return <LoadingScreen />;

  return (
    <>
      <StyledContainer>
        <StyledStack>
          <StyledCard>
            <StyledCardContent>
              {isPlayerVisible ? (
                <MoviePlayView publication={publication} loading={publicationLoading} />
              ) : (
                <PublicationPosterWallpaper publication={publication}>
                  {isSponsoredButtonVisible && (
                    <PublicationSponsoredButton
                      isActive={isCampaignActive}
                      publication={publication}
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
                <PublicationTitleDescription publication={publication} />
                <PublicationSponsorsAndBackers />
                <PublicationRecommendations author={publication?.author?.displayName.split(' ')[0]} publications={filteredPublications}  />
              </StyledInnerBox>
            </StyledCardContent>
          </StyledCard>
        </StyledStack>

        <PublicationDetailMain
          post={publication}
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
        profile={publication?.author}
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
