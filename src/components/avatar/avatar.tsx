// @mui
import Avatar from '@mui/material/Avatar';
import {FC} from "react";
import {dicebear} from "@src/utils/dicebear.ts";

interface AvatarProfileProps {
  src: string;
  alt?: string;
  sx?: any;
  [x: string]: any;
}

const AvatarProfile: FC<AvatarProfileProps> = ({ src, alt, sx, ...other }) => {
  //Check if src is a valid URL starting with http or https; if not, use the dicebear API to generate a random avatar
  const imageSrc = src.startsWith('http') || src.startsWith('https') ? src : dicebear(src);

  return (
    <Avatar alt={alt ?? 'Avatar profile'} src={imageSrc} sx={sx} {...other}  />
  )
}

export default AvatarProfile;
