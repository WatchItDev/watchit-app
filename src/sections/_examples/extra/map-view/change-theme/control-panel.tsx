import { memo } from 'react';
// @mui
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
// components
import { StyledControlPanel } from 'src/components/map';

// ----------------------------------------------------------------------

type Props = {
  themes: {
    [key: string]: string;
  };
  selectTheme: string;
  onChangeTheme: (theme: string) => void;
};

function ControlPanel({ themes, selectTheme, onChangeTheme }: Props) {
  return (
    <StyledControlPanel>
      <Typography gutterBottom variant="subtitle2" sx={{ color: 'common.white' }}>
        Select Theme:
      </Typography>

      <RadioGroup value={selectTheme} onChange={(event, newValue) => onChangeTheme(newValue)}>
        {Object.keys(themes).map((item) => (
          <FormControlLabel
            key={item}
            value={item}
            control={<Radio size="small" />}
            label={item}
            sx={{ color: 'common.white', textTransform: 'capitalize' }}
          />
        ))}
      </RadioGroup>
    </StyledControlPanel>
  );
}

export default memo(ControlPanel);
