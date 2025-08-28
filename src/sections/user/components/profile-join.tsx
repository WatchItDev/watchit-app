// REACT IMPORTS
import { FC, useState } from 'react';

// REDUX IMPORTS
import { useDispatch } from 'react-redux';

// MUI IMPORTS
import LoadingButton from '@mui/lab/LoadingButton';

// LOCAL IMPORTS
import { openLoginModal } from '@redux/auth';
import { SubscribeProfileModal } from '@src/components/subscribe-profile-modal.tsx';
import { ProfileJoinProps } from '@src/sections/user/types.ts';
import { useAuth } from '@src/hooks/use-auth.ts';

const ProfileJoin: FC<ProfileJoinProps> = ({ profile, profileJoinProps }) => {
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);
  const dispatch = useDispatch();
  const { session: sessionData } = useAuth();
  const { hasAccess, accessLoading, onSubscribe } = profileJoinProps;

  const handleSubscription = async () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());
    if (!hasAccess) setOpenSubscribeModal(true);
  };

  return (
    <>
      <LoadingButton
        title={hasAccess ? 'Joined' : 'Join'}
        variant={hasAccess ? 'outlined' : 'contained'}
        sx={{
          minWidth: { xs: 90, md: 120 },
          backgroundColor: hasAccess ? '#24262A' : '#fff',
        }}
        onClick={handleSubscription}
        disabled={accessLoading || hasAccess}
        loading={accessLoading}
      >
        {hasAccess ? 'Joined' : 'Join'}
      </LoadingButton>

      <SubscribeProfileModal
        isOpen={openSubscribeModal}
        onClose={() => setOpenSubscribeModal(false)}
        onSubscribe={onSubscribe}
        profile={profile}
      />
    </>
  );
};

export default ProfileJoin;
