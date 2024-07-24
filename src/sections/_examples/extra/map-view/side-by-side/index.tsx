import { useState, useCallback, useMemo, memo } from 'react';
import Map, { ViewStateChangeEvent } from 'react-map-gl';
// components
import { MapBoxProps } from 'src/components/map';
//
import ControlPanel, { ModeProps } from './control-panel';

// ----------------------------------------------------------------------

const LeftMapStyle: React.CSSProperties = {
  position: 'absolute',
  width: '50%',
  height: '100%',
};

const RightMapStyle: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  width: '50%',
  height: '100%',
};

// ----------------------------------------------------------------------

function MapSideBySide({ ...other }: MapBoxProps) {
  const [viewState, setViewState] = useState({
    longitude: -122.43,
    latitude: 37.78,
    zoom: 12,
    pitch: 30,
  });

  const [mode, setMode] = useState<ModeProps>('side-by-side');

  const [activeMap, setActiveMap] = useState<'left' | 'right'>('left');

  const onLeftMoveStart = useCallback(() => setActiveMap('left'), []);

  const onRightMoveStart = useCallback(() => setActiveMap('right'), []);

  const onMove = useCallback((event: ViewStateChangeEvent) => setViewState(event.viewState), []);

  const width = typeof window === 'undefined' ? 100 : window.innerWidth;

  const leftMapPadding = useMemo(
    () => ({
      left: mode === 'split-screen' ? width / 2 : 0,
      top: 0,
      right: 0,
      bottom: 0,
    }),
    [width, mode]
  );

  const rightMapPadding = useMemo(
    () => ({
      right: mode === 'split-screen' ? width / 2 : 0,
      top: 0,
      left: 0,
      bottom: 0,
    }),
    [width, mode]
  );

  const handleChangeMode = (event: React.MouseEvent<HTMLElement>, newMode: ModeProps | null) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <>
      <Map
        id="left-map"
        {...viewState}
        padding={leftMapPadding}
        onMoveStart={onLeftMoveStart}
        onMove={(event) => {
          if (activeMap === 'left') {
            onMove(event);
          }
        }}
        style={LeftMapStyle}
        mapStyle="mapbox://styles/mapbox/light-v10"
        {...other}
      />

      <Map
        id="right-map"
        {...viewState}
        padding={rightMapPadding}
        onMoveStart={onRightMoveStart}
        onMove={(event) => {
          if (activeMap === 'right') {
            onMove(event);
          }
        }}
        style={RightMapStyle}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        {...other}
      />

      <ControlPanel mode={mode} onModeChange={handleChangeMode} />
    </>
  );
}

export default memo(MapSideBySide);
