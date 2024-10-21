// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
// utils
import { fNumber } from 'src/utils/format-number';
// types
import { IUserProfilePost } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
//
import { Profile } from '@lens-protocol/api-bindings';
import { appId, PublicationType, usePublications } from '@lens-protocol/react-web';
import Typography from '@mui/material/Typography';
import ProfilePostItem from './profile-post-item';

// ----------------------------------------------------------------------

interface ProfileHomeProps {
  profile: Profile;
}

export default function ProfileHome({ profile }: ProfileHomeProps) {
  const { data: publications, loading, error } = usePublications({
    where: {
      from: [profile.id],
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      }
    }
  });

  console.log('profile publications')
  console.log(publications)

  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
           {profile?.stats.followers ?? 0}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Follower
          </Box>
        </Stack>

        <Stack width={1}>
           {profile?.stats.following ?? 0}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Following
          </Box>
        </Stack>

        <Stack width={1}>
           {publications?.length ?? 0}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Publications
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>Here goes my description</Box>

        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          JohnDoe@gmail.com
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3} sx={{ position: 'sticky', top: 20 }}>
          {renderFollows}

          {renderAbout}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
           {publications && publications.map((publication) => (
             <ProfilePostItem key={publication.id} publication={publication} profile={profile} />
           ))}

          {
            !publications?.length && (
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
                This profile has no posts
              </Typography>
            )
          }
        </Stack>
      </Grid>
    </Grid>
  );
}
