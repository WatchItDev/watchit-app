import { useState, useRef, useCallback, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

// utils
import { fDate } from '@src/utils/format-time';
import { fShortenNumber } from '@src/utils/format-number';

// components
import Image from '@src/components/image';
import Iconify from '@src/components/iconify';

// Lens Protocol hooks
import { useReactionToggle, PublicationReactionType, hasReacted } from '@lens-protocol/react-web';
import { Profile } from '@lens-protocol/api-bindings';
import Divider from '@mui/material/Divider';
import MovieCommentForm from '../movie/movie-details-comment-form';
import PostCommentList from '../movie/movie-comments-list';

// ----------------------------------------------------------------------

interface Props {
  profile: Profile;
  publication: any;
}

export default function ProfilePostItem({ publication, profile }: Props) {
  const commentRef = useRef<HTMLInputElement>(null);

  const [hasLiked, setHasLiked] = useState(false);

  const { execute: toggleReaction, loading: loadingLike } = useReactionToggle();

  const handleClickComment = useCallback(() => {
    if (commentRef.current) {
      commentRef.current.focus();
    }
  }, []);

  const handleToggleLike = async () => {
    if (!publication) return;

    try {
      await toggleReaction({
        reaction: PublicationReactionType.Upvote,
        publication,
      });
      setHasLiked(!hasLiked);
    } catch (err) {
      console.error('Error al cambiar el estado del like:', err);
    }
  };

  // update hasLiked state when the publication load
  useEffect(() => {
    if (publication) {
      setHasLiked(hasReacted({ publication, reaction: PublicationReactionType.Upvote }));
    }
  }, [publication]);

  const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid.replace('ipfs://', '')}`;

  const getWallpaperCid = (): string =>
    publication?.metadata?.attachments?.find((el: any) => el.altTag === 'Wallpaper')?.image?.raw
      ?.uri;

  const renderHead = (
    <CardHeader
      disableTypography
      avatar={
        <Avatar
          src={
            (profile?.metadata?.picture as any)?.optimized?.uri ??
            `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`
          }
          alt={profile?.handle?.localName ?? ''}
        />
      }
      title={
        <Link color="inherit" variant="subtitle1">
          {publication?.metadata?.title}
        </Link>
      }
      subheader={
        <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
          By {profile?.handle?.localName ?? ''} on {fDate(new Date(publication.createdAt))}
        </Box>
      }
      action={
        <IconButton>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      }
    />
  );

  const renderActions = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 3, 3, 3),
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={hasLiked}
            onChange={handleToggleLike}
            color="error"
            icon={<Iconify icon="solar:heart-outline" />}
            checkedIcon={<Iconify icon="solar:heart-bold" />}
            disabled={loadingLike}
          />
        }
        label={fShortenNumber(publication.stats.upvotes)}
        sx={{ mr: 1 }}
      />

      {/* {!!publication.stats.totalUpvotes && ( */}
      {/*  <AvatarGroup */}
      {/*    sx={{ */}
      {/*      [`& .${avatarGroupClasses.avatar}`]: { */}
      {/*        width: 32, */}
      {/*        height: 32, */}
      {/*      }, */}
      {/*    }} */}
      {/*  > */}
      {/*    /!* Aquí podrías mostrar los avatares de las personas que han dado like *!/ */}
      {/*  </AvatarGroup> */}
      {/* )} */}

      <Box sx={{ flexGrow: 1 }} />

      <IconButton onClick={handleClickComment}>
        <Iconify icon="solar:bookmark-bold" />
      </IconButton>

      <IconButton>
        <Iconify icon="solar:play-bold" />
      </IconButton>
    </Stack>
  );

  return (
    <Card>
      {renderHead}

      <Typography
        variant="body2"
        sx={{
          p: (theme) => theme.spacing(3, 3, 2, 3),
        }}
      >
        {publication.metadata.content}
      </Typography>

      {getWallpaperCid() && (
        <Box sx={{ p: 1 }}>
          <Image
            alt={publication.id}
            src={getMediaUri(getWallpaperCid())}
            ratio="16/9"
            sx={{ borderRadius: 1.5 }}
          />
        </Box>
      )}

      {renderActions}

      <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
        {publication?.stats?.comments} comments
      </Box>

      {/* Render comments */}
      <PostCommentList publicationId={publication.id} showReplies={false} />

      <Box sx={{ mt: 3, mb: 3 }}>
        <MovieCommentForm commentOn={publication.id} />
      </Box>

      <Divider sx={{ mt: 2, mb: 2 }} />
    </Card>
  );
}
