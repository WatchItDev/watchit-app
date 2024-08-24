// @mui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// utils
import { fShortenNumber } from 'src/utils/format-number';
// api
import { useGetPost, useGetLatestPosts } from 'src/api/blog';
// components
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PostList from '../post-list';
import PostCommentList from '../post-comment-list';
import PostCommentForm from '../post-comment-form';
import PostDetailsHero from '../post-details-hero';
import { PostDetailsSkeleton } from '../post-skeleton';

// ----------------------------------------------------------------------

type Props = {
  title: string;
};

export default function PostDetailsHomeView({ title }: Props) {
  const { post, postError, postLoading } = useGetPost(title);

  const { latestPosts, latestPostsLoading } = useGetLatestPosts(title);

  const renderSkeleton = <PostDetailsSkeleton />;

  const renderError = (
    <Container sx={{ my: 10 }}>
      <EmptyContent
        filled
        title={`${postError?.message}`}
        action={
          <Button
            component={RouterLink}
            href={paths.post.root}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            Back to List
          </Button>
        }
        sx={{ py: 10 }}
      />
    </Container>
  );

  const renderPost = post && (
    <>
      <PostDetailsHero
        title={post.title}
        author={post.author}
        coverUrl={post.coverUrl}
        createdAt={post.createdAt}
      />

      <Container
        maxWidth={false}
        sx={{
          py: 3,
          mb: 5,
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <CustomBreadcrumbs
          links={[
            {
              name: 'Home',
              href: '/',
            },
            {
              name: 'Blog',
              href: paths.post.root,
            },
            {
              name: post?.title,
            },
          ]}
          sx={{ maxWidth: 720, mx: 'auto' }}
        />
      </Container>

      <Container maxWidth={false}>
        <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
          <Typography variant="subtitle1" sx={{ mb: 5 }}>
            {post.description}
          </Typography>

          <Markdown children={post.content} />

          <Stack
            spacing={3}
            sx={{
              py: 3,
              borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
              borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" flexWrap="wrap" spacing={1}>
              {post.tags.map((tag) => (
                <Chip key={tag} label={tag} variant="soft" />
              ))}
            </Stack>

            <Stack direction="row" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    size="small"
                    color="error"
                    icon={<Iconify icon="solar:heart-bold" />}
                    checkedIcon={<Iconify icon="solar:heart-bold" />}
                  />
                }
                label={fShortenNumber(post.totalFavorites)}
                sx={{ mr: 1 }}
              />

              <AvatarGroup>
                {post.favoritePerson.map((person) => (
                  <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
                ))}
              </AvatarGroup>
            </Stack>
          </Stack>

          <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
            <Typography variant="h4">Comments</Typography>

            <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
              ({post.comments.length})
            </Typography>
          </Stack>

          <PostCommentForm />

          <Divider sx={{ mt: 5, mb: 2 }} />

          <PostCommentList comments={post.comments} />
        </Stack>
      </Container>
    </>
  );

  const renderLatestPosts = (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Recent Posts
      </Typography>

      <PostList
        posts={latestPosts.slice(latestPosts.length - 4)}
        loading={latestPostsLoading}
        disabledIndex
      />
    </>
  );

  return (
    <>
      {postLoading && renderSkeleton}

      {postError && renderError}

      {post && renderPost}

      <Container sx={{ pb: 15 }}>{!!latestPosts.length && renderLatestPosts}</Container>
    </>
  );
}
