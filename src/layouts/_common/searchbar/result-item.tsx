import Box from '@mui/material/Box'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { alpha } from '@mui/material/styles'
import Label from '@src/components/label'
import { COLORS } from '@src/layouts/config-layout.ts'

type Props = {
  title: string;
  subtitle: string;
  groupLabel: string;
  onClickItem: VoidFunction;
  query?: string;
};

const highlightText = (text: string, query: string) => {
  if (!query) return text
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={index}
        style={{ backgroundColor: 'white', color: COLORS.GRAY_DARK, fontWeight: 'bold' }}
      >
        {part}
      </span>
    ) : (
      part
    )
  )
}

export default function ResultItem({
  title,
  subtitle,
  groupLabel,
  onClickItem,
  query = '',
}: Props) {
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
            {highlightText(title, query)}
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
            {highlightText(subtitle, query)}
          </Box>
        }
      />

      {groupLabel && (
        <Label color="info" sx={{ flexShrink: 0, marginLeft: '8px' }}>
          {groupLabel}
        </Label>
      )}
    </ListItemButton>
  )
}
