import { FC, PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from '@src/components/image';
import { getAttachmentCid } from '@src/utils/publication';
import { PublicationPosterWallpaperProps } from '@src/sections/publication/types';

export const PublicationPosterWallpaper: FC<PropsWithChildren<PublicationPosterWallpaperProps>> = (props) => {
  const { publication, children } = props;
  const poster = getAttachmentCid(publication, 'square') || getAttachmentCid(publication, 'poster')
  const wallpaper = getAttachmentCid(publication, 'wallpaper');

  return (
    <HeroPosterContainer>
      <BlurOverlay />

      <Image
        dir="ltr"
        alt={publication?.metadata?.title || 'publication-wallpaper'}
        src={wallpaper}
        ratio="21/9"
        sx={{
          borderRadius: 2,
          zIndex: 0,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      />

      <Image
        alt={publication?.metadata?.title || 'poster'}
        src={poster}
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

      {children}
    </HeroPosterContainer>
  );
};

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
