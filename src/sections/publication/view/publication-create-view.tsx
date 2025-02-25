// @mui
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// components
import {useSettingsContext} from "@src/components/settings";
//
import {IconChevronLeft} from "@tabler/icons-react";
import PublicationNewWizard from "../publication-new-wizard.tsx";
import Header from "../../../layouts/dashboard/header";
import Label from "../../../components/label";
import {useResponsive} from "@src/hooks/use-responsive.ts";

// ----------------------------------------------------------------------

export default function PublicationCreateView() {
  const settings = useSettingsContext();
  const mdUp = useResponsive("up", "md");

  const handleBack = () => {};

  return (
    <>
      <Header>
        <Button
          onClick={handleBack}
          disableFocusRipple
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#24262A",
            borderRadius: 1.5,
            m: 1,
            p: 0.2,
            "&:hover": {
              backgroundColor: "#1E1F22",
            },
          }}>
          <IconButton disableRipple>
            <IconChevronLeft size={20} />
            <Typography sx={{ml: 1}} variant="subtitle2">
              Back
            </Typography>
          </IconButton>

          {mdUp && <Label sx={{px: 0.75, mr: 1, fontSize: 12, color: "text.secondary"}}>Esc</Label>}
        </Button>
        <Typography variant="h6" sx={{ml: 2}}>
          New movie
        </Typography>
      </Header>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        {/* <MovieNewEditForm /> */}
        <PublicationNewWizard />
      </Container>
    </>
  );
}
