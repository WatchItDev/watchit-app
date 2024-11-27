import { Box, Button, Card, CardContent, Typography, Stack } from '@mui/material';
import { IconLock, IconPlayerPlay } from '@tabler/icons-react';
import { ethers } from 'ethers';
import { useResolveTerms } from '@src/hooks/use-resolve-terms.ts';
import { Address } from 'viem';

interface Props {
  post: any
  onSubscribe: () => void
}

export const SubscribeToUnlockCard = ({ onSubscribe, post }: Props) => {
  const { terms } = useResolveTerms(post?.by?.ownedBy?.address as Address);
  const durationDays = 30; // a month
  const totalCostWei = terms?.amount ? (terms?.amount * BigInt(durationDays)) : 0; // Calculate total cost in Wei: DAILY_COST_WEI * durationDays
  const totalCostMMC = ethers.formatUnits(totalCostWei, 18); // Converts Wei to MMC

  return (
    <Card sx={{ maxWidth: {
      xs: '100%',
        lg: 500
      }, margin: 'auto', backgroundColor: '#2B2D31', color: 'white', borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconLock fontSize="large" size={20} />
          <Typography variant="h6" fontWeight="bold">
            Join to play
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mb: 3 }}>
          This content is only available to our subscribers. Join our growing community and gain access to exclusive posts, behind-the-scenes content, and more!
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: '100%', py: 1.5 }}
          onClick={onSubscribe}
        >
          <IconPlayerPlay size={20} style={{marginRight: 5}} />
          Join
        </Button>
        <Box sx={{ mt: 3, borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Join now for only <strong>{totalCostMMC} MMC/month</strong> and access to <strong>{post?.by?.stats?.posts}</strong> exclusive posts from <strong>{post?.by?.metadata?.displayName ?? post?.handle?.localName}!</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
