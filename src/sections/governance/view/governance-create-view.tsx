// @mui
import Container from "@mui/material/Container";
// routes
import {paths} from "@src/routes/paths";
// components
import {useSettingsContext} from "@src/components/settings";
import CustomBreadcrumbs from "@src/components/custom-breadcrumbs";
//
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {IconChevronLeft} from "@tabler/icons-react";
import Typography from "@mui/material/Typography";
import GovernanceNewEditForm from "../governance-new-edit-form";
import Label from "../../../components/label";
import Header from "../../../layouts/dashboard/header";
import {useResponsive} from "@src/hooks/use-responsive.ts";
import {useRouter} from "@src/routes/hooks";

// ----------------------------------------------------------------------

export default function GovernanceCreateView() {
  const settings = useSettingsContext();
  const mdUp = useResponsive("up", "md");
  const router = useRouter();

  const handleBack = () => {
    router.push(paths.dashboard.governance.root);
  };

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
      </Header>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Create a new post"
          links={[
            {
              name: "Dashboard",
              href: paths.dashboard.root,
            },
            {
              name: "Blog",
              href: paths.dashboard.post.root,
            },
            {
              name: "Create",
            },
          ]}
          sx={{
            mb: {xs: 3, md: 5},
          }}
        />

        <GovernanceNewEditForm />
      </Container>
    </>
  );
}
