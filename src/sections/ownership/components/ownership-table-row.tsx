// MUI IMPORTS
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import { IconButton, MenuItem } from '@mui/material';

// VIEM IMPORTS
import { formatUnits } from 'viem';

// LOCAL IMPORTS
import Iconify from '@src/components/iconify';
import TextMaxLine from "@src/components/text-max-line";
import { OwnershipSettingsModal} from "@src/sections/ownership/components/ownership-settings-modal.tsx";
import CustomPopover, { usePopover } from '@src/components/custom-popover';
import { capitalizeFirstLetter } from '@src/utils/text-transform.ts';
import { useBoolean } from '@src/hooks/use-boolean';
import {LBL_STATUS_COLORS, LBL_TYPE_COLORS} from '@src/sections/ownership/CONSTANTS.tsx'
import {OwnershipTableRowProps} from "@src/sections/ownership/types.ts"
import Stack from "@mui/material/Stack"
import Image from "@src/components/image"
// ----------------------------------------------------------------------
const OwnershipTableRow = ({ row, selected }: Readonly<OwnershipTableRowProps>) => {
  const { name, image, id, description, status, type, restrictions, police  } = row;
  const popover = usePopover();
  const settingsModal = useBoolean();
  const withdrawModal = useBoolean();
  const onSettingRow = () => {
    settingsModal.onTrue();
  };

  const handlePauseToggle = async (checked: boolean) => {
    try {
      console.log('handlePauseToggle', checked);
      popover.onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuccessWithdraw = async () => {
    return Promise.resolve() ;
  };

  const getColorByKey = (colorObj: Record<string, string>, key: string): string => {
    return (key && colorObj[key as keyof typeof colorObj]) || '';
  };

  const renderPrimary = (
    <>
      <TableRow hover selected={selected} key={`table-${id}`}>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Image src={image} alt={name} sx={{ width: 60, height: 60 }} ratio={'1/1'} />
            <ListItemText
              primary={<TextMaxLine line={1}>{name}</TextMaxLine>}
              secondary={<TextMaxLine line={1}>{description}</TextMaxLine>}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
            />
          </Stack>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={police.name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={restrictions ? 'Yes' : 'No'}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <Typography
            component={'span'}
            variant="body2"
            sx={{
              color: getColorByKey(LBL_TYPE_COLORS, type.name.toLowerCase()),
              background: `${getColorByKey(LBL_TYPE_COLORS, type.name.toLowerCase())}12`,
              borderRadius: 1,
              px: 1,
              py: '2px',
            }}
          >
            {capitalizeFirstLetter(type.name ?? '')}
          </Typography>
        </TableCell>

        <TableCell>
          <Grid display="flex" alignItems="center" justifyContent="space-between">
            <Typography
              component={'span'}
              variant="body2"
              sx={{
                color: getColorByKey(LBL_STATUS_COLORS, status?.name?.toLowerCase() || ''),
                background: `${getColorByKey(LBL_STATUS_COLORS, status?.name?.toLowerCase() || '')}12`,
                borderRadius: 1,
                px: 1,
                py: '2px',
              }}
            >
              {capitalizeFirstLetter(status.name ?? '')}
            </Typography>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="pixelarticons:more-vertical" />
            </IconButton>
          </Grid>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={() => {
            popover.onClose();
        }}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onSettingRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:settings-outline" />
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            withdrawModal.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="ic:outline-account-balance-wallet" />
          Transfer
        </MenuItem>
        <MenuItem
          onClick={() => {
            withdrawModal.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="ic:outline-account-balance-wallet" />
          History
        </MenuItem>
        <MenuItem
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Iconify icon={'iconoir:play'} />
          <Typography variant="body2">
            Active
          </Typography>

          <Switch
            color="secondary"
            checked={true}
            onChange={async (event) => {
              await handlePauseToggle(!event.target.checked);
            }}
            disabled={false}
          />
        </MenuItem>
      </CustomPopover>

      <OwnershipSettingsModal
        open={settingsModal.value}
        onClose={settingsModal.onFalse}
        onSuccess={() =>{}}
        assetData={{
          name: name,
        }}
      />
    </>
  );

  return <>{renderPrimary}</>;
}

export { OwnershipTableRow };
