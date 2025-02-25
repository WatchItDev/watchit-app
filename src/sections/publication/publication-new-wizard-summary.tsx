import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {Button} from "@mui/material";

export default function ReviewFinalizeForm({onSubmit, onBack, data}: any) {
  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{p: 3}}>
            <Typography variant="h6">Review Information</Typography>
            <Typography variant="body1">Title: {data.title}</Typography>
            <Typography variant="body1">Description: {data.description}</Typography>
          </Stack>
        </Card>
      </Grid>

      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{p: 3}}>
            <FormControlLabel
              control={<Checkbox name="confirmation" />}
              label="I confirm that all provided information is accurate and complete."
            />
          </Stack>
        </Card>
      </Grid>
      <Grid xs={12}>
        <Button onClick={onBack}>Back</Button>
        <LoadingButton type="submit" variant="contained" size="large" onClick={onSubmit}>
          Submit
        </LoadingButton>
      </Grid>
    </Grid>
  );
}
