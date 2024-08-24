// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
// assets
import { AvatarShape } from 'src/assets/illustrations';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
// types
import { IPostItem } from 'src/types/blog';

// ----------------------------------------------------------------------

type Props = {
  post: IPostItem;
  index?: number;
};

export default function PostItem({ post, index }: Props) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const { coverUrl, title, totalViews, totalComments, totalShares, author, createdAt } = post;

  const latestPost = index === 0 || index === 1 || index === 2;

  if (mdUp && latestPost) {
    return (
      <Card>
        <Avatar
          alt={author.name}
          src={author.avatarUrl}
          sx={{
            top: 24,
            left: 24,
            zIndex: 9,
            position: 'absolute',
          }}
        />

        <PostContent
          title={title}
          createdAt={createdAt}
          totalViews={totalViews}
          totalShares={totalShares}
          totalComments={totalComments}
          index={index}
        />

        <Image
          alt={title}
          src={coverUrl}
          overlay={alpha(theme.palette.grey[900], 0.48)}
          sx={{
            width: 1,
            height: 360,
          }}
        />
      </Card>
    );
  }

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            zIndex: 9,
            width: 88,
            height: 36,
            bottom: -16,
            position: 'absolute',
          }}
        />

        <Avatar
          alt={author.name}
          src={author.avatarUrl}
          sx={{
            left: 24,
            zIndex: 9,
            bottom: -24,
            position: 'absolute',
          }}
        />

        <Image alt={title} src={coverUrl} ratio="4/3" />
      </Box>

      <PostContent
        title={title}
        totalViews={totalViews}
        totalComments={totalComments}
        totalShares={totalShares}
        createdAt={createdAt}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type PostContentProps = {
  title: string;
  index?: number;
  totalViews: number;
  totalShares: number;
  totalComments: number;
  createdAt: Date | string | number;
};

export function PostContent({
  title,
  createdAt,
  totalViews,
  totalShares,
  totalComments,
  index,
}: PostContentProps) {
  const mdUp = useResponsive('up', 'md');

  const linkTo = paths.post.details(title);

  const latestPostLarge = index === 0;

  const latestPostSmall = index === 1 || index === 2;

  return (
    <CardContent
      sx={{
        pt: 6,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }),
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{
          mb: 1,
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {fDate(createdAt)}
      </Typography>

      <Link color="inherit" component={RouterLink} href={linkTo}>
        <TextMaxLine variant={mdUp && latestPostLarge ? 'h5' : 'subtitle2'} line={2} persistent>
          {title}
        </TextMaxLine>
      </Link>

      <Stack
        spacing={1.5}
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: 3,
          typography: 'caption',
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        <Stack direction="row" alignItems="center">
          <Iconify icon="eva:message-circle-fill" width={16} sx={{ mr: 0.5 }} />
          {fShortenNumber(totalComments)}
        </Stack>

        <Stack direction="row" alignItems="center">
          <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />
          {fShortenNumber(totalViews)}
        </Stack>

        <Stack direction="row" alignItems="center">
          <Iconify icon="solar:share-bold" width={16} sx={{ mr: 0.5 }} />
          {fShortenNumber(totalShares)}
        </Stack>
      </Stack>
    </CardContent>
  );
}
