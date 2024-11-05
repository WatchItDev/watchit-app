// MUI IMPORTS
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// LENS IMPORTS
import { Profile } from '@lens-protocol/api-bindings';
import { useProfileFollowing } from '@lens-protocol/react';

// LOCAL IMPORTS
import { UserItem } from '@src/components/user-item';

// ----------------------------------------------------------------------

interface Props {
  profile: Profile
}

// ----------------------------------------------------------------------

const ProfileFollowing = ({ profile }: Props) => {
  const { data: following } = useProfileFollowing({
    for: profile.id
  });

  // console.log('following')
  // console.log(following)

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
        following?.length ? (
          following.map((follower, index) => (
            <UserItem key={`following-${index}`} profile={follower} />
          ))
        ) : (
          <Typography>No following</Typography>
        )
      }
    </Box>
  );
}

export default ProfileFollowing
