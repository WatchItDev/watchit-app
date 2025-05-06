import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Typography from "@mui/material/Typography";
import BadgeVerified from "@src/components/user-item/BadgeVerified.tsx";
import Image from '../image';
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import { memo, FC } from 'react';
import { Address } from 'viem';
import { useRouter } from '@src/routes/hooks';
import { paths } from '../../routes/paths';
import {capitalizeFirstLetter} from "@src/utils/text-transform.ts"
import { useAuth } from '@src/hooks/use-auth.ts';
import {FollowerItemProps} from "@src/components/user-item/types.ts"
import { resolveSrc } from '@src/utils/image.ts';

// ----------------------------------------------------------------------

export const UserItem = memo(
  ({
    profile,
    sx,
    onClick,
  }: FollowerItemProps) => {
    const { session } = useAuth();
    const router = useRouter();

    const goToProfile = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onClick ? onClick() : router.push(paths.dashboard.user.root(`${profile.address}`));
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
            alt={profile?.username ?? 'Profile Cover'}
            src={resolveSrc(profile?.coverPicture ?? profile?.address ?? '', 'cover')}
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
              src={profile?.profilePicture ?? profile?.address}
              alt={profile?.username ?? ''}
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
                primary={<UserNameAndBadge address={profile?.address as Address} name={capitalizeFirstLetter(profile?.displayName as string) ?? profile?.username} />}
                secondary={
                  <>{profile?.address !== session?.address ? profile?.bio ?? profile?.address : 'This is you!'}</>
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
            </Box>
          </Card>
        </Box>
      </>
    );
  }
, (prevProps, nextProps) => prevProps.profile.address === nextProps.profile.address);

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
