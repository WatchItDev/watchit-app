// MUI IMPORTS
import Button from '@mui/material/Button';

// LOCAL IMPORTS
import Iconify from '@src/components/iconify';
import StrategyModal from '@src/components/modal';
import { useBoolean } from '@src/hooks/use-boolean';
import CampaignModalContent from "@src/sections/marketing/components/CampaignModalContent.tsx";
import { FC } from 'react';
import { CampaignCreateProps } from '@src/sections/marketing/components/types.ts';

// ----------------------------------------------------------------------

const CampaignCreate: FC<CampaignCreateProps> = ({ onSuccess }) => {
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
        New campaign
      </Button>
      <StrategyModal
        title="Register a campaign"
        open={confirmPublish.value}
        onClose={handleClose}
        renderContent={<CampaignModalContent onConfirm={handleConfirm} onClose={handleClose} />}
      />
    </>
  );
};

export default CampaignCreate;
