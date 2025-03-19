import { FC } from "react";
import SettingsModal from '@src/components/modal';
import {OwnershipSettingsModalProps} from "@src/sections/ownership/types.ts"
import {OwnershipTimelineModalContent} from "@src/sections/ownership/components/ownership-timeline-modal-content.tsx"

// ----------------------------------------------------------------------

const OwnershipTimelineModal: FC<OwnershipSettingsModalProps> = (props) => {
  const { open, onSuccess, onClose, assetData } = props;

  const handleClose = () => {
    onClose?.();
  };

  const handlSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  return (
    <SettingsModal
      title={`Asset history`}
      open={open}
      onClose={handleClose}
      renderContent={
        <OwnershipTimelineModalContent
          onConfirm={handlSuccess}
          onClose={handleClose}
          assetData={assetData}
        />
      }
    />
  );
};

export {OwnershipTimelineModal};
