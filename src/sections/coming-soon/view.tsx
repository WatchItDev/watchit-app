// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// hooks
import {useCountdownDate} from "@src/hooks/use-countdown";
// assets
import {ComingSoonIllustration} from "@src/assets/illustrations";
import HeaderContent from "@src/layouts/dashboard/header-content.tsx";
import Header from "@src/layouts/dashboard/header.tsx";

// ----------------------------------------------------------------------

interface props {
  deadline?: string;
  showDeadline?: boolean;
  title?: string;
  content?: string;
}

export const ComingSoonView = ({
  deadline = "01/12/2025 21:30",
  showDeadline,
  title = "New Features Coming Soon!",
  content = "We’re working hard to bring this section to life. Check back soon!",
}: props) => {
  const {days, hours, minutes, seconds} = useCountdownDate(new Date(deadline));

  return (
    <>
      <Header>
        <HeaderContent title="New Features Coming Soon" />
      </Header>
      <Typography variant="h3" sx={{mb: 2, mt: 3, width: "100%", textAlign: "center"}}>
        {title}
      </Typography>

      <Typography
        variant={"h6"}
        sx={{
          color: "text.secondary",
          width: {xs: "100%", md: "60%"},
          mx: "auto",
          textAlign: "center",
          mb: 1,
        }}>
        {content}
      </Typography>

      <ComingSoonIllustration sx={{my: 10, height: 240}} />

      {showDeadline && (
        <Stack
          direction="row"
          justifyContent="center"
          divider={<Box sx={{mx: {xs: 1, sm: 2.5}}}>:</Box>}
          sx={{typography: "h2", mb: 4}}>
          <TimeBlock label="Days" value={days} />

          <TimeBlock label="Hours" value={hours} />

          <TimeBlock label="Minutes" value={minutes} />

          <TimeBlock label="Seconds" value={seconds} />
        </Stack>
      )}
    </>
  );
};

// ----------------------------------------------------------------------

interface TimeBlockProps {
  label: string;
  value: string;
}

function TimeBlock({label, value}: TimeBlockProps) {
  return (
    <div>
      <Box> {value} </Box>
      <Box sx={{color: "text.secondary", typography: "body1"}}>{label}</Box>
    </div>
  );
}

export default ComingSoonView;
