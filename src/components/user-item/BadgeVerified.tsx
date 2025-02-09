import { Icon } from "@iconify/react";
import { FC } from "react";
import { Address } from "viem";
import { useIsVerified } from "@src/hooks/use-is-verified.ts";

interface BadgeVerifiedProps {
  address: Address;
}

const BadgeVerified: FC<BadgeVerifiedProps> = ({ address }) => {
  // Use the useIsVerified hook to check if the user is verified
  const { isVerified, loading } = useIsVerified(address);

  // While loading, do not render anything
  if (loading) return null;

  // If the user is not verified, do not render the badge
  if (!isVerified) return null;

  return <Icon width={20} color={"#cca421"} icon={"ic:round-verified"} />;
};

export default BadgeVerified;
