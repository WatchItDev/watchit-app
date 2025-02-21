import { FC } from "react";
import SettingsModal from '@src/components/modal';
import CampaignSettingsModalContent from "./CampaignSettingsModalContent";
import { Address } from 'viem';

interface CampaignSettingsModalProps {
  open: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  campaignData: {
    address: Address;
    description: string;
  };
}

const CampaignSettingsModal: FC<CampaignSettingsModalProps> = ({
                                                                 open,
                                                                 onSuccess,
                                                                 onClose,
                                                                 campaignData
                                                               }) => {

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
