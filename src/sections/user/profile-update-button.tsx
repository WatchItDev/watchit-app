import Button from "@mui/material/Button";
import Iconify from "@src/components/iconify";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {UpdateModal} from "@src/components/update-modal";
import {useCallback, useEffect, useRef, useState} from "react";

const ProfileUpdateButton = () => {
  const open = Boolean();
  const navRef = useRef(null);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpenTooltip(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpenTooltip(false);
  }, []);

  useEffect(() => {
    if (open) {
      handleClose();
    }
  }, [handleClose, open]);

  return (
    <>
      <Button
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        ref={navRef}
        variant="outlined"
        sx={{
          p: 1,
          minWidth: "44px",
          backgroundColor: "transparent",
        }}
        onClick={() => setIsUpdateModalOpen(true)}>
        <Iconify icon="mingcute:user-edit-line" width={20} />
      </Button>
      <Popover
        open={openTooltip}
        anchorEl={navRef.current}
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
        transformOrigin={{vertical: "bottom", horizontal: "center"}}
        slotProps={{
          paper: {
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
            sx: {
              mt: 6,
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: "8px 20px",
              ...(open && {
                pointerEvents: "auto",
              }),
            },
          },
        }}
        sx={{
          pointerEvents: "none",
        }}>
        <Typography>Update your profile information</Typography>
      </Popover>

      <UpdateModal open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />
    </>
  );
};

export default ProfileUpdateButton;
