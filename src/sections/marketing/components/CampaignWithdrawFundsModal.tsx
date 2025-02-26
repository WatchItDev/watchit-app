import { FC } from 'react';
import SettingsModal from '@src/components/modal';
import CampaignWithdrawFundsModalContent from './CampaignWithdrawFundsModalContent';
import { CampaignWithdrawFundsModalProps } from '@src/sections/marketing/components/types.ts';

const CampaignWithdrawFundsModal: FC<CampaignWithdrawFundsModalProps> = (props) => {
  const { open, onClose, onSuccess, campaignData, } = props;

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
