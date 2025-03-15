// MUI IMPORTS
import Button from '@mui/material/Button';

// LOCAL IMPORTS
import Iconify from '@src/components/iconify';
import OwnershipModal from '@src/components/modal';
import { useBoolean } from '@src/hooks/use-boolean';
import { FC } from 'react';
import { CampaignCreateProps } from '@src/sections/marketing/types.ts';
import {OwnershipModalContent} from "@src/sections/ownership/components/ownership-modal-content.tsx"

// ----------------------------------------------------------------------

const OwnershipCreate: FC<CampaignCreateProps> = ({ onSuccess }) => {
  const confirmPublish = useBoolean();

  const handleClose = () => {
    confirmPublish.onFalse?.();
  };

  const handleClick = () => {
    confirmPublish.onTrue?.();
  };

  const handleConfirm = () => {
    onSuccess?.();
    confirmPublish.onFalse();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<Iconify icon={'typcn:plus'} />}
        variant="contained"
        sx={{
          color: 'white',
          background: '#8E33FF',
        }}
      >
        Register
      </Button>
      <OwnershipModal
        title="Register a campaign"
        open={confirmPublish.value}
        onClose={handleClose}
        renderContent={<OwnershipModalContent onConfirm={handleConfirm} onClose={handleClose} />}
      />
    </>
  );
};

export {OwnershipCreate};
