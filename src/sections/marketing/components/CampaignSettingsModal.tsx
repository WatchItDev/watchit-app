import { FC } from "react";
import SettingsModal from '@src/components/modal';
import CampaignSettingsModalContent from "./CampaignSettingsModalContent";

interface CampaignSettingsModalProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  campaignData: {
    address: string;
    description: string;
  };
}

const CampaignSettingsModal: FC<CampaignSettingsModalProps> = ({
                                                                 open,
                                                                 onConfirm,
                                                                 onClose,
                                                                 campaignData
                                                               }) => {

  const handleClose = () => {
    onClose?.();
  };

  // @TODO Implement onConfirm
  const handleConfirm = () => {
    onConfirm?.();
  }

  return (
    <SettingsModal
      title="Configure a campaign"
      open={open}
      onClose={handleClose}
      renderContent={
        <CampaignSettingsModalContent
          onConfirm={handleConfirm}
          onClose={handleClose}
          campaignData={campaignData}
        />
      }
    />
  );
};

export default CampaignSettingsModal;
