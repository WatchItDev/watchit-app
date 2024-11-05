// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CustomDateRangePicker, { useDateRangePicker } from '@src/components/custom-date-range-picker';
// utils
import { fDate } from '@src/utils/format-time';
//
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

export default function PickerDateRange() {
  const rangeInputPicker = useDateRangePicker(new Date(), new Date());

  const rangeCalendarPicker = useDateRangePicker(new Date(), null);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        <ComponentBlock title="Input">
          <Button variant="contained" onClick={rangeInputPicker.onOpen}>
            Click me!
          </Button>

          <Stack sx={{ typography: 'body2', mt: 3 }}>
            <div>
              <strong>Start:</strong> {fDate(rangeInputPicker.startDate)}
            </div>
            <div>
              <strong>End:</strong> {fDate(rangeInputPicker.endDate)}
            </div>
          </Stack>

          <CustomDateRangePicker
            open={rangeInputPicker.open}
            startDate={rangeInputPicker.startDate}
            endDate={rangeInputPicker.endDate}
            onChangeStartDate={rangeInputPicker.onChangeStartDate}
            onChangeEndDate={rangeInputPicker.onChangeEndDate}
            onClose={rangeInputPicker.onClose}
            error={rangeInputPicker.error}
          />
        </ComponentBlock>

        <ComponentBlock title="Calendar">
          <Button variant="contained" onClick={rangeCalendarPicker.onOpen}>
            Click me!
          </Button>

          <Stack sx={{ typography: 'body2', mt: 3 }}>
            <div>
              <strong>Start:</strong> {fDate(rangeCalendarPicker.startDate)}
            </div>
            <div>
              <strong>End:</strong> {fDate(rangeCalendarPicker.endDate)}
            </div>
          </Stack>

          <CustomDateRangePicker
            variant="calendar"
            open={rangeCalendarPicker.open}
            startDate={rangeCalendarPicker.startDate}
            endDate={rangeCalendarPicker.endDate}
            onChangeStartDate={rangeCalendarPicker.onChangeStartDate}
            onChangeEndDate={rangeCalendarPicker.onChangeEndDate}
            onClose={rangeCalendarPicker.onClose}
            error={rangeCalendarPicker.error}
          />
        </ComponentBlock>
      </Box>
    </>
  );
}
