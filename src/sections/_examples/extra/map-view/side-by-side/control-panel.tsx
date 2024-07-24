import { memo } from 'react';
// @mui
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// components
import { StyledControlPanel } from 'src/components/map';

// ----------------------------------------------------------------------

export type ModeProps = 'side-by-side' | 'split-screen';

type Props = {
  mode: ModeProps;
  onModeChange: (event: React.MouseEvent<HTMLElement>, newMode: ModeProps | null) => void;
};

function ControlPanel({ mode, onModeChange }: Props) {
  return (
    <StyledControlPanel>
      <ToggleButtonGroup color="primary" value={mode} exclusive onChange={onModeChange}>
        <ToggleButton value="side-by-side">Side by side</ToggleButton>

        <ToggleButton value="split-screen">Split screen</ToggleButton>
      </ToggleButtonGroup>
    </StyledControlPanel>
  );
}

export default memo(ControlPanel);
