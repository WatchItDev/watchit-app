import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Image from '../../../components/image';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import { getAttachmentCid, getMediaUri } from '@src/utils/publication.ts';
import {ProfilePublicationItemProps} from "@src/sections/user/types.ts"

export const ProfilePublicationItem = ({ publication }: ProfilePublicationItemProps) => {
  const router = useRouter();
  const posterCid = getAttachmentCid(publication, 'square') || getAttachmentCid(publication, 'poster');
  const posterImage = getMediaUri(posterCid);

  const handleClick = () => {
    router.push(paths.dashboard.publication.details(publication.id));
  };

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
        src={posterImage}
        ratio="1/1"
        sx={{
          borderRadius: 1,
          objectFit: 'cover',
          width: '100%',
          cursor: 'pointer',
        }}
      />
      <Box sx={{ pt: 1, cursor: 'pointer' }}>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {publication?.title}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfilePublicationItem;
