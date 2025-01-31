import Button from '@mui/material/Button';
import Iconify from '@src/components/iconify';
import StrategyModal from '@src/components/modal';
import { useBoolean } from '@src/hooks/use-boolean';
import StrategyModalContent from '@src/sections/marketing/components/StrategyModalContent.tsx';
const StrategyCreate = () => {
  const confirmPublish = useBoolean();

  const handleClose = () => {
    confirmPublish.onFalse?.();
  };

  const handleClick = () => {
    confirmPublish.onTrue?.();
  };

  // @TODO Implement onConfirm
  const handleConfirm = () => {
    confirmPublish.onFalse?.();
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
        New strategy
      </Button>
      <StrategyModal
        title="Register a strategy"
        open={confirmPublish.value}
        onClose={handleClose}
        renderContent={<StrategyModalContent onConfirm={handleConfirm} onClose={handleClose} />}
      />
    </>
  );
};

export default StrategyCreate;
