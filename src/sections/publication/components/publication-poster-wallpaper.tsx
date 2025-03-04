import { FC } from 'react';
import { Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconPlayerPlay } from '@tabler/icons-react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Image from '@src/components/image';
import { SponsoredAccessTrialButton } from '@src/components/sponsored-access-button';
import { getAttachmentCid } from '@src/utils/publication.ts';
import { PublicationPosterWallpaperProps } from '@src/sections/publication/types.ts';

export const PublicationPosterWallpaper: FC<PublicationPosterWallpaperProps> = (props) => {
  const {
    publication,
    isSponsoredButtonVisible,
    isJoinButtonVisible,
    joinButtonLoading,
    onJoin,
    onSponsorSuccess,
    campaign,
    isActive,
  } = props;

  return (
    <HeroPosterContainer>
      <BlurOverlay />

      <Image
        dir="ltr"
        alt={publication?.metadata?.title || 'publication-wallpaper'}
        src={getAttachmentCid(publication, 'wallpaper')}
        ratio="21/9"
        sx={{
          borderRadius: 2,
          zIndex: 0,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      />

      <Image
        alt={publication?.metadata?.title || 'poster'}
        src={getAttachmentCid(publication, 'poster')}
        ratio="1/1"
        sx={{
          borderRadius: 1,
          objectFit: 'cover',
          maxWidth: '30%',
          position: 'absolute',
          zIndex: 2,
          border: '2px solid rgba(255, 255, 255, 0.08)',
        }}
      />

      {isSponsoredButtonVisible && (
        <SponsoredAccessTrialButton
          isActive={isActive}
          holderAddress={publication?.by?.ownedBy?.address}
          campaignAddress={campaign}
          onSuccess={onSponsorSuccess}
          neonPaperProps={{
            height: '35px',
            bottom: 16,
            left: 16,
            position: 'absolute',
            zIndex: 2,
            sx: {
              height: '36px',
              bottom: 16,
              left: 16,
              position: 'absolute',
              zIndex: 2,
            }
          }}
        />
      )}

      {isJoinButtonVisible && (
        <LoadingButton
          variant="contained"
          sx={{
            color: '#1E1F22',
            background: '#FFFFFF',
            height: '35px',
            bottom: 16,
            left: 16,
            position: 'absolute',
            zIndex: 2,
          }}
          onClick={onJoin}
          loading={joinButtonLoading}
        >
          <IconPlayerPlay fontSize="large" size={18} />
          <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: '700', ml: 1 }}>
            Join
          </Typography>
        </LoadingButton>
      )}
    </HeroPosterContainer>
  );
}

// ----------------------------------------------------------------------

const HeroPosterContainer = styled(Box)(() => ({
  width: '100%',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const BlurOverlay = styled(Box)(() => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '15px',
  backdropFilter: 'blur(8px)',
  background: 'rgba(25, 28, 31, 0.5)',
}));
