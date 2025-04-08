// REACT IMPORTS
import { FC } from 'react';

// REDUX IMPORTS
import { useDispatch } from 'react-redux';
import { openLoginModal } from '@redux/auth';

// MUI IMPORTS
import { Box, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';

// ICONS IMPORTS
import { Icon } from '@iconify/react';

// LOCAL IMPORTS
import NeonPaper from '@src/sections/publication/components/neon-paper-container.tsx';
import { useSponsoredAccessAgreement } from '@src/hooks/protocol/use-sponsored-access-agreement.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { ExtendedSponsoredAccessProps } from '@src/components/sponsored-access-button/types.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

export const SponsoredAccessTrialButton: FC<ExtendedSponsoredAccessProps> = (props) => {
  const {
    holderAddress,
    campaignAddress,
    isActive,
    neonPaperProps,
    buttonProps,
    onSuccess,
    size = 'sm',
  } = props;
  const dispatch = useDispatch();
  const { session: sessionData, isFullyAuthenticated: isAuthenticated } = useAuth();
  const { sponsoredAccessAgreement, loading } = useSponsoredAccessAgreement();


  const handleTrial = async () => {
    try {
      if (!isAuthenticated) {
        return dispatch(openLoginModal());
      }

      await sponsoredAccessAgreement({
        holder: holderAddress,
        campaignAddress,
        policyAddress: GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
        parties: sessionData?.address ? [sessionData?.address] : [],
        payload: '',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error trying to execute sponsored access agreement', error);
    }
  };


  const computedNeonPaperProps =
    size === 'sm'
      ? {
        borderRadius: '10px',
        width: 'auto',
        height: '38px',
        sx: {
          height: '38px',
        },
        ...(loading && { animationSpeed: '3s' }),
        ...neonPaperProps,
      }
      : neonPaperProps;

  const computedButtonProps =
    size === 'sm'
      ? {
        sx: {
          width: '100%',
          height: '100%',
          maxHeight: '38px',
        },
        ...buttonProps,
      }
      : buttonProps;

  const RainbowEffect = loading ? NeonPaper : Box;

  if (!isActive) return null;

  return (
    <RainbowEffect {...computedNeonPaperProps} padding={loading ? '2px' : '0'}>
      <StyledBoxGradient onClick={handleTrial} loading={loading} {...computedButtonProps}>
        <Icon icon="cil:media-play" width="18" height="18" />
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1,
            fontWeight: '700',
            ml: 1,
            display: { xs: size === 'sm' ? 'none' : 'flex', md: 'flex' }
          }}
        >
          Free trial
        </Typography>
      </StyledBoxGradient>
    </RainbowEffect>
  );
};

export default SponsoredAccessTrialButton;

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
