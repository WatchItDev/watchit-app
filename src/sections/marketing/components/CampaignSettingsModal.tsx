import {FC} from "react";

import SettingsModal from '@src/components/modal';
import CampaignSettingsModalContent from "./CampaignSettingsModalContent";

interface CampaignSettingsModalProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

const CampaignSettingsModal: FC<CampaignSettingsModalProps> = ({open, onConfirm, onClose}) => {

  const handleClose = () => {
    onClose?.();
  };

  // @TODO Implement onConfirm
  const handleConfirm = () => {
    // Close the modal after succeeded the action for stored in blockchain
    onConfirm?.();
  }

  return (
      <SettingsModal
        title="Configure a campaign"
        open={open}
        onClose={handleClose}
        renderContent={<CampaignSettingsModalContent onConfirm={handleConfirm} onClose={handleClose} />}
      />
  );
};

export default CampaignSettingsModal;
