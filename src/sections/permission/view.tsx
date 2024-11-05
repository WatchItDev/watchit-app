import { useState, useCallback } from 'react';
// @mui
import Container from '@mui/material/Container';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// routes
import { paths } from '@src/routes/paths';

// components
import { useSettingsContext } from '@src/components/settings';
import CustomBreadcrumbs from '@src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function PermissionDeniedView() {
  const settings = useSettingsContext();

  const [role, setRole] = useState('admin');

  const handleChangeRole = useCallback(
    (event: React.MouseEvent<HTMLElement>, newRole: string | null) => {
      if (newRole !== null) {
        setRole(newRole);
      }
    },
    []
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Permission Denied"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Permission Denied',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToggleButtonGroup
        exclusive
        value={role}
        size="small"
        onChange={handleChangeRole}
        sx={{ mb: 5 }}
      >
        <ToggleButton value="admin" aria-label="admin role">
          isAdmin
        </ToggleButton>

        <ToggleButton value="user" aria-label="user role">
          isUser
        </ToggleButton>
      </ToggleButtonGroup>
    </Container>
  );
}
