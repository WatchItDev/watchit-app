// @mui
import Masonry from '@mui/lab/Masonry';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _mock } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

const COLORS = ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

const SIZES = [24, 32, 40, 56];

const VARIANTS = ['circular', 'rounded', 'square'] as const;

const STATUS = ['online', 'alway', 'busy', 'offline'] as const;

// ----------------------------------------------------------------------

export default function AvatarView() {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Avatar"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Avatar' },
            ]}
            moreLink={['https://mui.com/components/avatars']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
          <ComponentBlock title="Image">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Avatar
                key={index}
                alt={_mock.fullName(index + 1)}
                src={_mock.image.avatar(index + 1)}
              />
            ))}
          </ComponentBlock>

          <ComponentBlock title="Letter">
            {COLORS.map((color, index) => (
              <Tooltip key={color} title={color}>
                <Avatar alt={_mock.fullName(index + 3)}>
                  {_mock
                    .fullName(index + 3)
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </ComponentBlock>

          <ComponentBlock title="Icon">
            {COLORS.map((color) => (
              <Avatar key={color} color={color}>
                <Iconify icon="eva:folder-add-outline" width={24} />
              </Avatar>
            ))}
          </ComponentBlock>

          <ComponentBlock title="Variant">
            {VARIANTS.map((variant) => (
              <Avatar
                key={variant}
                variant={variant}
                sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
              >
                <Iconify icon="eva:folder-add-outline" width={24} />
              </Avatar>
            ))}
          </ComponentBlock>

          <ComponentBlock title="Grouped">
            <Stack spacing={2} alignItems="center">
              {SIZES.map((size) => (
                <Tooltip key={size} title={size}>
                  <AvatarGroup
                    key={size}
                    sx={{
                      [`& .${avatarGroupClasses.avatar}`]: {
                        width: size,
                        height: size,
                      },
                    }}
                  >
                    {COLORS.map((color, index) => (
                      <Avatar
                        key={color}
                        alt={_mock.fullAddress(index + 1)}
                        src={_mock.image.avatar(index + 1)}
                      />
                    ))}
                  </AvatarGroup>
                </Tooltip>
              ))}

              <Tooltip title="compact">
                <Badge variant="online" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                  <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
                    {COLORS.slice(0, 2).map((color, index) => (
                      <Avatar
                        key={color}
                        alt={_mock.fullName(index + 1)}
                        src={_mock.image.avatar(index + 1)}
                      />
                    ))}
                  </AvatarGroup>
                </Badge>
              </Tooltip>
            </Stack>
          </ComponentBlock>

          <ComponentBlock title="With Badge">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Avatar
                  alt={_mock.fullName(7)}
                  src={_mock.image.avatar(7)}
                  sx={{
                    p: 0,
                    width: 24,
                    height: 24,
                    border: `solid 2px ${theme.palette.background.paper}`,
                  }}
                />
              }
            >
              <Avatar alt={_mock.fullName(8)} src={_mock.image.avatar(8)} />
            </Badge>

            {STATUS.map((status, index) => (
              <Badge
                key={status}
                variant={status}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Avatar alt={_mock.fullName(index + 1)} src={_mock.image.avatar(index + 1)} />
              </Badge>
            ))}
          </ComponentBlock>

          <ComponentBlock title="Sizes">
            {[24, 32, 48, 56, 64, 80, 128].map((size, index) => (
              <Avatar
                key={size}
                alt={_mock.fullName(index + 4)}
                src={_mock.image.avatar(index + 4)}
                sx={{ width: size, height: size }}
              />
            ))}
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
