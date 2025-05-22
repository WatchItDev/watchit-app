// MUI IMPORTS
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// LOCAL IMPORTS
import { UserItem } from '@src/components/user-item';
import { randomKey } from "@src/utils/uuidv4.ts"
import { ProfileFollowersProps } from "@src/sections/user/types.ts"
import { User } from '@src/graphql/generated/graphql.ts';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

const ProfileFollowers = ({ followers, loading, onActionFinished }: ProfileFollowersProps) => {
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
        display: followers.length ? 'grid' : 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      {followers?.length ? (
        followers.map((follower: User, index: number) => (
          <UserItem
            key={`${randomKey(index, 'follower-')}`}
            profile={follower}
            onActionFinished={onActionFinished}
          />
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
      )}
    </Box>
  );
};

export default ProfileFollowers;
