import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import type { TimeSlot } from '../types';
import { useWidget } from '../context/widget-context.tsx';

const OPTIONS: { key: TimeSlot; label: string; short: string; tip: string }[] = [
  { key: 'lt5', label: 'Quick break (≤ 5 min)', short: '≤5m', tip: 'Great for tiny breaks or trailers' },
  { key: 'm10', label: '10 min snack', short: '10m', tip: 'Short-form clips or mini-episodes' },
  { key: 'm20', label: '20 min episode', short: '20m', tip: 'Classic sitcom or short doc' },
  { key: 'm30', label: '30 min short film', short: '30m', tip: 'Deeper dive without commitment' },
  { key: 'h1', label: '1 hour movie', short: '1h', tip: 'Tight feature or two episodes' },
  { key: 'gt1h', label: 'Long session (1h+)', short: '1h+', tip: 'Settle in for the long haul' },
];

const Tile = styled(Paper)(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  padding: theme.spacing(1.2),
  borderRadius: 12,
  cursor: 'pointer',
  transition: 'transform 160ms ease, box-shadow 160ms ease',
  '&:hover': { transform: 'translateY(-1px)', boxShadow: theme.shadows[6] },
}));

export const timeShort = (k?: TimeSlot) => OPTIONS.find(o => o.key === k)?.short ?? 'Time';

export default function TimePickerInline() {
  const { state, dispatch } = useWidget();
  return (
    <Collapse in={state.ui.showTimePanel} timeout={240} unmountOnExit>
      <Typography variant="caption" sx={{ mb: 0.5 }}>Select time</Typography>
      <Grid container spacing={1}>
        {OPTIONS.map(({ key, label, tip }) => {
          const active = state.selection.time === key;
          return (
            <Grid item xs={6} key={key}>
              <Tooltip title={tip}>
                <Tile elevation={active ? 6 : 1} onClick={() => dispatch({ type: 'SET_TIME', time: key })} sx={active ? { bgcolor: 'primary.main', color: 'primary.contrastText' } : undefined}>
                  <Typography variant="caption">{label}</Typography>
                </Tile>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Collapse>
  );
}
