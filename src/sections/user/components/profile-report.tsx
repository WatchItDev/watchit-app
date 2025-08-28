import { IconDots } from '@tabler/icons-react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import { FC, useState } from 'react';
import { ReportProfileModal } from '@src/components/report-profile-modal.tsx';
import styled from '@emotion/styled';
import { User } from '@src/graphql/generated/graphql.ts';

interface ProfileReportProps {
  profile: User;
}

const StyledButton = styled(Button)`
  border-color: #ffffff;
  color: #ffffff;
  height: 40px;
  min-width: 40px;
  position: absolute;
  z-index: 1;
  right: 5px;
  top: 5px;
`;

const StyledPopover = styled(Popover)`
  .MuiPaper-root {
    background: linear-gradient(90deg, #1c1c1e, #2c2c2e);
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    margin-left: -24px;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
`;

const StyledMenuItem = styled(MenuItem)`
  padding: 8px;
`;

const ProfileReport: FC<ProfileReportProps> = ({ profile }) => {
  const [openReportModal, setOpenReportModal] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );
  const openMenu = Boolean(menuAnchorEl);

  return (
    <>
      <StyledButton
        variant="text"
        onClick={(event) => setMenuAnchorEl(event.currentTarget)}
      >
        <IconDots size={22} color="#FFFFFF" />
      </StyledButton>

      <StyledPopover
        open={openMenu}
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Stack direction="column" spacing={0} justifyContent="center">
          <StyledMenuItem
            onClick={() => {
              setOpenReportModal(true);
              setMenuAnchorEl(null);
            }}
          >
            Report
          </StyledMenuItem>
        </Stack>
      </StyledPopover>

      <ReportProfileModal
        profile={profile}
        isOpen={openReportModal}
        onClose={() => setOpenReportModal(false)}
      />
    </>
  );
};

export default ProfileReport;
