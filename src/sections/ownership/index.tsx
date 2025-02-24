import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2"
import OwnershipProcess from "@src/sections/ownership/components/ownership-process.tsx"

const Ownership = () => {
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
            <OwnershipProcess/>
          </Stack>
        </Grid>
      </Grid>

    </Container>
  )
}

export default Ownership
