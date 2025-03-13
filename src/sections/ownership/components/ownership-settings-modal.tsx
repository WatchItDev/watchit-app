import { FC } from "react";
import SettingsModal from '@src/components/modal';
import {OwnershipSettingsModalContent} from "./ownership-settings-modal-content.tsx";
import {OwnershipSettingsModalProps} from "@src/sections/ownership/types.ts"

// ----------------------------------------------------------------------

const OwnershipSettingsModal: FC<OwnershipSettingsModalProps> = (props) => {
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
      title={`Settings form ${assetData?.name}`}
      open={open}
      onClose={handleClose}
      renderContent={
        <OwnershipSettingsModalContent
          onConfirm={handlSuccess}
          onClose={handleClose}
          assetData={assetData}
        />
      }
    />
  );
};

export {OwnershipSettingsModal};
