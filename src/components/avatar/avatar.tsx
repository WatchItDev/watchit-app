import React, { forwardRef } from 'react';
import Avatar from '@mui/material/Avatar';
import { SxProps } from '@mui/material/styles';
import { CSSProperties } from 'react';
import { COLORS } from '@src/layouts/config-layout.ts';
import { resolveSrc } from '@src/utils/image.ts';

interface AvatarProfileProps {
  src: string;
  alt?: string;
  sx?: SxProps | CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  variant?: 'circular' | 'rounded' | 'square';
  sizes?: string;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

const AvatarProfile = forwardRef<HTMLDivElement, AvatarProfileProps>(
  ({ src, alt, sx, ...other }, ref) => {
    const imageSrc = resolveSrc(src);

    return (
      <Avatar
        ref={ref}
        alt={alt?.toUpperCase() ?? 'Avatar profile'}
        src={imageSrc}
        sx={{ backgroundColor: COLORS.GRAY_DARK, fontWeight: 'bold', ...sx }}
        {...other}
      />
    );
  }
);

AvatarProfile.displayName = 'AvatarProfile';

export default AvatarProfile;
