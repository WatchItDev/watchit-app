import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { icons } from '@tabler/icons-react';
import { useWidget } from '../context/widget-context.tsx';
import { timeShort } from './time-picker-inline.tsx';

export default function QuickControls() {
  const { state, dispatch } = useWidget();
  const moodActive = Boolean(state.selection.mood);
  const timeActive = Boolean(state.selection.time);

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Tooltip title={moodActive ? `Current mood: ${state.selection.mood}` : 'Pick how you feel'}>
        <Button
          size="small"
          startIcon={<icons.IconMoodSmile size={16} />}
          onClick={() => dispatch({ type: 'TOGGLE_MOOD_PANEL' })}
          variant={moodActive ? 'contained' : 'outlined'}
          color={moodActive ? 'primary' : 'inherit'}
        >
          {state.selection.mood ?? 'Mood'}
        </Button>
      </Tooltip>
      <Tooltip title={timeActive ? `Time available: ${timeShort(state.selection.time)}` : 'How much time you have'}>
        <Button
          size="small"
          startIcon={<icons.IconClock size={16} />}
          onClick={() => dispatch({ type: 'TOGGLE_TIME_PANEL' })}
          variant={timeActive ? 'contained' : 'outlined'}
          color={timeActive ? 'primary' : 'inherit'}
        >
          {timeShort(state.selection.time as any)}
        </Button>
      </Tooltip>
    </Stack>
  );
}
