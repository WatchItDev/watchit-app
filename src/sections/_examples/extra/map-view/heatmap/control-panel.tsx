import { memo } from 'react';
// @mui
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// utils
import { fDate } from 'src/utils/format-time';
// components
import { StyledControlPanel } from 'src/components/map';

// ----------------------------------------------------------------------

type Props = {
  startTime: number;
  endTime: number;
  allDays: boolean;
  selectedTime: number;
  onChangeTime: (value: number) => void;
  onChangeAllDays: (value: boolean) => void;
};

function ControlPanel({
  startTime,
  endTime,
  allDays,
  selectedTime,
  onChangeTime,
  onChangeAllDays,
}: Props) {
  const day = 24 * 60 * 60 * 1000;

  const days = Math.round((endTime - startTime) / day);

  const selectedDay = Math.round((selectedTime - startTime) / day);

  const handleChangeDays = (value: number) => {
    const daysToAdd = value;

    const newTime = startTime + daysToAdd * day;

    onChangeTime(newTime);
  };

  return (
    <StyledControlPanel>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'common.white' }}>
          All Days
        </Typography>

        <Switch
          size="small"
          checked={allDays}
          onChange={(event) => onChangeAllDays(event.target.checked)}
        />
      </Box>

      <br />

      <Typography
        gutterBottom
        variant="body2"
        sx={{ color: allDays ? 'text.disabled' : 'common.white' }}
      >
        Each Day: {fDate(selectedTime)}
      </Typography>

      <Slider
        min={1}
        step={1}
        max={days}
        disabled={allDays}
        value={selectedDay}
        onChange={(event, newValue) => {
          if (typeof newValue === 'number') handleChangeDays(newValue);
        }}
      />
    </StyledControlPanel>
  );
}

export default memo(ControlPanel);
