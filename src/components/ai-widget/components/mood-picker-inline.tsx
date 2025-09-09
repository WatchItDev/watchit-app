import React from 'react';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { icons } from '@tabler/icons-react';
import type { Mood } from '../types';
import { useWidget } from '../context/widget-context.tsx';

const moods: { key: Mood; label: string; Icon: React.ElementType; tip: string }[] = [
  { key: 'sad', label: 'Sad', Icon: icons.IconMoodSad, tip: 'Comfort picks and uplifting tones' },
  { key: 'happy', label: 'Happy', Icon: icons.IconMoodHappy, tip: 'Keep the vibe bright and fun' },
  { key: 'tired', label: 'Tired', Icon: icons.IconMoon, tip: 'Low-effort, cozy content' },
  { key: 'mad', label: 'Mad', Icon: icons.IconMoodAngry, tip: 'High-energy to channel it out' },
  { key: 'relaxed', label: 'Relaxed', Icon: icons.IconMoodSmile, tip: 'Chill, documentary, nature' },
  { key: 'excited', label: 'Excited', Icon: icons.IconMoodCrazyHappy, tip: 'Action or sci‑fi bursts' },
];

const Tile = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(1.2),
  borderRadius: 12,
  cursor: 'pointer',
  transition: 'transform 160ms ease, box-shadow 160ms ease',
  '&:hover': { transform: 'translateY(-1px)', boxShadow: theme.shadows[6] },
}));

export default function MoodPickerInline() {
  const { state, dispatch } = useWidget();
  return (
    <Collapse in={state.ui.showMoodPanel} timeout={240} unmountOnExit>
      <Typography variant="caption" sx={{ mb: 0.5 }}>Select mood</Typography>
      <Grid container spacing={1}>
        {moods.map(({ key, label, Icon, tip }) => {
          const active = state.selection.mood === key;
          return (
            <Grid item xs={4} key={key}>
              <Tooltip title={tip}>
                <Tile elevation={active ? 6 : 1} onClick={() => dispatch({ type: 'SET_MOOD', mood: key })} sx={active ? { bgcolor: 'primary.main', color: 'primary.contrastText' } : undefined}>
                  <Icon size={20} />
                  <Typography variant="caption" sx={{ mt: 0.5 }}>{label}</Typography>
                </Tile>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Collapse>
  );
}
