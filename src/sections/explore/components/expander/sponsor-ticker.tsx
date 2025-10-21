import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/material/styles';
import { SPONSOR_MOCKS } from '@src/sections/explore/CONSTANTS';

const sponsorTickerAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

interface SponsorTickerProps {
  expanded: boolean;
}

/** Displays scrolling sponsor placeholders while real data is wired up. */
export const SponsorTicker = ({ expanded }: SponsorTickerProps) => {
  const items = [...SPONSOR_MOCKS, ...SPONSOR_MOCKS];

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: expanded ? 2 : 999,
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.58), rgba(8,10,18,0.72))',
        px: 1.5,
        py: { xs: 0.75, md: 1 },
        pointerEvents: 'none',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 24,
          pointerEvents: 'none',
          zIndex: 1,
        },
        '&::before': {
          left: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.7), transparent)',
        },
        '&::after': {
          right: 0,
          background: 'linear-gradient(270deg, rgba(0,0,0,0.7), transparent)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2.5, md: 3 },
          width: 'max-content',
          animation: `${sponsorTickerAnimation} 18s linear infinite`,
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        {items.map((sponsor, index) => (
          <Box
            key={`${sponsor.name}-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: expanded ? 1.5 : 1,
              minWidth: expanded ? 120 : 'auto',
              color: '#fff',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
              textTransform: expanded ? 'none' : 'uppercase',
            }}
          >
            {expanded ? (
              <Box
                component="img"
                src={sponsor.logo}
                alt={`${sponsor.name} logo`}
                sx={{ height: { xs: 22, md: 28 }, width: 'auto', maxWidth: 140, display: 'block' }}
              />
            ) : (
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.6, whiteSpace: 'nowrap' }}>
                {sponsor.name}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
