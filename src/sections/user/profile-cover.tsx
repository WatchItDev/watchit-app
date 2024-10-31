// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// hooks
import { useFollow, useUnfollow } from '@lens-protocol/react-web';
import { useState, useEffect } from 'react';
// theme
import { bgGradient } from 'src/theme/css';
import LoadingButton from '@mui/lab/LoadingButton';
import { Profile } from '@lens-protocol/api-bindings';
import { _userAbout } from '../../_mock';
import { useAuth } from '../../hooks/use-auth';
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
