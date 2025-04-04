// MUI IMPORTS
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// LENS IMPORTS
import { Profile } from '@lens-protocol/api-bindings';

// LOCAL IMPORTS
import { UserItem } from '@src/components/user-item';
import { useSelector } from 'react-redux';
import {randomKey} from "@src/utils/uuidv4.ts"
import {RootState} from "@redux/store.ts"

// ----------------------------------------------------------------------

const ProfileFollowing = () => {
  const following: Profile[] = useSelector((state: RootState) => state.followers.followings);

  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
      sx={{
        display: following?.length ? 'grid' : 'flex',
        flexWrap: 'wrap',
        gap: `${16}px`,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      {following?.length ? (
        following.map((follower, index) => (
          <UserItem key={`${ randomKey(index, 'following-')}`} profile={follower} />
        ))
      ) : (
        <Typography
          sx={{
            height: '20rem',
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            background: '#2b2d31',
            borderRadius: '1rem',
          }}
        >
          This profile has no following
        </Typography>
      )}
    </Box>
  );
};

export default ProfileFollowing;
