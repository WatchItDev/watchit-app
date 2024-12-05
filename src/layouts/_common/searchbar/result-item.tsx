// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
// components
import Label from '@src/components/label';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  subtitle: string;
  groupLabel: string;
  onClickItem: VoidFunction;
};

export default function ResultItem({ title, subtitle, groupLabel, onClickItem }: Props) {
  return (
    <ListItemButton
      onClick={onClickItem}
      sx={{
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'transparent',
        borderBottomColor: (theme) => theme.palette.divider,
        '&:hover': {
          borderRadius: 1,
          borderColor: (theme) => theme.palette.primary.main,
          backgroundColor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        },
      }}
    >
      <ListItemText
        primaryTypographyProps={{
          typography: 'subtitle2',
          sx: { textTransform: 'capitalize' },
        }}
        secondaryTypographyProps={{ typography: 'caption' }}
        primary={
          <Box
            component="span"
            sx={{
              color: '#fff',
            }}
          >
            {title}
          </Box>
        }
        secondary={
          <Box
            component="span"
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {subtitle}
          </Box>
        }
      />

      {groupLabel && (
        <Label color="info" sx={{ flexShrink: 0, marginLeft: '8px' }}>
          {groupLabel}
        </Label>
      )}
    </ListItemButton>
  );
}
