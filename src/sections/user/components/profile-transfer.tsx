import { Profile } from '@lens-protocol/api-bindings';
import { FC, useCallback, useRef, useState } from 'react';
import FinanceQuickTransferModal from '@src/sections/finance/components/finance-quick-transfer-modal.tsx';
import LoadingButton from '@mui/lab/LoadingButton';
import { useBoolean } from '@src/hooks/use-boolean.ts';
import Iconify from '@src/components/iconify';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';

interface ProfileTransferProps {
  profile: Profile;
}

const ProfileTransfer: FC<ProfileTransferProps> = ({ profile }) => {
  const [openTooltipSend, setOpenTooltipSend] = useState(false);
  const navRefSend = useRef(null);
  const confirm = useBoolean();

  const handleOpen = () => {
    confirm.onTrue();
  };

  const handleTransferFinish = () => {
    confirm.onFalse();
  };

  const handleOpenSend = useCallback(() => {
    setOpenTooltipSend(true);
  }, []);

  const handleCloseSend = useCallback(() => {
    setOpenTooltipSend(false);
  }, []);

  return (
    <>
      <LoadingButton
        sx={{
          backgroundColor: 'transparent',
          minWidth: '44px',
        }}
        ref={navRefSend}
        variant={'outlined'}
        onClick={handleOpen}
        onMouseEnter={handleOpenSend}
        onMouseLeave={handleCloseSend}
      >
        <Iconify icon="material-symbols:send-money-rounded" color="#fff" />
      </LoadingButton>

      <FinanceQuickTransferModal
        max={500}
        amount={-1}
        open={confirm.value}
        address={profile?.ownedBy?.address}
        onClose={confirm.onFalse}
        onFinish={handleTransferFinish}
        contactInfo={profile}
      />

      <Popover
        open={openTooltipSend}
        anchorEl={navRefSend.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            onMouseEnter: handleOpenSend,
            onMouseLeave: handleCloseSend,
            sx: {
              mt: 6,
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '8px 20px',
            },
          },
        }}
        sx={{
          pointerEvents: 'none',
        }}
      >
        <Typography>Send</Typography>
      </Popover>
    </>
  );
};

export default ProfileTransfer;
