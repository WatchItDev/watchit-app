import { useState } from 'react';
// @mui
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import Masonry from '@mui/lab/Masonry';
import Stack from '@mui/material/Stack';
//
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

export default function PickerTime() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
      <ComponentBlock title="Basic">
        <TimePicker
          label="12 hours"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />

        <TimePicker
          ampm={false}
          label="24 hours"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />
      </ComponentBlock>

      <ComponentBlock title="Responsiveness">
        <MobileTimePicker
          orientation="portrait"
          label="For mobile"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />

        <DesktopTimePicker
          label="For desktop"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />

        <TimePicker
          value={value}
          onChange={setValue}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />
      </ComponentBlock>

      <ComponentBlock title="Static mode">
        <Stack spacing={3}>
          <StaticTimePicker
            orientation="portrait"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />

          <StaticTimePicker
            ampm
            orientation="landscape"
            openTo="minutes"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        </Stack>
      </ComponentBlock>
    </Masonry>
  );
}
