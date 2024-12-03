// ProfilePublicationItem.js
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PublicationReactionType, hasReacted } from '@lens-protocol/react-web';
import Image from '../../components/image';
import { paths } from '../../routes/paths';
import { useRouter } from '@src/routes/hooks';

interface Props {
  publication: any;
}

export const ProfilePublicationItem = ({ publication }: Props) => {

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasLiked, setHasLiked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (publication) {
      setHasLiked(hasReacted({ publication, reaction: PublicationReactionType.Upvote }));
    }
  }, [publication]);

  // const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid.replace('ipfs://', '')}`;
  const getMediaUri = (cid: string): string => `${cid}`;
  const getPosterCid = (): string =>
    publication?.metadata?.attachments?.find((el: any) => el.altTag === 'poster')?.image?.raw?.uri;

  const handleClick = () => {
    router.push(paths.dashboard.publication.details(publication.id));
  }
  // @TODO review this
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer !important',
        pointerEvents: 'all',
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
          cursor: 'pointer',
        }}
      />
      <Box sx={{ pt: 1, cursor: 'pointer', }}>
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
        {/*<Typography variant="subtitle2" color="text.secondary">*/}
        {/*  {`Price: ${publication?.openActionModules?.[0]?.amount?.value ?? 0} MMC`}*/}
        {/*</Typography>*/}
      </Box>
    </Box>
  );
};

export default ProfilePublicationItem;
