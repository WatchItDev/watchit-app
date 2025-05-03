// @mui
import Avatar from '@mui/material/Avatar';
import { CSSProperties, FC } from 'react';
import { dicebear } from '@src/utils/dicebear.ts';
import { COLORS } from '@src/layouts/config-layout.ts';
import { SxProps } from '@mui/material/styles';

interface AvatarProfileProps {
  src: string;
  alt?: string;
  sx?: SxProps | CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  variant?: 'circular' | 'rounded' | 'square';
  sizes?: string;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

const resolvers: [RegExp, (src: string) => string][] = [
  [/^ipfs:\/\//, (src) => src.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/')],
  [/^(https?:)/, (src) => src],
  [/^blob:/, (src) => src],
];

const resolveSrc = (src: string): string => {
  const entry = resolvers.find(([pattern]) => pattern.test(src));
  return entry ? entry[1](src) : dicebear(src);
};

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
