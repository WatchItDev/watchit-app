import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import StudioProcess from "@src/sections/studio/components/studio-process.tsx";

const Studio = () => {

  return (
    <Container
      sx={{
        marginTop: { xs: '1rem', md: '2rem' },
        marginBottom: '2rem',
        maxWidth: '100% !important',
      }}
    >
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Stack
            direction={{ lg: 'column', xlg: 'row' }}
            spacing={{
              xs: 2,
              lg: 2,
            }}
          >
            <StudioProcess/>
          </Stack>
        </Grid>
      </Grid>

    </Container>
  )

}

export default Studio;