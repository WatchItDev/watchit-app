// @mui
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
// components
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

interface ControlPanelProps extends PaperProps {
  variantKey: {
    type: string;
    values: string[];
  }[];
  selectVariant: string;
  onChangeVariant: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ControlPanel({
  variantKey,
  selectVariant,
  onChangeVariant,
  sx,
}: ControlPanelProps) {
  return (
    <Paper variant="outlined" sx={{ height: 480, ...sx }}>
      <Scrollbar>
        <RadioGroup value={selectVariant} onChange={onChangeVariant} sx={{ px: 1, py: 1 }}>
          {variantKey.map((variant) => (
            <Box key={variant.type} sx={{ my: 1.5 }}>
              <Typography variant="overline" sx={{ px: 1, mb: 1, display: 'block' }}>
                {variant.type}
              </Typography>
              {variant.values.map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  label={value}
                  control={<Radio sx={{ display: 'none' }} />}
                  sx={{
                    px: 1,
                    py: 0.5,
                    mx: 0,
                    my: 0.25,
                    width: '100%',
                    borderRadius: 0.75,
                    color: 'text.secondary',
                    ...(selectVariant === value && {
                      color: 'warning.contrastText',
                    }),
                    ...(selectVariant === value && { bgcolor: 'warning.main' }),
                  }}
                />
              ))}
            </Box>
          ))}
        </RadioGroup>
      </Scrollbar>
    </Paper>
  );
}
