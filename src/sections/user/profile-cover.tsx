// @mui
import { alpha } from '@mui/material/styles';
// theme
import { bgGradient } from 'src/theme/css';
import { Profile } from '@lens-protocol/api-bindings';
import Image from '../../components/image';

// ----------------------------------------------------------------------

interface ProfileCoverProps {
  profile?: Profile;
}

export default function ProfileCover({ profile }: ProfileCoverProps) {
  return (
    <Image
      src={profile?.metadata?.coverPicture?.optimized?.uri ?? `https://picsum.photos/seed/${profile?.id}/1920/820`}
      sx={{
        ...bgGradient({
          color: alpha('#000', 0.6)
        }),
        height: 300,
        opacity: 0.7,
        color: 'common.white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    />
  );
}
