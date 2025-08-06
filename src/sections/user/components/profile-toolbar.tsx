// REACT IMPORTS
import { FC } from "react";

// MUI IMPORTS
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

// LOCAL IMPORTS
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import ProfileUpdateButton from "@src/sections/user/components/profile-update-button.tsx";
import ProfileShare from "@src/sections/user/components/profile-share.tsx";
import ProfileSetJoiningPrice from "@src/sections/user/components/profile-set-joining-price.tsx";
import ProfileTransfer from "@src/sections/user/components/profile-transfer.tsx";
import { useAuth } from '@src/hooks/use-auth.ts';
import { User } from '@src/graphql/generated/graphql.ts';

interface ProfileToolbarProps {
  profile: User;
  profileImage?: string;
}

const ProfileToolbar: FC<ProfileToolbarProps> = ({profile, profileImage}) => {
  const theme = useTheme();
  const { session } = useAuth();

  return (
    <Stack
      direction="row"
      sx={{
        ml: {
          xs: 0,
          sm: 0,
          md: 0,
        },
      }}
    >
      <AvatarProfile
        src={profileImage || profile?.address}
        alt={profile?.username ?? ''}
        variant="rounded"
        sx={{
          fontSize: '3em',
          width: { xs: 96, md: 128 },
          height: { xs: 96, md: 128 },
          border: `solid 2px ${theme.palette.common.white}`,
        }}
      />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{
          mt: {
            xs: 7,
            sm: 7,
            md: 11,
          },
          ml: 2,
        }}
      >
        <ProfileShare profile={profile} />
        {/*{session?.authenticated && session?.address === profile?.address ? (*/}
        {/*  <ProfileSetJoiningPrice />*/}
        {/*) : (*/}
        {/*  <></>*/}
        {/*)}*/}
        {session?.address && profile?.address === session?.address && (
          <ProfileUpdateButton />
        )}

        {session?.authenticated && profile?.address !== session?.address && (
          <ProfileTransfer profile={profile} />
        )}
      </Stack>
    </Stack>
  )
}

export default ProfileToolbar;
