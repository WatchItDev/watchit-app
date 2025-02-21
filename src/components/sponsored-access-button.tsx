// REACT IMPORTS
import { FC } from 'react';

// VIEM IMPORTS
import { Address } from 'viem';

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { openLoginModal } from '@redux/auth';

// MUI IMPORTS
import { Box, Typography } from '@mui/material';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';

// ICONS IMPORTS
import { Icon } from '@iconify/react';

// LOCAL IMPORTS
import NeonPaper from '@src/sections/publication/NeonPaperContainer.tsx';
import { useSponsoredAccessAgreement } from '@src/hooks/use-sponsored-access-agreement.ts';

interface SponsoredAccessProps {
  holderAddress: Address;
  campaignAddress: Address;
  policyAddress: Address;
  userAddress?: Address;
  isActive: boolean;
  neonPaperProps?: object;
  buttonProps?: LoadingButtonProps;
}

export const SponsoredAccessTrialButton: FC<SponsoredAccessProps> = ({
                                                                       holderAddress,
                                                                       campaignAddress,
                                                                       policyAddress,
                                                                       userAddress,
                                                                       isActive,
                                                                       neonPaperProps,
                                                                       buttonProps
                                                                     }) => {
  const dispatch = useDispatch();
  const sessionData = useSelector((state: any) => state.auth.session);

  const { sponsoredAccessAgreement, loading } = useSponsoredAccessAgreement();

  const handleTrial = async () => {
    try {
      if (!sessionData?.authenticated) {
        return dispatch(openLoginModal());
      }

      await sponsoredAccessAgreement({
        holder: holderAddress,
        campaignAddress,
        policyAddress,
        parties: userAddress ? [userAddress] : [],
        payload: '0x',
      });
    } catch (error) {
      console.error('Error trying to execute sponsored access agreement', error);
    }
  };

  const RainbowEffect = loading ? NeonPaper : Box;

  if (!isActive) return null;

  return (
    <RainbowEffect {...neonPaperProps}>
      <StyledBoxGradient onClick={handleTrial} loading={loading} {...buttonProps}>
        <Icon icon="ic:outline-try" width="18" height="18" />
        <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: '700', ml: 1 }}>
          Free trial
        </Typography>
      </StyledBoxGradient>
    </RainbowEffect>
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
