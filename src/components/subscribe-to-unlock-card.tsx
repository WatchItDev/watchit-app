import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { IconLock, IconPlayerPlay } from '@tabler/icons-react';
import { ethers } from 'ethers';
import { useGetPolicyTerms } from '@src/hooks/use-get-policy-terms.ts';
import { Address } from 'viem';
import LoadingButton from '@mui/lab/LoadingButton';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useIsPolicyAuthorized } from '@src/hooks/use-is-policy-authorized.ts';

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
  const ownerAddress = post?.by?.ownedBy?.address as Address
  const { terms } = useGetPolicyTerms(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS as Address,
    ownerAddress
  );
  const { isAuthorized } = useIsPolicyAuthorized(GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS, ownerAddress);
  const durationDays = 30; // a month
  const totalCostWei = terms?.amount ? terms?.amount * BigInt(durationDays) : 0; // Calculate total cost in Wei: DAILY_COST_WEI * durationDays
  const totalCostMMC = ethers.formatUnits(totalCostWei, 18); // Converts Wei to MMC

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
            <LoadingButton
              variant="contained"
              color="primary"
              sx={{ width: '100%', py: 1.5 }}
              onClick={onSubscribe}
              loading={loadingSubscribe}
              // disabled={subscribeDisabled}
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
      </CardContent>
    </Card>
  );
};
