import { m } from 'framer-motion';
// @mui
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

const LONG_TEXT = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;

// ----------------------------------------------------------------------

export default function TooltipView() {
  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Tooltip"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Tooltip' },
            ]}
            moreLink={['https://mui.com/components/tooltips']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
          <ComponentBlock title="Simple">
            <Tooltip title="Delete">
              <IconButton>
                <Iconify icon="solar:trash-bin-trash-bold" width={24} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add">
              <Fab>
                <Iconify icon="mingcute:add-line" width={24} />
              </Fab>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton color="info">
                <Iconify icon="solar:trash-bin-trash-bold" width={24} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add">
              <Fab
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover()}
                color="info"
              >
                <Iconify icon="mingcute:add-line" width={24} />
              </Fab>
            </Tooltip>

            <Tooltip title="Add">
              <Button variant="outlined" color="info">
                Button
              </Button>
            </Tooltip>
          </ComponentBlock>

          <ComponentBlock title="Arrow">
            <Tooltip title="Add" arrow>
              <Fab>
                <Iconify icon="mingcute:add-line" width={24} />
              </Fab>
            </Tooltip>
          </ComponentBlock>

          <ComponentBlock title="Variable Width">
            <Tooltip title={LONG_TEXT}>
              <Button color="inherit">Default Width [300px]</Button>
            </Tooltip>

            <Tooltip title={LONG_TEXT} sx={{ maxWidth: 500 }}>
              <Button color="inherit">Custom Width [500px]</Button>
            </Tooltip>

            <Tooltip title={LONG_TEXT} sx={{ maxWidth: 'none' }}>
              <Button color="inherit">No wrapping</Button>
            </Tooltip>
          </ComponentBlock>

          <ComponentBlock title="Transitions">
            <Tooltip title="Add">
              <Button color="inherit">Grow</Button>
            </Tooltip>

            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title="Add">
              <Button color="inherit">Fade</Button>
            </Tooltip>

            <Tooltip TransitionComponent={Zoom} title="Add">
              <Button color="inherit">Zoom</Button>
            </Tooltip>
          </ComponentBlock>

          <ComponentBlock title="Positioned">
            <Tooltip title="Add" placement="top-start">
              <Button color="inherit">top-start</Button>
            </Tooltip>

            <Tooltip title="Add" placement="top">
              <Button color="inherit">top</Button>
            </Tooltip>

            <Tooltip title="Add" placement="top-end">
              <Button color="inherit">top-end</Button>
            </Tooltip>

            <Tooltip title="Add" placement="left-start">
              <Button color="inherit">left-start</Button>
            </Tooltip>

            <Tooltip title="Add" placement="left">
              <Button color="inherit">left</Button>
            </Tooltip>

            <Tooltip title="Add" placement="left-end">
              <Button color="inherit">left-end</Button>
            </Tooltip>

            <Tooltip title="Add" placement="right-start">
              <Button color="inherit">right-start</Button>
            </Tooltip>

            <Tooltip title="Add" placement="right">
              <Button color="inherit">right</Button>
            </Tooltip>

            <Tooltip title="Add" placement="right-end">
              <Button color="inherit">right-end</Button>
            </Tooltip>

            <Tooltip title="Add" placement="bottom-start">
              <Button color="inherit">bottom-start</Button>
            </Tooltip>

            <Tooltip title="Add" placement="bottom">
              <Button color="inherit">bottom</Button>
            </Tooltip>

            <Tooltip title="Add" placement="bottom-end">
              <Button color="inherit">bottom-end</Button>
            </Tooltip>
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
