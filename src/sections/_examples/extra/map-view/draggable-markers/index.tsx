import { useState, useCallback, memo } from 'react';
import Map, { MarkerDragEvent, LngLat } from 'react-map-gl';
// components
import { MapMarker, MapControl, MapBoxProps } from 'src/components/map';
//
import ControlPanel from './control-panel';

// ----------------------------------------------------------------------

function MapDraggableMarkers({ ...other }: MapBoxProps) {
  const [marker, setMarker] = useState({
    latitude: 40,
    longitude: -100,
  });

  const [events, logEvents] = useState<Record<string, LngLat>>({});

  const onMarkerDragStart = useCallback((event: MarkerDragEvent) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event: MarkerDragEvent) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));

    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);

  const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
  }, []);

  return (
    <>
      <Map initialViewState={{ latitude: 40, longitude: -100, zoom: 3.5 }} {...other}>
        <MapControl />

        <MapMarker
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="bottom"
          draggable
          onDragStart={onMarkerDragStart}
          onDrag={onMarkerDrag}
          onDragEnd={onMarkerDragEnd}
        />
      </Map>

      <ControlPanel events={events} />
    </>
  );
}

export default memo(MapDraggableMarkers);
