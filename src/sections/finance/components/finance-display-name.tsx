import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FC} from "react";
import {Profile} from "@lens-protocol/api-bindings";
import {truncateAddress} from "@src/utils/wallet.ts";

interface FinanceDisplayNameProps {
  initialList?: Profile[];
  carousel: any;
}

/**
 * FinanceDisplayName is a functional component responsible for rendering the display name
 * of a selected profile from a provided list. If no list is provided or the list is empty,
 * the component returns null. Otherwise, it displays the name of the currently selected
 * profile in a styled container.
 *
 * Props:
 * @param {Object} initialList - Array of profiles containing details such as the local name.
 * @param {Object} carousel - Object containing the current index used to determine the selected profile.
 *
 * Behavior:
 * - If initialList is empty or null, the component does not render anything.
 * - It selects a profile based on the carousel's currentIndex and renders the localName of that profile.
 * - If no profile is selected, it falls back to a default message ('No profile selected').
 */
const FinanceDisplayName: FC<FinanceDisplayNameProps> = ({initialList, carousel}) => {
  // If the initial list is empty, return
  if (!initialList?.length) {
    return null;
  }

  const selectedProfile = initialList?.[carousel.currentIndex];
  return (
    <Box sx={{ textAlign: 'center',mt:-2, mb: 1 }}>
      <Typography variant="body2" color="text.primary">
        {selectedProfile?.metadata?.displayName ?? 'No profile selected'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {truncateAddress(selectedProfile?.ownedBy?.address)}
      </Typography>

    </Box>
  );
}

export default FinanceDisplayName;
