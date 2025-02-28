import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Typography from "@mui/material/Typography";
import BadgeVerified from "@src/components/user-item/BadgeVerified.tsx";
import FollowUnfollowButton from '@src/components/follow-unfollow-button.tsx';
import Image from '../image';
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import { memo, FC } from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';
import { Address } from 'viem';
import { useRouter } from '@src/routes/hooks';
import { useSelector } from 'react-redux';
import { paths } from '../../routes/paths';
import { Profile } from '@lens-protocol/api-bindings';
import {capitalizeFirstLetter} from "@src/utils/text-transform.ts"

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

export const UserItem = memo(
  ({
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
            alt={profile?.handle?.localName ?? 'Profile Cover'}
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
            <AvatarProfile
              src={(profile?.metadata?.picture as any)?.optimized?.uri ?? profile?.id}
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
                primary={<UserNameAndBadge address={profile?.ownedBy?.address} name={capitalizeFirstLetter(profile?.handle?.localName) ?? ''} />}
                secondary={
                  <>{profile?.id !== sessionData?.profile?.id ? profile?.metadata?.bio : 'This is you!'}</>
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

             {/* {canFollow && profile?.id !== sessionData?.profile?.id && (
                <FollowUnfollowButton
                  profileId={profile?.id}
                  followButtonMinWidth={followButtonMinWidth}
                  size={'small'}
                />
              )}*/}
            </Box>
          </Card>
        </Box>
      </>
    );
  }
, (prevProps, nextProps) => prevProps.profile.id === nextProps.profile.id);

interface UserNameAndBadgeProps {
  name: string;
  address: Address;
}

export const UserNameAndBadge: FC<UserNameAndBadgeProps> = memo(
  ({ name, address }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Typography
          sx={{
            mr: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
        >
          <BadgeVerified address={address} />
        </Box>
      </Box>
    );
  }
, (prevProps, nextProps) => prevProps.address === nextProps.address);
