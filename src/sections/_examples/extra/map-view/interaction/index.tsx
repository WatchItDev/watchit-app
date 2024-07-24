import { useState, useCallback, memo } from 'react';
import Map from 'react-map-gl';
// components
import { MapControl, MapBoxProps } from 'src/components/map';
//
import ControlPanel from './control-panel';

// ----------------------------------------------------------------------

function MapInteraction({ ...other }: MapBoxProps) {
  const [settings, setSettings] = useState({
    minZoom: 0,
    maxZoom: 20,
    minPitch: 0,
    maxPitch: 85,
    dragPan: true,
    boxZoom: true,
    keyboard: true,
    touchZoom: true,
    dragRotate: true,
    scrollZoom: true,
    touchPitch: true,
    touchRotate: true,
    doubleClickZoom: true,
    touchZoomRotate: true,
  });

  const updateSettings = useCallback(
    (name: string, value: boolean | number) =>
      setSettings((prevSettings) => ({
        ...prevSettings,
        [name]: value,
      })),
    []
  );

  return (
    <Map
      {...settings}
      initialViewState={{
        latitude: 37.729,
        longitude: -122.36,
        zoom: 11,
        bearing: 0,
        pitch: 50,
      }}
      {...other}
    >
      <MapControl />

      <ControlPanel settings={settings} onChange={updateSettings} />
    </Map>
  );
}

export default memo(MapInteraction);
