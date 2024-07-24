import { Helmet } from 'react-helmet-async';
// sections
import MapView from 'src/sections/_examples/extra/map-view';

// ----------------------------------------------------------------------

export default function MapPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Map</title>
      </Helmet>

      <MapView />
    </>
  );
}
