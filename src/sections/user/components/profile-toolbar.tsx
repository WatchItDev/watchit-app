import AvatarProfile from "@src/components/avatar/avatar.tsx";
import Stack from "@mui/material/Stack";
import ProfileShare from "@src/sections/user/components/profile-share.tsx";
import ProfileSetJoiningPrice from "@src/sections/user/components/profile-set-joining-price.tsx";
import ProfileUpdateButton from "@src/sections/user/components/profile-update-button.tsx";
import {FC} from "react";
import {Profile} from "@lens-protocol/api-bindings";
import {useTheme} from "@mui/material/styles";
import {useSelector} from "react-redux";
import ProfileTransfer from "@src/sections/user/components/profile-transfer.tsx";

interface ProfileToolbarProps {
  profile: Profile;
  profileImage?: string;
}

const ProfileToolbar: FC<ProfileToolbarProps> = ({profile, profileImage}) => {
  const theme = useTheme();
  const sessionData = useSelector((state: any) => state.auth.session);
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
        src={profileImage ?? profile?.id}
        alt={profile?.handle?.localName ?? ''}
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
        {sessionData?.authenticated && sessionData?.profile?.id === profile?.id ? (
          <ProfileSetJoiningPrice />
        ) : (
          <></>
        )}
        {sessionData?.profile && profile?.id === sessionData?.profile?.id && (
          <ProfileUpdateButton />
        )}

        {
          sessionData?.authenticated && profile?.id !== sessionData?.profile?.id && (
            <ProfileTransfer profile={profile} />
          )
        }


      </Stack>
    </Stack>
  )
}

export default ProfileToolbar;
