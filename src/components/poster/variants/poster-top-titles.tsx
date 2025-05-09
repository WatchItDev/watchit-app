import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Image from '@src/components/image';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import Button from '@mui/material/Button';
import { IconBookmark, IconBookmarkFilled, IconPlayerPlay } from '@tabler/icons-react';
import Box from '@mui/material/Box';
import TextMaxLine from '@src/components/text-max-line';
import { CircularProgress } from '@mui/material';
import { getAttachmentCid, getMediaUri } from '@src/utils/publication.ts';
import { useToggleBookmark } from '@src/hooks/use-toggle-bookmark';
import { Post } from '@src/graphql/generated/graphql.ts';
import { resolveSrc } from '@src/utils/image.ts';
import { useBookmarks } from '@src/hooks/use-bookmark.ts';

const PosterTopTitles = ({ post }: { post: Post }) => {
  const router = useRouter();
  const poster = getAttachmentCid(post, 'square') || getAttachmentCid(post, 'poster');
  const wallpaper = getAttachmentCid(post, 'wallpaper');
  const { has, loading: loadingList } = useBookmarks();
  const { toggle, loading: loadingToggle } = useToggleBookmark();

  const isBookmarked = has(post.id);

  const handlePosterClick = () => {
    router.push(paths.dashboard.publication.details(post.id));
  };

  const goToProfile = () => {
    router.push(paths.dashboard.user.root(`${post.id}`));
  };

  console.log('--------');
  console.log(post.author);
  console.log(post.author.profilePicture);
  console.log(post.author.profilePicture ?? post.author.address);
  console.log(post.author.profilePicture || post.author.address);
  console.log(resolveSrc(post.author.profilePicture || post.author.address, 'profile'));

  return (
    <Stack
      sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      alignItems={'stretch'}
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <Image
        alt={post.title}
        src={getMediaUri(wallpaper)}
        ratio="16/9"
        sx={{
          zIndex: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.2,
          filter: "blur(5px) !important",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: { xs: '100%', sm: '90%', md: '90%', lg: '90%', xlg: '75%' },
          py: 6,
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}
      >
        <Box
          sx={{
            padding: {
              xs: '10px 5px',
              lg: '25px',
            },
            width: '100%',
            maxWidth: { xs: '100%', sm: '50%', md: '50%', lg: '50%' },
            mb: { xs: 3, sm: 0 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: { xs: '50%', sm: '75%', lg: '85%', xl: '70%' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              style={{
                borderRadius: '10px',
                width: '100%',
              }}
              alt={post.title}
              src={getMediaUri(poster)}
              ratio="1/1"
            />
          </Box>
        </Box>

        <Box
          sx={{
            maxWidth: { xs: '100%', sm: '50%', md: '50%', lg: '50%' },
            display: 'flex',
            alignItems: 'center',
            background: 'transparent',
            px: '12px',
            py: { xs: 0, md: 8 },
          }}
        >
          <Stack spacing={1} gap={'16px'}>
            <Stack spacing={1} gap={0}>
              <TextMaxLine line={2} variant="h3" sx={{ mb: 1 }}>
                {post.title}
              </TextMaxLine>

              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Button
                  variant="text"
                  sx={{ cursor: 'pointer', background: 'transparent', p: 0, pl: 1 }}
                  onClick={goToProfile}
                >
                  <Typography style={{ marginRight: 5 }} variant="caption">
                    by
                  </Typography>
                  <Typography
                    style={{
                      gap: 4,
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,.7)',
                      padding: '4px 10px',
                      borderRadius: 8,
                    }}
                    variant="caption"
                  >
                    <Image
                      ratio={'1/1'}
                      style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                      src={resolveSrc(post.author.profilePicture || post.author.address, 'profile')}
                    />
                    {post.author.displayName ?? post.author.username}
                  </Typography>
                </Button>
              </Box>
            </Stack>

            <Typography
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 4,
              }}
              variant="h6"
            >
              {post.description ?? ''}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                sx={{
                  borderColor: '#FFFFFF',
                  color: '#000',
                  height: '40px',
                }}
                onClick={handlePosterClick}
              >
                <Box
                  sx={{
                    marginRight: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      xs: 0,
                      lg: '4px',
                    },
                  }}
                >
                  <IconPlayerPlay size={22} color="#000" />
                </Box>
                <TextMaxLine
                  sx={{
                    display: {
                      xs: 'none',
                      lg: 'inline',
                    },
                  }}
                  line={1}
                  variant="button"
                >
                  Watch now
                </TextMaxLine>
              </Button>
              <Button
                variant="text"
                sx={{
                  borderColor: '#FFFFFF',
                  color: '#FFFFFF',
                  height: '40px',
                  minWidth: '40px',
                }}
                onClick={() => toggle(post)}
              >
                {loadingToggle || loadingList ? (
                  <CircularProgress size={25} sx={{ color: '#fff' }} />
                ) : isBookmarked ? (
                  <IconBookmarkFilled size={22} />
                ) : (
                  <IconBookmark size={22} />
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export default PosterTopTitles;
