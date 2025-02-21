import { FC } from 'react';
import { Address } from 'viem';
import SettingsModal from '@src/components/modal';
import CampaignWithdrawFundsModalContent from './CampaignWithdrawFundsModalContent';

interface CampaignWithdrawFundsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  campaignData: {
    address: Address;
    description: string;
    currentFundsBalance: string;
  };
}

const CampaignWithdrawFundsModal: FC<CampaignWithdrawFundsModalProps> = ({
                                                                           open,
                                                                           onClose,
                                                                           onSuccess,
                                                                           campaignData,
                                                                         }) => {
  const handleClose = () => {
    onClose();
  };

  const handleSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  return (
    <SettingsModal
      title="Withdraw funds"
      open={open}
      onClose={handleClose}
      renderContent={
        <CampaignWithdrawFundsModalContent
          onConfirm={handleSuccess}
          onClose={handleClose}
          campaignData={campaignData}
        />
      }
    />
  );
};

export default CampaignWithdrawFundsModal;
