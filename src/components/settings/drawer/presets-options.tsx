// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
// theme
import { primaryPresets } from 'src/theme/options/presets';

// ----------------------------------------------------------------------

type PresetsOptionsProps = {
  value: string;
  onChange: (newValue: string) => void;
};

export default function PresetsOptions({ value, onChange }: PresetsOptionsProps) {
  const options = primaryPresets.map((color) => ({
    name: color.name,
    value: color.main,
  }));

  return (
    <Box columnGap={2} rowGap={1.5} display="grid" gridTemplateColumns="repeat(3, 1fr)">
      {options.map((option) => {
        const selected = value === option.name;

        return (
          <ButtonBase
            key={option.name}
            onClick={() => onChange(option.name)}
            sx={{
              height: 56,
              borderRadius: 1,
              border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
              ...(selected && {
                borderColor: 'transparent',
                bgcolor: alpha(option.value, 0.08),
              }),
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: option.value,
                transition: (theme) =>
                  theme.transitions.create(['transform'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                ...(selected && {
                  transform: 'scale(2)',
                }),
              }}
            />
          </ButtonBase>
        );
      })}
    </Box>
  );
}
