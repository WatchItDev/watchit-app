// ProfilePublicationItem.js
import { useState, useRef, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PublicationReactionType, hasReacted } from '@lens-protocol/react-web';
import Image from '../../components/image';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';

interface Props {
  publication: any;
}

export const ProfilePublicationItem = ({ publication }: Props) => {
  const [hasLiked, setHasLiked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (publication) {
      setHasLiked(hasReacted({ publication, reaction: PublicationReactionType.Upvote }));
    }
  }, [publication]);

  const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid.replace('ipfs://', '')}`;
  const getPosterCid = (): string =>
    publication?.metadata?.attachments?.find((el: any) => el.altTag === 'Vertical Poster')?.image?.raw?.uri;

  const handleClick = () => {
    router.push(paths.dashboard.movie.details(publication.id));
  }

  return (
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
      }}
      onClick={handleClick}
    >
      <Image
        alt={publication.id}
        src={getMediaUri(getPosterCid())}
        ratio="1/1"
        sx={{
          borderRadius: 1,
          objectFit: 'cover',
          width: '100%',
        }}
      />
      <Box sx={{ pt: 1 }}>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {publication?.metadata?.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {`Price: ${publication?.openActionModules?.[0]?.amount?.value} MMC`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfilePublicationItem;
