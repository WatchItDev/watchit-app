// @mui
import { alpha } from '@mui/material/styles';
// theme
import { bgGradient } from '@src/theme/css.ts';
import Image from '../../../components/image';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';
import { User } from '@src/graphql/generated/graphql.ts';
import { resolveSrc } from '@src/utils/image.ts';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

interface ProfileCoverProps {
  profile?: User;
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export default function ProfileCover({
  profile,
  sx,
}: Readonly<ProfileCoverProps>) {
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    const imageSrc = (profile?.coverPicture || profile?.address) ?? '';
    setImage(resolveSrc(imageSrc, 'cover') ?? '');
  }, [profile?.coverPicture]);

  return (
    <Image
      src={image}
      sx={{
        ...bgGradient({
          color: alpha('#000', 0.6),
        }),
        height: 300,
        opacity: 0.7,
        color: 'common.white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        overflow: 'hidden',
        ...sx,
      }}
    />
  );
}
