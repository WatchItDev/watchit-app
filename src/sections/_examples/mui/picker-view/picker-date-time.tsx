import { useState } from 'react';
// @mui
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import Stack from '@mui/material/Stack';
//
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

export default function PickerDateTime() {
  const [value, setValue] = useState<Date | null>(new Date());

  const [valueResponsive, setValueResponsive] = useState<Date | null>(
    new Date('2018-01-01T00:00:00.000Z')
  );

  return (
    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
      <ComponentBlock title="Basic">
        <DateTimePicker
          label="DateTimePicker"
          value={value}
          onChange={setValue}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      </ComponentBlock>

      <ComponentBlock title="Responsiveness">
        <MobileDateTimePicker
          value={valueResponsive}
          onChange={(newValue) => {
            setValueResponsive(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />

        <DesktopDateTimePicker
          value={valueResponsive}
          onChange={(newValue) => {
            setValueResponsive(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />

        <DateTimePicker
          value={valueResponsive}
          onChange={(newValue) => {
            setValueResponsive(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />
      </ComponentBlock>
    </Stack>
  );
}
