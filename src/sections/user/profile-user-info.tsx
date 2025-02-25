import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BadgeVerified from "@src/components/user-item/BadgeVerified.tsx";
import {FC} from "react";
import {ProfileHeaderProps} from "@src/sections/user/profile-header.tsx";
import {Address} from "viem";

const ProfileUserInfo: FC<ProfileHeaderProps> = ({profile}) => {
  return (
    <Box sx={{mt: 2, width: "80%"}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          mt: 0,
          mb: 1,
        }}>
        <Typography
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
          variant="h4"
          color="text.primary">
          {profile?.metadata?.displayName ?? ""}{" "}
          <BadgeVerified address={profile?.ownedBy?.address as Address} />
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            opacity: 0.48,
            mb: 0.4,
          }}>
          {profile?.handle?.localName ?? ""}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        color="text.primary"
        sx={{
          mt: 0,
          mb: 2,
          opacity: 0.7,
          minWidth: {xs: "auto", md: "400px"},
        }}>
        {profile?.metadata?.bio ?? ""}
      </Typography>
    </Box>
  );
};

export default ProfileUserInfo;
