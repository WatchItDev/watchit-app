// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from 'src/utils/format-time';
// types
import { IUserProfileGallery } from 'src/types/user';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Lightbox, { useLightBox } from 'src/components/lightbox';

// ----------------------------------------------------------------------

type Props = {
  gallery: IUserProfileGallery[];
};

export default function ProfileGallery({ gallery }: Props) {
  const theme = useTheme();

  const slides = gallery.map((slide) => ({
    src: slide.imageUrl,
  }));

  const lightbox = useLightBox(slides);

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        Gallery
      </Typography>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {gallery.map((image) => (
          <Card key={image.id} sx={{ cursor: 'pointer', color: 'common.white' }}>
            <IconButton color="inherit" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 9 }}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>

            <ListItemText
              sx={{
                p: 3,
                left: 0,
                width: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
              }}
              primary={image.title}
              secondary={fDate(image.postedAt)}
              primaryTypographyProps={{
                noWrap: true,
                typography: 'subtitle1',
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                color: 'inherit',
                component: 'span',
                typography: 'body2',
                sx: { opacity: 0.48 },
              }}
            />

            <Image
              alt="gallery"
              ratio="1/1"
              src={image.imageUrl}
              onClick={() => lightbox.onOpen(image.imageUrl)}
              overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${
                theme.palette.grey[900]
              } 75%)`}
            />
          </Card>
        ))}
      </Box>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
