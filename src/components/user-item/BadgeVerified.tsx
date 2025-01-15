import {Icon} from "@iconify/react";
import {FC} from "react";

interface BadgeVerifiedProps {
  id: string;
}

const BadgeVerified: FC<BadgeVerifiedProps> = ({id}) => {

  // Make validation to check if the user is verified taking the id as a parameter
  const verified = true;

  // Check if the user is verified
  console.log('verified', verified, id);


  if (!verified) return null;


  return (
    <Icon width={20} color={'#FFF'} icon={'ic:round-verified'} />
  )
}

export default BadgeVerified;
