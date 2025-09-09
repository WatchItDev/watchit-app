import { useMemo, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha, styled } from '@mui/material/styles';
import { icons } from '@tabler/icons-react';

type Slide = { title: string; body: string; img: string };

const Dot = styled('span')<{ active?: boolean }>(({ theme, active }) => ({
  width: 8,
  height: 8,
  borderRadius: 999,
  transition: 'all .2s ease',
  background: active ? theme.palette.text.primary : alpha(theme.palette.text.primary, 0.35),
}));

export default function OnboardingCarousel({ onDone }: { onDone: () => void }) {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: 'Find what you want',
        body:
          'No more time waste. Describe what you want to see, your mood or your available time and Watchit finds the perfect content for you.',
        img: '/onboarding/v2_onboarding_1.png',
      },
      {
        title: 'Write or speak',
        body: 'Type a prompt or use the mic — we parse your intention in natural language.',
        img: '/onboarding/v2_onboarding_2.png',
      },
      {
        title: 'Learns your taste',
        body: 'We adapt from likes, skips and completion to get better over time.',
        img: '/onboarding/v2_onboarding_3.png',
      },
      {
        title: 'One micro-question max',
        body: 'If a key detail is missing, resolve it quickly with chips. No long forms.',
        img: '/onboarding/v2_onboarding_4.png',
      },
      {
        title: 'Top Picks in one tap',
        body: 'From prompt to play in seconds with action-ready cards.',
        img: '/onboarding/v2_onboarding_5.png',
      },
      {
        title: 'Privacy & control',
        body: 'Incognito, “Why this?” and quick adjustments always available.',
        img: '/onboarding/v2_onboarding_6.png',
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  // accesible con teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key.toLowerCase() === 'escape') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Stack spacing={2} sx={{ color: '#e7eaf3' }}>
      {/* Omitir = siempre visible */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
        <Tooltip title="Omit onboarding">
          <Button
            onClick={onDone}
            size="small"
            color="inherit"
            startIcon={<icons.IconPlayerSkipForward size={16} />}
            sx={{ opacity: 0.9 }}
          >
            Omitir
          </Button>
        </Tooltip>
      </Box>

      {/* HERO 16:9 con imagen estilo mock */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          aspectRatio: '16/9',
          bgcolor: (t) => alpha(t.palette.common.black, 0.3),
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        <img
          src={slides[index].img}
          alt={slides[index].title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </Box>

      {/* Título + cuerpo centrados */}
      <Stack spacing={1} textAlign="center" sx={{ px: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          {slides[index].title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          {slides[index].body}
        </Typography>
      </Stack>

      {/* Pagers como en el diseño */}
      <Stack direction="row" justifyContent="center" spacing={1}>
        {slides.map((_, i) => (
          <Dot key={i} active={i === index} />
        ))}
      </Stack>

      {/* Barra inferior: Back / Next (o Empezar) */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
        <Tooltip title="Atrás" disableHoverListener={index === 0}>
          <span>
            <Button
              onClick={prev}
              disabled={index === 0}
              color="inherit"
              startIcon={<icons.IconArrowLeft size={18} />}
            >
              Back
            </Button>
          </span>
        </Tooltip>

        {index < slides.length - 1 ? (
          <Button onClick={next} color="inherit" endIcon={<icons.IconArrowRight size={18} />}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={onDone} endIcon={<icons.IconSparkles size={18} />}>
            Start
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
