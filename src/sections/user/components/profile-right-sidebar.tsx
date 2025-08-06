// REACT IMPORTS
import { FC, useEffect, useMemo } from 'react';

// MUI IMPORTS
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CopyableText } from "@src/components/copyable-text";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip"

// ICONS IMPORTS
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";

// LOCAL IMPORTS
import { truncateAddress } from "@src/utils/wallet.ts";
// import { OpenableText } from "@src/components/openable-text";
import { randomColors } from "@src/components/poster/CONSTANTS.tsx";
// import { useAuth } from '@src/hooks/use-auth.ts';
import { ProfileHeaderProps } from "@src/sections/user/types.ts"
// import { GLOBAL_CONSTANTS } from "@src/config-global.ts"
import {
  useGetAchievementsQuery,
  useGetRanksCatalogQuery,
  useHasPerkLazyQuery,
} from '@src/graphql/generated/hooks.tsx';
import { RANK_ICON } from '@src/utils/ranks.ts';
import { IconButton } from '@mui/material';

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
  // const { isAuthorized, authorizedLoading, accessLoading, hasAccess, attestation, attestationLoading } = sidebarProps;
  // const { session: sessionData } = useAuth();
  const [hasPerk, { data }] = useHasPerkLazyQuery();
  const { data: ranksData, loading: ranksLoading } = useGetRanksCatalogQuery();
  const { data: achData } = useGetAchievementsQuery({ variables: { address: profile?.address ?? '' } });
  // const hex = BigInt(attestation ?? '').toString(16)
  // add padding to attestation smaller than 256 bits
  // const cleanedHex = hex.length < 64 ? `${'0'.repeat(64 - hex.length)}${hex}` : hex;
  // const attestationAddress = `0x${cleanedHex}`;

  useEffect(() => {
    if (profile?.address) {
      hasPerk({ variables: { address: profile?.address, perkId: 'public-rank' } })
    }
  }, [profile?.address]);

  const unlockedRanks = useMemo(() => {
    const rows = ranksData?.getRanksCatalog ?? [];
    const sorted = rows.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const currentOrder = achData?.getAchievements.currentRank.order ?? 0;
    return sorted.filter(r => (r.order ?? 0) <= currentOrder);
  }, [ranksData, achData]);

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
        <Typography color="text.secondary">Address</Typography>
        <CopyableText
          label={truncateAddress(`${profile?.address}`)}
          text={`${profile?.address}`}
        />
      </Stack>
      {/*{isAuthorized &&*/}
      {/*  !authorizedLoading &&*/}
      {/*  attestation &&*/}
      {/*  !attestationLoading &&*/}
      {/*  hasAccess &&*/}
      {/*  !accessLoading &&*/}
      {/*  profile?.address !== sessionData?.address && (*/}
      {/*    <>*/}
      {/*      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', width: '100%' }} />*/}
      {/*      <Tooltip title="This license address represents the license issued using blockchain technology, ensuring a secure agreement between the creator and the user..">*/}
      {/*      <Stack*/}
      {/*        direction="row"*/}
      {/*        sx={{*/}
      {/*          zIndex: 10,*/}
      {/*          width: '100%',*/}
      {/*          alignItems: 'center',*/}
      {/*          justifyContent: 'space-between',*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <Typography color="text.secondary">License</Typography>*/}
      {/*        <OpenableText*/}
      {/*          label={truncateAddress(attestationAddress)}*/}
      {/*          url={`${GLOBAL_CONSTANTS.ATTESTATION_BASE_URL}${attestationAddress}`}*/}
      {/*        />*/}
      {/*      </Stack>*/}
      {/*      </Tooltip>*/}
      {/*    </>*/}
      {/*  )}*/}
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
      {data?.hasPerk && unlockedRanks.length > 0 && (
        <>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', width: '100%' }} />
          <Typography color="text.secondary">Ranks</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            {ranksLoading
              ? Array.from({ length: unlockedRanks.length }).map((_, i) => (
                <Box key={i} sx={{ width: 40, height: 40, bgcolor: 'grey.800', borderRadius: '50%' }} />
              ))
              : unlockedRanks.map(r => (
                <Tooltip key={r.id} title={r.name} arrow>
                  <IconButton sx={{ p: 0, width: 40, height: 40 }}>
                    <RankImg src={RANK_ICON[r.id] ?? RANK_ICON['watcher']} alt={r.name} />
                  </IconButton>
                </Tooltip>
              ))
            }
          </Box>
        </>
      )}
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

const RankImg = styled('img')({
  width: 30,
  height: 30,
  flexShrink: 0,
  objectFit: 'contain',
});

export default ProfileRightSidebar;
