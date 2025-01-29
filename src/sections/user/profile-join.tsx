import LoadingButton from "@mui/lab/LoadingButton";
import {SubscribeProfileModal} from "@src/components/subscribe-profile-modal.tsx";
import {ProfileHeaderProps} from "@src/sections/user/profile-header.tsx";
import {FC, useState} from "react";
import {openLoginModal} from "@redux/auth";
import {useDispatch, useSelector} from "react-redux";

interface ProfileJoinProps extends ProfileHeaderProps{
  profileJoinProps: {
    hasAccess?: boolean;
    accessLoading: boolean;
    accessFetchingLoading: boolean;
    onSubscribe: () => void;
  }
}

const ProfileJoin: FC<ProfileJoinProps> = ({profile, profileJoinProps}) => {
  const dispatch = useDispatch();
  const sessionData = useSelector((state: any) => state.auth.session);
  const {hasAccess, accessLoading, accessFetchingLoading, onSubscribe} = profileJoinProps;
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  const handleSubscription = async () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());
    if (!hasAccess) setOpenSubscribeModal(true);
  };


  return (<>
    <LoadingButton
      title={hasAccess ? 'Joined' : 'Join'}
      variant={hasAccess ? 'outlined' : 'contained'}
      sx={{
        minWidth: { xs: 90, md: 120 },
        backgroundColor: hasAccess ? '#24262A' : '#fff',
      }}
      onClick={handleSubscription}
      disabled={accessLoading || hasAccess || accessFetchingLoading}
      loading={accessLoading || accessFetchingLoading}
    >
      {hasAccess ? 'Joined' : 'Join'}
    </LoadingButton>

    <SubscribeProfileModal
      isOpen={openSubscribeModal}
      onClose={() => setOpenSubscribeModal(false)}
      onSubscribe={onSubscribe}
      profile={profile}
    />

  </>)
}

export default ProfileJoin
