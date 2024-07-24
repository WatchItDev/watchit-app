import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import AppBar from '@mui/material/AppBar';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import FormLabel from '@mui/material/FormLabel';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import {
  NavSectionMini,
  NavConfigProps,
  NavSectionVertical,
  NavSectionHorizontal,
} from 'src/components/nav-section';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const defaultConfig = {
  itemGap: 4,
  iconSize: 24,
  currentRole: 'admin',
  itemRootHeight: 44,
  itemSubHeight: 36,
  itemPadding: '4px 8px 4px 12px',
  itemRadius: 8,
  hiddenLabel: false,
};

export default function NavigationBarView() {
  const [config, setConfig] = useState(defaultConfig);

  const canReset = !isEqual(defaultConfig, config);

  const handleChangeConfig = useCallback((name: string, value: string | number | boolean) => {
    setConfig((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  const renderVertical = (
    <Stack spacing={2}>
      <Typography variant="h6"> Nav Vertical </Typography>

      <NavSectionVertical
        data={NAV_ITEMS}
        config={config}
        sx={{
          py: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.z20,
        }}
      />
    </Stack>
  );

  const renderMini = (
    <Stack spacing={2}>
      <Typography variant="h6"> Nav Mini </Typography>

      <NavSectionMini
        data={NAV_ITEMS}
        config={config}
        sx={{
          py: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.z20,
        }}
      />
    </Stack>
  );

  const renderHorizontal = (
    <Stack spacing={2}>
      <Typography variant="h6"> Nav Horizontal </Typography>
      <AppBar
        position="static"
        component="nav"
        sx={{
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows.z20,
        }}
      >
        <Toolbar>
          <NavSectionHorizontal data={NAV_ITEMS} config={config} />
        </Toolbar>
      </AppBar>
    </Stack>
  );

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Navigation Bar"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Navigation Bar' },
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        {renderHorizontal}

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            p: 5,
            mt: 5,
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          }}
        >
          {renderVertical}

          {renderMini}

          <Controls
            config={config}
            onChangeConfig={handleChangeConfig}
            canReset={canReset}
            onReset={handleReset}
          />
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

type ControlsProps = {
  config: NavConfigProps;
  onChangeConfig: (name: string, value: string | number | boolean) => void;
  //
  canReset: boolean;
  onReset: VoidFunction;
};

function Controls({ config, onChangeConfig, canReset, onReset }: ControlsProps) {
  return (
    <Stack component={Paper} variant="outlined" spacing={3} sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Controls</Typography>

        {canReset && (
          <IconButton onClick={onReset}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        )}
      </Stack>

      {/* Gap */}
      <TextField
        label="Item Gap"
        type="number"
        value={config.itemGap || ''}
        onChange={(event) => onChangeConfig('itemGap', Number(event.target.value))}
      />

      {/* Size */}
      <TextField
        select
        label="Icon Size"
        value={config.iconSize}
        onChange={(event) => onChangeConfig('iconSize', Number(event.target.value))}
        SelectProps={{
          native: true,
        }}
      >
        {[16, 20, 24, 28, 32, 36, 40].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </TextField>

      {/* Radius */}
      <TextField
        select
        label="Item Radius"
        value={config.itemRadius}
        onChange={(event) => onChangeConfig('itemRadius', Number(event.target.value) || 0.5)}
        SelectProps={{
          native: true,
        }}
      >
        {[0, 4, 8, 12, 16, 20, 24].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </TextField>

      {/* Role */}
      <RadioGroup
        value={config.currentRole}
        onChange={(event) => onChangeConfig('currentRole', event.target.value)}
      >
        <FormLabel>Role</FormLabel>
        {['admin', 'user'].map((role) => (
          <FormControlLabel
            key={role}
            value={role}
            control={<Radio />}
            label={role}
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </RadioGroup>

      {/* Root Height */}
      <TextField
        label="Root Height"
        type="number"
        value={config.itemRootHeight || ''}
        onChange={(event) => onChangeConfig('itemRootHeight', Number(event.target.value))}
      />

      {/* Sub Height */}
      <TextField
        label="Sub Height"
        type="number"
        value={config.itemSubHeight || ''}
        onChange={(event) => onChangeConfig('itemSubHeight', Number(event.target.value))}
      />

      {/* Padding */}
      <TextField
        label="Item Padding"
        value={config.itemPadding || ''}
        onChange={(event) => onChangeConfig('itemPadding', event.target.value)}
      />

      <FormControlLabel
        control={
          <Switch
            checked={config.hiddenLabel}
            onClick={() => onChangeConfig('hiddenLabel', !config.hiddenLabel)}
          />
        }
        label="Hidden Label"
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    subheader: 'Marketing',
    items: [
      {
        title: 'Landing',
        path: '#',
        icon: <Iconify icon="carbon:bat" width={1} />,
        roles: ['admin'],
        caption: 'Display only admin role',
      },
      {
        title: 'Services',
        path: '#',
        icon: <Iconify icon="carbon:cyclist" width={1} />,
        roles: ['admin', 'user'],
      },
      {
        title: 'Case Studies',
        path: '#',
        icon: <Iconify icon="carbon:3d-cursor-alt" width={1} />,
        info: <Label color="error">+32</Label>,
        children: [
          { title: 'Case Studies', path: '#' },
          { title: 'Case Study', path: '#' },
        ],
      },
      {
        title: 'Blog',
        path: '#',
        icon: <Iconify icon="carbon:3d-mpr-toggle" width={1} />,
        children: [
          { title: 'Blog Posts', path: '#' },
          { title: 'Blog Post', path: '#' },
        ],
      },
      {
        title: 'About',
        path: '#',
        icon: <Iconify icon="carbon:airport-01" width={1} />,
      },
      {
        title: 'Contact',
        path: '#',
        icon: <Iconify icon="carbon:battery-full" width={1} />,
      },
      {
        title: 'Tours',
        path: '#',
        icon: <Iconify icon="carbon:basketball" width={1} />,
        children: [
          { title: 'Tours', path: '#' },
          { title: 'Tour', path: '#' },
        ],
      },
      {
        title: 'Checkout',
        path: '#',
        icon: <Iconify icon="carbon:area" width={1} />,
        children: [
          { title: 'Checkout', path: '#' },
          { title: 'Checkout Complete', path: '#' },
        ],
      },
    ],
  },
  {
    subheader: 'Travel',
    items: [
      {
        title: 'Level 1',
        path: '#',
        icon: <Iconify icon="carbon:play" width={1} />,
        children: [
          { title: 'Level 2.1', path: '#' },
          { title: 'Level 2.2', path: '#' },
          {
            title: 'Level 2.3',
            path: '#',
            children: [
              { title: 'Level 3.1', path: '#' },
              { title: 'Level 3.2', path: '#' },
            ],
          },
        ],
      },
    ],
  },
];
