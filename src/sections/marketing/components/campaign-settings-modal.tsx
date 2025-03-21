import { FC } from "react";
import SettingsModal from '@src/components/modal';
import CampaignSettingsModalContent from "./campaign-settings-modal-content.tsx";
import { CampaignSettingsModalProps } from '@src/sections/marketing/types.ts';

// ----------------------------------------------------------------------

const CampaignSettingsModal: FC<CampaignSettingsModalProps> = (props) => {
  const { open, onSuccess, onClose, campaignData } = props;

  const handleClose = () => {
    onClose?.();
  };

  const handlSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  return (
    <SettingsModal
      title="Configure a campaign"
      open={open}
      onClose={handleClose}
      renderContent={
        <CampaignSettingsModalContent
          onConfirm={handlSuccess}
          onClose={handleClose}
          campaignData={campaignData}
        />
      }
    />
  );
};

export default CampaignSettingsModal;
