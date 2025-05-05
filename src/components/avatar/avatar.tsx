// @mui
import Avatar from '@mui/material/Avatar';
import { CSSProperties, FC } from 'react';
import { COLORS } from '@src/layouts/config-layout.ts';
import { SxProps } from '@mui/material/styles';
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

const AvatarProfile: FC<AvatarProfileProps> = ({ src, alt, sx, ...other }) => {
  const imageSrc = resolveSrc(src);

  const avatarStyles = {
    backgroundColor: COLORS.GRAY_DARK,
    fontWeight: 'bold',
    ...sx,
  };

  return (
    <Avatar
      alt={alt?.toUpperCase() ?? 'Avatar profile'}
      src={imageSrc}
      sx={avatarStyles}
      {...other}
    />
  );
};

export default AvatarProfile;
