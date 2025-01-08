// MUI IMPORTS
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';
import ListItemText from '@mui/material/ListItemText';

// LENS IMPORTS
import { Profile } from '@lens-protocol/api-bindings';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';

// LOCAL IMPORTS
import Image from '../image';
import { paths } from '../../routes/paths';
import { useRouter } from '@src/routes/hooks';
import FollowUnfollowButton from '@src/components/follow-unfollow-button.tsx';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

interface FollowerItemProps {
  profile: Profile;
  onClick?: () => void;
  onActionFinished?: () => void;
  sx?: SxProps<Theme>;
  canFollow?: boolean;
  followButtonMinWidth?: number;
}

// ----------------------------------------------------------------------

export const UserItem = ({
  profile: profileData,
  sx,
  followButtonMinWidth = 120,
  onClick,
  canFollow = true,
}: FollowerItemProps) => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const router = useRouter();
  const profile =
    sessionData && sessionData?.profile?.id === profileData?.id ? sessionData.profile : profileData;

  const goToProfile = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onClick ? onClick() : router.push(paths.dashboard.user.root(`${profile.id}`));
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: 1,
          padding: 1,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'scale(1.03)' },
          ...sx,
        }}
        onClick={goToProfile}
      >
        <Image
          src={
            profile?.metadata?.coverPicture?.optimized?.uri ??
            `https://picsum.photos/seed/${profile?.id}/1920/820`
          }
          sx={{
            height: 120,
            opacity: 0.7,
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        />
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            cursor: 'pointer',
            mt: -3,
            backgroundColor: 'transparent',
            p: (theme) => theme.spacing(0, 2, 1, 2),
          }}
        >
          <Avatar
            src={
              (profile?.metadata?.picture as any)?.optimized?.uri ??
              `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`
            }
            alt={profile?.handle?.localName ?? ''}
            sx={{ width: 48, height: 48, mr: 2 }}
            variant="rounded"
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1,
              width: '100%',
            }}
          >
            <ListItemText
              primary={profile?.handle?.localName ?? ''}
              secondary={
                <>{profile?.id !== sessionData?.profile?.id ? profile?.id : 'This is you!'}</>
              }
              primaryTypographyProps={{
                noWrap: true,
                typography: 'subtitle2',
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                noWrap: true,
                display: 'flex',
                component: 'span',
                alignItems: 'center',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />

            {canFollow && profile?.id !== sessionData?.profile?.id && (
              <FollowUnfollowButton
                profileId={profile?.id}
                followButtonMinWidth={followButtonMinWidth}
                size={'small'}
              />
            )}
          </Box>
        </Card>
      </Box>
    </>
  );
};
