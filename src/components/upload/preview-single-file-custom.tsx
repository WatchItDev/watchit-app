// @mui
import Box from '@mui/material/Box';
//
import Image from '../image';
import { SingleFilePreviewProps } from './preview-single-file';

// ----------------------------------------------------------------------

export default function SingleFilePreviewCustom({
  imgUrl = '',
  ratio,
}: SingleFilePreviewProps) {
  return (
    <Box
      className="custom"
      sx={{
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        alt="file preview"
        src={imgUrl}
        sx={{
          width: 1,
          height: 1,
          borderRadius: 1,
        }}
        ratio={ratio}
      />
    </Box>
  );
}
