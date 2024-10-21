// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// components
import { Profile } from '@lens-protocol/api-bindings';
import { useProfileFollowing } from '@lens-protocol/react';
import { FollowerItem } from './profile-followers';

// ----------------------------------------------------------------------

type Props = {
  profile: Profile;
};

const ProfileFollowing = ({ profile }: Props) => {
  const { data: following, loading, error } = useProfileFollowing({
    for: profile.id
  });

  console.log('following')
  console.log(following)

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        Following
      </Typography>

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
            following.map((follower) => (
              <FollowerItem profile={follower} />
            ))
          ) : (
            <Typography>No following</Typography>
          )
        }
      </Box>
    </>
  );
}

export default ProfileFollowing
