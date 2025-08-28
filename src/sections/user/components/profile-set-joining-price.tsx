import Button from '@mui/material/Button';
import Iconify from '@src/components/iconify';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useCallback, useRef, useState } from 'react';
import { ActivateSubscriptionProfileModal } from '@src/components/activate-subscription-profile-modal.tsx';

const ProfileSetJoiningPrice = () => {
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const navRefSettings = useRef(null);
  const [openTooltipSettings, setOpenTooltipSettings] = useState(false);
  const open = Boolean();

  const handleOpenSettings = useCallback(() => {
    setOpenTooltipSettings(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setOpenTooltipSettings(false);
  }, []);

  return (
    <>
      <Button
        onMouseEnter={handleOpenSettings}
        onMouseLeave={handleCloseSettings}
        ref={navRefSettings}
        size="medium"
        variant="outlined"
        sx={{ p: 1, minWidth: '44px' }}
        onClick={() => setIsActivateModalOpen(true)}
      >
        <Iconify icon="ion:logo-usd" width={20} />
      </Button>

      <Popover
        open={openTooltipSettings}
        anchorEl={navRefSettings.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            onMouseEnter: handleOpenSettings,
            onMouseLeave: handleCloseSettings,
            sx: {
              mt: 6,
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '8px 20px',
              ...(open && {
                pointerEvents: 'auto',
              }),
            },
          },
        }}
        sx={{
          pointerEvents: 'none',
        }}
      >
        <Typography>Set joining pricing</Typography>
      </Popover>

      <ActivateSubscriptionProfileModal
        isOpen={isActivateModalOpen}
        onClose={() => setIsActivateModalOpen(false)}
      />
    </>
  );
};

export default ProfileSetJoiningPrice;
