import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { IconLock, IconPlayerPlay } from '@tabler/icons-react';
import { ethers } from 'ethers';
import { useGetPolicyTerms } from '@src/hooks/use-get-policy-terms.ts';
import { Address } from 'viem';
import LoadingButton from '@mui/lab/LoadingButton';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import {Icon} from "@iconify/react";
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";
import {useState} from "react";
import {COLORS} from "@src/layouts/config-layout.ts";
import {styled} from "@mui/material/styles";

interface Props {
  post: any;
  onSubscribe: () => void;
  loadingSubscribe: boolean;
  subscribeDisabled: boolean;
}

export const SubscribeToUnlockCard = ({
  onSubscribe,
  loadingSubscribe,
  subscribeDisabled,
  post,
}: Props) => {
  const [loadingTrial, setLoadingTrial] = useState(false);

  const { terms } = useGetPolicyTerms(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS as Address,
    post?.by?.ownedBy?.address as Address
  );
  const durationDays = 30; // a month
  const totalCostWei = terms?.amount ? terms?.amount * BigInt(durationDays) : 0; // Calculate total cost in Wei: DAILY_COST_WEI * durationDays
  const totalCostMMC = ethers.formatUnits(totalCostWei, 18); // Converts Wei to MMC


  const handleTrial = () => {
    setLoadingTrial(true);
    setTimeout(() => {
      setLoadingTrial(false);
    }, 2000);
  };

  const RainbowEffect = loadingTrial ? NeonPaper : Box;

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

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}>

        <LoadingButton
          variant="contained"
          color="primary"
          sx={{ width: '100%', py: 1.5 }}
          onClick={onSubscribe}
          loading={loadingSubscribe}
          disabled={subscribeDisabled}
        >
          <IconPlayerPlay size={20} style={{ marginRight: 5 }} />
          Join
        </LoadingButton>
        <RainbowEffect borderRadius={'10px'}
                   animationSpeed={'3s'}
                   padding={'2px'}
                   width={'auto'}>

          <StyledBoxGradient onClick={handleTrial} loading={loadingTrial}>
            <Icon icon="ic:outline-try" width="18" height="18" />
            <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: '700', ml: 1 }}>
              Free trial
            </Typography>
          </StyledBoxGradient>
        </RainbowEffect>
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
  background: `linear-gradient(90deg, rgba(254,255,118,1) 25%, rgba(212,190,58,1) 50%, rgba(189,119,255,0.5) 100%)`,
  backgroundSize: '400%',
  animation: 'gradientShift 10s infinite',
  padding: '12px',
  color: COLORS.GRAY_DARK,
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
