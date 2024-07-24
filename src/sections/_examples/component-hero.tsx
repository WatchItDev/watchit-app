import { m } from 'framer-motion';
// @mui
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
// components
import { MotionContainer, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(10, 0),
}));

const StyledBg = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  position: 'absolute',
  transform: 'scaleX(-1)',
  ...bgGradient({
    color: alpha(theme.palette.background.default, 0.9),
    imgUrl: '/assets/background/overlay_4.jpg',
  }),
}));

// ----------------------------------------------------------------------

export default function ComponentHero() {
  const smUp = useResponsive('up', 'sm');

  return (
    <StyledRoot>
      <Container
        component={MotionContainer}
        sx={{
          display: { md: 'flex' },
          justifyContent: { md: 'space-between' },
        }}
      >
        <Stack spacing={3}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h3" component="h1">
              Components
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Typography sx={{ color: 'text.secondary' }}>
              With huge resource pack making deployment
              <br /> easy and expanding more effectively
            </Typography>
          </m.div>
        </Stack>

        {smUp && (
          <m.div variants={varFade().inDown}>
            <Box
              component="img"
              alt="illustrations characters"
              src="/assets/illustrations/characters/character_7.png"
              sx={{ maxWidth: 320 }}
            />
          </m.div>
        )}
      </Container>

      <StyledBg />
    </StyledRoot>
  );
}
