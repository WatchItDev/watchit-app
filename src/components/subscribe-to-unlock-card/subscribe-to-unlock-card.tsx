import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { IconLock, IconPlayerPlay } from '@tabler/icons-react';
import { ethers } from 'ethers';
import { useGetPolicyTerms } from '@src/hooks/protocol/use-get-policy-terms.ts';
import { Address } from 'viem';
import LoadingButton from '@mui/lab/LoadingButton';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useIsPolicyAuthorized } from '@src/hooks/protocol/use-is-policy-authorized.ts';
import { SponsoredAccessTrialButton } from '@src/components/sponsored-access-button/sponsored-access-button.tsx';
import { useGetCampaignIsActive } from '@src/hooks/protocol/use-get-campaign-is-active.ts';
import { useEffect } from 'react';
import { useGetSubscriptionCampaign } from '@src/hooks/protocol/use-get-subscription-campaign.ts';
import { SubscribeToUnlockCardProps } from '@src/components/subscribe-to-unlock-card/types.ts';

export const SubscribeToUnlockCard = ({
  onSubscribe,
  handleRefetchAccess,
  loadingSubscribe,
  post,
}: SubscribeToUnlockCardProps) => {
  const ownerAddress = post?.by?.ownedBy?.address
  const { terms } = useGetPolicyTerms(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS as Address,
    ownerAddress
  );
  const { isAuthorized } = useIsPolicyAuthorized(GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS, ownerAddress);
  const { campaign, fetchSubscriptionCampaign } = useGetSubscriptionCampaign();
  const { isActive, loading: isActiveLoading, fetchIsActive } = useGetCampaignIsActive();
  const durationDays = 30; // a month
  const totalCostWei = terms?.amount ? terms?.amount * BigInt(durationDays) : 0; // Calculate total cost in Wei: DAILY_COST_WEI * durationDays
  const totalCostMMC = ethers.formatUnits(totalCostWei, 18); // Converts Wei to MMC

  useEffect(() => {
    fetchSubscriptionCampaign(ownerAddress);
  }, []);

  useEffect(() => {
    if (!campaign || !ownerAddress) return;

    fetchIsActive(campaign, ownerAddress);
  }, [campaign, ownerAddress]);

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
        {isAuthorized && (
          <>
            {!isActive && !isActiveLoading && (
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
            )}
            {isActive && !isActiveLoading && (
              <SponsoredAccessTrialButton
                isActive={isActive}
                holderAddress={ownerAddress}
                campaignAddress={campaign}
                onSuccess={handleRefetchAccess}
                size="lg"
              />
            )}
            <Box sx={{ mt: 3, borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Join now for just <strong>{totalCostMMC} MMC/month</strong> and access to{' '}
                <strong>{post?.by?.stats?.posts}</strong> exclusive posts from{' '}
                <strong>{post?.by?.metadata?.displayName ?? post?.handle?.localName}!</strong>
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscribeToUnlockCard
