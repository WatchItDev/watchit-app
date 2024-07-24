import { memo } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
// components
import { MapSettingKeys, MapSettings, StyledControlPanel } from 'src/components/map';

// ----------------------------------------------------------------------

const StyledRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textTransform: 'capitalize',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

const camelPattern = /(^|[A-Z])[a-z]*/g;

function formatSettingName(name: string) {
  return name.match(camelPattern)?.join(' ');
}

type Props = {
  settings: MapSettings;
  onChange: (name: MapSettingKeys, value: boolean | number) => void;
};

function ControlPanel({ settings, onChange }: Props) {
  const renderSetting = (name: MapSettingKeys, value: boolean | number) => {
    switch (typeof value) {
      case 'boolean':
        return (
          <StyledRow key={name}>
            <Typography variant="body2">{formatSettingName(name)}</Typography>
            <Switch
              size="small"
              checked={value}
              onChange={(event) => onChange(name, event.target.checked)}
            />
          </StyledRow>
        );
      case 'number':
        return (
          <StyledRow key={name}>
            <Typography variant="body2">{formatSettingName(name)}</Typography>
            <InputBase
              value={value}
              onChange={(event) => onChange(name, Number(event.target.value))}
              inputProps={{ type: 'number' }}
              sx={{
                '& input': {
                  py: 0.25,
                  width: 40,
                  fontSize: 14,
                  borderRadius: 0.5,
                  textAlign: 'center',
                  color: 'common.white',
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                },
              }}
            />
          </StyledRow>
        );
      default:
        return null;
    }
  };

  return (
    <StyledControlPanel>
      {Object.keys(settings).map((name) =>
        renderSetting(name as MapSettingKeys, settings[name as MapSettingKeys])
      )}
    </StyledControlPanel>
  );
}

export default memo(ControlPanel);
