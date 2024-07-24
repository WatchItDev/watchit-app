import { NavigationControl, FullscreenControl, ScaleControl, GeolocateControl } from 'react-map-gl';
//
import { StyledMapControls } from './styles';

// ----------------------------------------------------------------------

type Props = {
  hideScaleControl?: boolean;
  hideGeolocateControl?: boolean;
  hideFullscreenControl?: boolean;
  hideNavigationnControl?: boolean;
};

export default function MapControl({
  hideScaleControl,
  hideGeolocateControl,
  hideFullscreenControl,
  hideNavigationnControl,
}: Props) {
  return (
    <>
      <StyledMapControls />

      {!hideGeolocateControl && (
        <GeolocateControl position="top-left" positionOptions={{ enableHighAccuracy: true }} />
      )}

      {!hideFullscreenControl && <FullscreenControl position="top-left" />}

      {!hideScaleControl && <ScaleControl position="bottom-left" />}

      {!hideNavigationnControl && <NavigationControl position="bottom-left" />}
    </>
  );
}
