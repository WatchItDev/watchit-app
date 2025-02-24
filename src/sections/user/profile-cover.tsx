import { Profile } from '@lens-protocol/api-bindings'
import { Theme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import Image from '../../components/image'
import { bgGradient } from '@src/theme/css'

interface ProfileCoverProps {
  profile?: Profile;
  sx?: SxProps<Theme>;
}

export default function ProfileCover({ profile, sx }: ProfileCoverProps) {
  const coverImage = profile?.metadata?.coverPicture?.optimized?.uri
  return (
    <Image
      src={!!coverImage ? coverImage : `https://picsum.photos/seed/${profile?.id}/1920/820`}
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
        ...sx
      }}
    />
  )
}
