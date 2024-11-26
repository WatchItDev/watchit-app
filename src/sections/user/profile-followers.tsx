// MUI IMPORTS
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// LENS IMPORTS
import { Profile } from '@lens-protocol/api-bindings';
import { useProfileFollowers } from '@lens-protocol/react';

// LOCAL IMPORTS
import { UserItem } from '@src/components/user-item';

// ----------------------------------------------------------------------

interface Props {
  profile: Profile
  onActionFinished?: () => void
}

// ----------------------------------------------------------------------

const ProfileFollowers = ({ profile, onActionFinished }: Props) => {
  const { data: followers } = useProfileFollowers({
    of: profile.id
  });

  // console.log('followers')
  // console.log(followers)

  return (
    <Box
      sx={{
        display: followers?.length ? 'grid' : 'flex',
        flexWrap: 'wrap',
        gap: `${16}px`,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 2
      }}
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
          followers.map((follower, index) => (
            <UserItem key={`follower-${index}`} profile={follower} onActionFinished={onActionFinished} />
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
            This profile has no followers
          </Typography>
        )
      }
    </Box>
  );
}

export default ProfileFollowers
