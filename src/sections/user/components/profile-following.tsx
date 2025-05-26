// MUI IMPORTS
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// LOCAL IMPORTS
import { UserItem } from '@src/components/user-item';
import { randomKey } from "@src/utils/uuidv4.ts"
import { ProfileFollowingProps } from '@src/sections/user/types.ts';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

const ProfileFollowing = ({ following, loading }: ProfileFollowingProps) => {
  if (loading) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 10 }}>
      <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
    </Box>
  );

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
