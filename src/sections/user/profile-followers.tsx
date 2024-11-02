// MUI IMPORTS
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// LENS IMPORTS
import { Profile } from '@lens-protocol/api-bindings';
import { useProfileFollowers } from '@lens-protocol/react';

// LOCAL IMPORTS
import { UserItem } from '../../components/user-item';

// ----------------------------------------------------------------------

interface Props {
  profile: Profile
}

// ----------------------------------------------------------------------

const ProfileFollowers = ({ profile }: Props) => {
  const { data: followers, loading, error } = useProfileFollowers({
    of: profile.id
  });

  console.log('followers')
  console.log(followers)

  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {
        followers?.length ? (
          followers.map((follower) => (
            <UserItem profile={follower} />
          ))
        ) : (
          <Typography>No followers</Typography>
        )
      }
    </Box>
  );
}

export default ProfileFollowers
