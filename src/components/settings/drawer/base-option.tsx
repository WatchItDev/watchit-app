// @mui
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
//
import SvgColor from '../../svg-color';

// ----------------------------------------------------------------------

type Props = {
  icons: string[];
  options: string[];
  value: string;
  onChange: (newValue: string) => void;
};

export default function BaseOptions({ icons, options, value, onChange }: Props) {
  return (
    <Stack direction="row" spacing={2}>
      {options.map((option, index) => {
        const selected = value === option;

        return (
          <ButtonBase
            key={option}
            onClick={() => onChange(option)}
            sx={{
              width: 1,
              height: 80,
              borderRadius: 1,
              border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
              ...(selected && {
                bgcolor: 'background.paper',
                boxShadow: (theme) =>
                  `-24px 8px 24px -4px ${alpha(
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[500]
                      : theme.palette.common.black,
                    0.08
                  )}`,
              }),
              '& .svg-color': {
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.grey[500]} 0%, ${theme.palette.grey[600]} 100%)`,
                ...(selected && {
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                }),
              },
            }}
          >
            <SvgColor src={`/assets/icons/setting/ic_${index === 0 ? icons[0] : icons[1]}.svg`} />
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
