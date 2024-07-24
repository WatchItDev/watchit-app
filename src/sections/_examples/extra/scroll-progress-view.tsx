import { useRef } from 'react';
import { useScroll } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// routes
import { paths } from 'src/routes/paths';
// components
import ScrollProgress from 'src/components/scroll-progress';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function ScrollProgressView() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollDocument = useScroll();

  const scrollContainer = useScroll({ container: containerRef });

  return (
    <>
      <ScrollProgress scrollYProgress={scrollDocument.scrollYProgress} />

      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Scroll Progress"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Scroll Progress' },
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Card>
          <CardHeader title="Scroll Container" sx={{ pb: 3 }} />
          <ScrollProgress
            scrollYProgress={scrollContainer.scrollYProgress}
            color="error"
            sx={{ position: 'unset', height: 6 }}
          />

          <CardContent ref={containerRef} sx={{ height: 320, overflow: 'auto' }}>
            Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Quisque ut nisi.
            Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum eget, diam. Vestibulum eu
            odio. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Cras ultricies mi eu
            turpis hendrerit fringilla. Phasellus consectetuer vestibulum elit. Phasellus magna.
            Nullam tincidunt adipiscing enim. Vestibulum volutpat pretium libero. Nullam quis ante.
            Morbi mollis tellus ac sapien. Donec orci lectus, aliquam ut, faucibus non, euismod id,
            nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Fusce ac felis sit amet ligula pharetra condimentum. Morbi mattis
            ullamcorper velit. Vivamus consectetuer hendrerit lacus. Nullam quis ante. Praesent
            turpis. Praesent porttitor, nulla vitae posuere iaculis, arcu nisl dignissim dolor, a
            pretium mi sem ut ipsum. Donec mi odio, faucibus at, scelerisque quis, convallis in,
            nisi. Quisque ut nisi. Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum
            eget, diam. Vestibulum eu odio. Proin sapien ipsum, porta a, auctor quis, euismod ut,
            mi. Cras ultricies mi eu turpis hendrerit fringilla. Phasellus consectetuer vestibulum
            elit. Phasellus magna. Nullam tincidunt adipiscing enim. Vestibulum volutpat pretium
            libero. Nullam quis ante. Morbi mollis tellus ac sapien. Donec orci lectus, aliquam ut,
            faucibus non, euismod id, nulla. Pellentesque habitant morbi tristique senectus et netus
            et malesuada fames ac turpis egestas. Fusce ac felis sit amet ligula pharetra
            condimentum. Morbi mattis ullamcorper velit. Vivamus consectetuer hendrerit lacus.
            Nullam quis ante. Praesent turpis. Praesent porttitor, nulla vitae posuere iaculis, arcu
            nisl dignissim dolor, a pretium mi sem ut ipsum. Donec mi odio, faucibus at, scelerisque
            quis, convallis in, nisi. Quisque ut nisi. Suspendisse nisl elit, rhoncus eget,
            elementum ac, condimentum eget, diam. Vestibulum eu odio. Proin sapien ipsum, porta a,
            auctor quis, euismod ut, mi. Cras ultricies mi eu turpis hendrerit fringilla. Phasellus
            consectetuer vestibulum elit. Phasellus magna. Nullam tincidunt adipiscing enim.
            Vestibulum volutpat pretium libero. Nullam quis ante. Morbi mollis tellus ac sapien.
            Donec orci lectus, aliquam ut, faucibus non, euismod id, nulla. Pellentesque habitant
            morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce ac felis
            sit amet ligula pharetra condimentum. Morbi mattis ullamcorper velit. Vivamus
            consectetuer hendrerit lacus. Nullam quis ante. Praesent turpis. Praesent porttitor,
            nulla vitae posuere iaculis, arcu nisl dignissim dolor, a pretium mi sem ut ipsum. Donec
            mi odio, faucibus at, scelerisque quis, convallis in, nisi. Quisque ut nisi. Suspendisse
            nisl elit, rhoncus eget, elementum ac, condimentum eget, diam. Vestibulum eu odio. Proin
            sapien ipsum, porta a, auctor quis, euismod ut, mi. Cras ultricies mi eu turpis
            hendrerit fringilla. Phasellus consectetuer vestibulum elit. Phasellus magna. Nullam
            tincidunt adipiscing enim. Vestibulum volutpat pretium libero. Nullam quis ante. Morbi
            mollis tellus ac sapien. Donec orci lectus, aliquam ut, faucibus non, euismod id, nulla.
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
            egestas. Fusce ac felis sit amet ligula pharetra condimentum. Morbi mattis ullamcorper
            velit. Vivamus consectetuer hendrerit lacus. Nullam quis ante. Praesent turpis. Praesent
            porttitor, nulla vitae posuere iaculis, arcu nisl dignissim dolor, a pretium mi sem ut
            ipsum. Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Quisque ut
            nisi. Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum eget, diam.
            Vestibulum eu odio. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Cras
            ultricies mi eu turpis hendrerit fringilla. Phasellus consectetuer vestibulum elit.
            Phasellus magna. Nullam tincidunt adipiscing enim. Vestibulum volutpat pretium libero.
            Nullam quis ante. Morbi mollis tellus ac sapien. Donec orci lectus, aliquam ut, faucibus
            non, euismod id, nulla. Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. Fusce ac felis sit amet ligula pharetra condimentum.
            Morbi mattis ullamcorper velit. Vivamus consectetuer hendrerit lacus. Nullam quis ante.
            Praesent turpis. Praesent porttitor, nulla vitae posuere iaculis, arcu nisl dignissim
            dolor, a pretium mi sem ut ipsum. Donec mi odio, faucibus at, scelerisque quis,
            convallis in, nisi. Quisque ut nisi. Suspendisse nisl elit, rhoncus eget, elementum ac,
            condimentum eget, diam. Vestibulum eu odio. Proin sapien ipsum, porta a, auctor quis,
            euismod ut, mi. Cras ultricies mi eu turpis hendrerit fringilla. Phasellus consectetuer
            vestibulum elit. Phasellus magna. Nullam tincidunt adipiscing enim. Vestibulum volutpat
            pretium libero. Nullam quis ante. Morbi mollis tellus ac sapien. Donec orci lectus,
            aliquam ut, faucibus non, euismod id, nulla. Pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas. Fusce ac felis sit amet ligula
            pharetra condimentum. Morbi mattis ullamcorper velit. Vivamus consectetuer hendrerit
            lacus. Nullam quis ante. Praesent turpis. Praesent porttitor, nulla vitae posuere
            iaculis, arcu nisl dignissim dolor, a pretium mi sem ut ipsum.
          </CardContent>
        </Card>

        <Box
          sx={{
            minHeight: 2000,
            textAlign: 'center',
            typography: 'h6',
            my: 10,
          }}
        >
          👇 Scroll Down Document
        </Box>
      </Container>
    </>
  );
}
