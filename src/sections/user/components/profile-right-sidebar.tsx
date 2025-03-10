import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CopyableText } from "@src/components/copyable-text";
import Divider from "@mui/material/Divider";
import { truncateAddress } from "@src/utils/wallet.ts";
import { OpenableText } from "@src/components/openable-text";
import Box from "@mui/material/Box";
import { randomColors } from "@src/components/poster/variants/poster-latest-content.tsx";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";
import { FC } from "react";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {ProfileHeaderProps} from "@src/sections/user/types.ts"
import {GLOBAL_CONSTANTS} from "@src/config-global.ts"

interface ProfileRightSidebarProps extends ProfileHeaderProps {
  sidebarProps: {
    isAuthorized?: boolean;
    attestation?: string;
    hasAccess?: boolean;
    accessLoading: boolean;
    authorizedLoading: boolean;
    attestationLoading: boolean;
  }
}

const ProfileRightSidebar: FC<ProfileRightSidebarProps> = ({ profile, sidebarProps }) => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const { isAuthorized, authorizedLoading, accessLoading, hasAccess, attestation, attestationLoading } = sidebarProps;
  const hex = BigInt(attestation ?? '').toString(16)
  // add padding to attestation smaller than 256 bits
  const cleanedHex = hex.length < 64 ? `${'0'.repeat(64 - hex.length)}${hex}` : hex;
  const attestationAddress = `0x${cleanedHex}`;

  return (
    <Stack
      direction="column"
      gap={2}
      sx={{
        zIndex: 10,
        p: 2,
        alignItems: 'flex-start',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        width: {
          xs: '100%',
          md: '328px',
        },
        marginTop: 4,
        marginBottom: 3,
      }}
    >
      <Stack
        direction="row"
        sx={{
          zIndex: 10,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography color="text.secondary">Lens ID</Typography>
        <CopyableText label={`${profile?.id}`} text={`${profile?.id}`} />
      </Stack>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', width: '100%' }} />
      <Stack
        direction="row"
        sx={{
          zIndex: 10,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography color="text.secondary">Address</Typography>
        <CopyableText
          label={truncateAddress(`${profile?.ownedBy?.address}`)}
          text={`${profile?.ownedBy?.address}`}
        />
      </Stack>
      {isAuthorized &&
        !authorizedLoading &&
        attestation &&
        !attestationLoading &&
        hasAccess &&
        !accessLoading &&
        profile?.id !== sessionData?.profile?.id && (
          <>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', width: '100%' }} />
            <Stack
              direction="row"
              sx={{
                zIndex: 10,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography color="text.secondary">License</Typography>
              <OpenableText
                label={truncateAddress(attestationAddress)}
                url={`${GLOBAL_CONSTANTS.ATTESTATION_BASE_URL}${attestationAddress}`}
              />
            </Stack>
          </>
        )}
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', width: '100%' }} />
      <Stack
        direction="column"
        sx={{
          zIndex: 10,
          width: '100%',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Typography color="text.secondary">Distribution Partners</Typography>
        <Box
          gridTemplateColumns={{
            xs: 'repeat(3, 1fr)',
          }}
          sx={{
            overflow: 'hidden',
            display: 'grid',
            gap: 1,
            mt: 1,
          }}
        >
          {['Watchit'].map((partner, index) => (
            <StyledBoxGradient
              key={`partner-${partner}`}
              color1={randomColors[randomColors.length - index]}
              color2={randomColors[index]}
            >
              <Typography style={{ marginRight: 5, fontWeight: 'bold' }} variant="caption">
                {partner}
              </Typography>
              <IconRosetteDiscountCheckFilled />
            </StyledBoxGradient>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
}

const StyledBoxGradient = styled(Box)<{ color1?: string; color2?: string }>(({
  theme,
  color1,
  color2,
}) => {
  const defaultColor1 = theme.palette.primary.main;
  const defaultColor2 = theme.palette.secondary.main;

  return {
    background: `linear-gradient(300deg, ${color1 || defaultColor1} 0%, ${color2 || defaultColor2} 25%, ${color1 || defaultColor1} 50%, ${color2 || defaultColor2} 75%, ${color1 || defaultColor1} 100%)`,
    backgroundSize: '400%',
    animation: 'gradientShift 20s infinite',
    padding: '4px 8px',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    gap: '3px',
    '@keyframes gradientShift': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },
  };
});

export default ProfileRightSidebar;
