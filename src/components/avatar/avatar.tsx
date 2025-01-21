// @mui
import Avatar from '@mui/material/Avatar';
import {FC} from "react";
import {dicebear} from "@src/utils/dicebear.ts";
import {COLORS} from "@src/layouts/config-layout.ts";

interface AvatarProfileProps {
  src: string;
  alt?: string;
  sx?: any;
  [x: string]: any;
}

const AvatarProfile: FC<AvatarProfileProps> = ({ src, alt, sx, ...other }) => {
  //Check if src is a valid URL starting with http or https; if not, use the dicebear API to generate a random avatar
  const imageSrc = src.startsWith('http') || src.startsWith('https') ? src : dicebear(src);

  // Default styles for the Avatar component
  sx = {
    backgroundColor: COLORS.GRAY_DARK,
    fontWeight: 'bold',
    ...sx,
  };


  return (
    <Avatar alt={alt?.toUpperCase() ?? 'Avatar profile'} src={imageSrc} sx={sx} {...other}  />
  )
}

export default AvatarProfile;
