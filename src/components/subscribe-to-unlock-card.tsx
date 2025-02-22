import { useEffect } from 'react';
import { Address } from 'viem';
import { ethers } from 'ethers';
import { IconLock, IconPlayerPlay } from '@tabler/icons-react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';

import { useGetPolicyTerms } from '@src/hooks/use-get-policy-terms.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useIsPolicyAuthorized } from '@src/hooks/use-is-policy-authorized.ts';
import NeonPaper from '@src/sections/publication/NeonPaperContainer.tsx';
import { useGetSubscriptionCampaign } from '@src/hooks/use-get-subscription-campaign.ts';
import { useGetCampaignIsActive } from '@src/hooks/use-get-campaign-is-active.ts';

import { useSponsoredAccessAgreement } from '@src/hooks/use-sponsored-access-agreement.ts';
import { openLoginModal } from '@redux/auth';

interface Props {
  post: any;
  onSubscribe: () => void;
  loadingSubscribe: boolean;
  subscribeDisabled: boolean;
}

export const SubscribeToUnlockCard = ({
                                        onSubscribe,
                                        loadingSubscribe,
                                        post,
                                      }: Props) => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const ownerAddress = post?.by?.ownedBy?.address as Address;
  const { terms } = useGetPolicyTerms(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS as Address,
    ownerAddress
  );
  const { isAuthorized } = useIsPolicyAuthorized(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    ownerAddress
  );
  const { campaign, fetchSubscriptionCampaign } = useGetSubscriptionCampaign();
  const { isActive, fetchIsActive } = useGetCampaignIsActive();
  const { sponsoredAccessAgreement, loading } = useSponsoredAccessAgreement();
  const durationDays = 30; // un mes
  const totalCostWei = terms?.amount ? terms?.amount * BigInt(durationDays) : 0;
  const totalCostMMC = ethers.formatUnits(totalCostWei, 18);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSubscriptionCampaign(ownerAddress);
  }, [fetchSubscriptionCampaign, ownerAddress]);

  useEffect(() => {
    if (!campaign || !ownerAddress) return;
    fetchIsActive(campaign, ownerAddress);
  }, [campaign, ownerAddress, fetchIsActive]);

  const handleTrial = async () => {
    try {
      if (!sessionData?.authenticated) return dispatch(openLoginModal());

      await sponsoredAccessAgreement({
        holder: ownerAddress,
        campaignAddress: campaign,
        policyAddress: GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
        parties: [sessionData?.address],
        payload: '',
      });
    } catch (e) {
      console.error('Error en handleTrial:', e);
    }
  };

  const RainbowEffect = loading ? NeonPaper : Box;

  return (
    <Card
      sx={{
        maxWidth: {
          xs: '100%',
          lg: 500,
        },
        margin: 'auto',
        backgroundColor: '#2B2D31',
        color: 'white',
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconLock fontSize="large" size={20} />
          <Typography variant="h6" fontWeight="bold">
            Join to Watch
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mb: 3 }}>
          This content is exclusively for members. Become part of our growing community to access
          behind-the-scenes content, exclusive posts, and much more!
        </Typography>

        {/* Botón de suscripción normal */}
        {isAuthorized && (
          <>
            <LoadingButton
              variant="contained"
              color="primary"
              sx={{ width: '100%', py: 1.5 }}
              onClick={onSubscribe}
              loading={loadingSubscribe}
            >
              <IconPlayerPlay size={20} style={{ marginRight: 5 }} />
              Join
            </LoadingButton>
            <Box sx={{ mt: 3, borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Join now for just <strong>{totalCostMMC} MMC/month</strong> and access to{' '}
                <strong>{post?.by?.stats?.posts}</strong> exclusive posts from{' '}
                <strong>{post?.by?.metadata?.displayName ?? post?.handle?.localName}!</strong>
              </Typography>
            </Box>
          </>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <LoadingButton
            variant="contained"
            color="primary"
            sx={{ width: '100%', py: 1.5 }}
            onClick={onSubscribe}
            loading={loadingSubscribe}
          >
            <IconPlayerPlay size={20} style={{ marginRight: 5 }} />
            Join
          </LoadingButton>

          {isActive && (
            <RainbowEffect borderRadius={'10px'} animationSpeed={'3s'} padding={'2px'} width={'auto'}>
              <StyledBoxGradient onClick={handleTrial} loading={loading}>
                <Icon icon="ic:outline-try" width="18" height="18" />
                <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: '700', ml: 1 }}>
                  Free trial
                </Typography>
              </StyledBoxGradient>
            </RainbowEffect>
          )}
        </Box>

        <Box sx={{ mt: 3, borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Join now for just <strong>{totalCostMMC} MMC/month</strong> and access to{' '}
            <strong>{post?.by?.stats?.posts}</strong> exclusive posts from{' '}
            <strong>{post?.by?.metadata?.displayName ?? post?.handle?.localName}!</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const StyledBoxGradient = styled(LoadingButton)(() => ({
  width: '100%',
  background: `linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(70,31,97,1) 50%, rgba(149,17,238,1) 100%)`,
  backgroundSize: '400%',
  animation: 'gradientShift 10s infinite',
  padding: '16px',
  color: 'white',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));
