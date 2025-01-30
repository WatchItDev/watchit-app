import Button from '@mui/material/Button';

import Iconify from '@src/components/iconify';
import StrategyModal from '@src/components/modal';
import { useBoolean } from '@src/hooks/use-boolean';
import CampaignModalContent from "@src/sections/marketing/components/CampaignModalContent.tsx";

const CampaignCreate = () => {
  const confirmPublish = useBoolean();

  const handleClose = () => {
    confirmPublish.onFalse?.();
  };

  const handleClick = () => {
    confirmPublish.onTrue?.();
  };

  // @TODO Implement onConfirm
  const handleConfirm = () => {
    console.log('Confirm');
  }

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
