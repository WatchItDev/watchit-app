import { useState, useEffect, useMemo, memo } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
// components
import { MapBoxProps } from 'src/components/map';
//
import ControlPanel from './control-panel';
import { heatmapLayer } from './map-style';

// ----------------------------------------------------------------------

function MapHeatmap({ ...other }: MapBoxProps) {
  const [allDays, useAllDays] = useState(true);

  const [timeRange, setTimeRange] = useState([0, 0]);

  const [selectedTime, selectTime] = useState(0);

  const [earthquakes, setEarthQuakes] = useState();

  useEffect(() => {
    fetch('https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson')
      .then((resp) => resp.json())
      .then((json) => {
        const { features } = json;

        const endTime = features[0].properties.time;

        const startTime = features[features.length - 1].properties.time;

        setTimeRange([startTime, endTime]);

        setEarthQuakes(json);

        selectTime(endTime);
      })
      .catch((error) => console.error('Could not load data', error));
  }, []);

  const data: any = useMemo(
    () => (allDays ? earthquakes : filterFeaturesByDay(earthquakes, selectedTime)),
    [earthquakes, allDays, selectedTime]
  );

  return (
    <>
      <Map
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3,
        }}
        {...other}
      >
        {data && (
          <Source type="geojson" data={data}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
      </Map>

      <ControlPanel
        startTime={timeRange[0]}
        endTime={timeRange[1]}
        selectedTime={selectedTime}
        allDays={allDays}
        onChangeTime={selectTime}
        onChangeAllDays={useAllDays}
      />
    </>
  );
}

export default memo(MapHeatmap);

// ----------------------------------------------------------------------

function filterFeaturesByDay(
  featureCollection:
    | {
        features: any[];
      }
    | undefined,
  time: number
) {
  const date = new Date(time);

  const year = date.getFullYear();

  const month = date.getMonth();

  const day = date.getDate();

  const features = featureCollection?.features.filter((feature) => {
    const featureDate = new Date(feature.properties?.time);

    return (
      featureDate.getFullYear() === year &&
      featureDate.getMonth() === month &&
      featureDate.getDate() === day
    );
  });
  return { type: 'FeatureCollection', features };
}
