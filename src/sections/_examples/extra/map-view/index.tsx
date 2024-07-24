import 'src/utils/mapboxgl';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// routes
import { paths } from 'src/routes/paths';
// config
import { MAPBOX_API } from 'src/config-global';
// _mock
import { cities as CITIES } from 'src/_mock/map/cities';
import { countries as COUNTRIES } from 'src/_mock/map/countries';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import MapHeatmap from './heatmap';
import MapClusters from './clusters';
import MapInteraction from './interaction';
import MapSideBySide from './side-by-side';
import MapChangeTheme from './change-theme';
import MapMarkersPopups from './map-markers-popups';
import MapDraggableMarkers from './draggable-markers';
import MapViewportAnimation from './viewport-animation';
import MapGeoJSONAnimation from './map-geo-json-animation';
import MapHighlightByFilter from './map-highlight-by-filter';

// ----------------------------------------------------------------------

const THEMES = {
  streets: 'mapbox://styles/mapbox/streets-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
};

const baseSettings = {
  mapboxAccessToken: MAPBOX_API,
  minZoom: 1,
};

const StyledMapContainer = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 560,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

// ----------------------------------------------------------------------

export default function MapView() {
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
            heading="Map"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Map' },
            ]}
            moreLink={[
              'http://visgl.github.io/react-map-gl',
              'http://visgl.github.io/react-map-gl/examples',
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={5}>
          <Card>
            <CardHeader title="Change Theme" />
            <CardContent>
              <StyledMapContainer>
                <MapChangeTheme {...baseSettings} themes={THEMES} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Markers & Popups" />
            <CardContent>
              <StyledMapContainer>
                <MapMarkersPopups {...baseSettings} data={COUNTRIES} mapStyle={THEMES.light} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Draggable Markers" />
            <CardContent>
              <StyledMapContainer>
                <MapDraggableMarkers {...baseSettings} mapStyle={THEMES.light} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Geojson Animation" />
            <CardContent>
              <StyledMapContainer>
                <MapGeoJSONAnimation {...baseSettings} mapStyle={THEMES.satelliteStreets} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Clusters" />
            <CardContent>
              <StyledMapContainer>
                <MapClusters {...baseSettings} mapStyle={THEMES.light} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Interaction" />
            <CardContent>
              <StyledMapContainer>
                <MapInteraction {...baseSettings} mapStyle={THEMES.light} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Viewport Animation" />
            <CardContent>
              <StyledMapContainer>
                <MapViewportAnimation
                  {...baseSettings}
                  data={CITIES.filter((city) => city.state === 'Texas')}
                  mapStyle={THEMES.light}
                />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Highlight By Filter" />
            <CardContent>
              <StyledMapContainer>
                <MapHighlightByFilter {...baseSettings} mapStyle={THEMES.light} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Heatmap" />
            <CardContent>
              <StyledMapContainer>
                <MapHeatmap {...baseSettings} mapStyle={THEMES.light} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Side By Side" />
            <CardContent>
              <StyledMapContainer>
                <MapSideBySide {...baseSettings} />
              </StyledMapContainer>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
