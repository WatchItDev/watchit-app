import {Profile} from "@lens-protocol/api-bindings";
import {FC} from "react";
import FinanceQuickTransferModal from "@src/sections/finance/components/finance-quick-transfer-modal.tsx";
import LoadingButton from "@mui/lab/LoadingButton";
import {useBoolean} from "@src/hooks/use-boolean.ts";

interface ProfileTransferProps {
  profile: Profile;
}

const ProfileTransfer: FC<ProfileTransferProps> = ({profile}) => {
  const confirm = useBoolean();

  const handleOpen = () => {
    confirm.onTrue();
  }

  const handleTransferFinish = () => {
    confirm.onFalse();
  }

  return (
    <>
      <LoadingButton sx={{
        minWidth: { xs: 90, md: 120 },
        backgroundColor: '#24262A',
      }} variant={'outlined'} onClick={handleOpen}>
        Send
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
    </>
  )
}

export default ProfileTransfer;
