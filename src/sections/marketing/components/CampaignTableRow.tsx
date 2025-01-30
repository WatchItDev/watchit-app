// @MUI
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { Button, Divider, IconButton, MenuItem } from '@mui/material';
import Switch from '@mui/material/Switch';

// Project components
import { CampaignTableRowType } from '@src/types/marketing';
import { capitalizeFirstLetter } from '@src/utils/text-transform.ts';
import { COLORS } from '@src/utils/colors.ts';
import Iconify from '@src/components/iconify';
import CustomPopover, { usePopover } from '@src/components/custom-popover';
import { useBoolean } from '@src/hooks/use-boolean';
import { ConfirmDialog } from '@src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
  row: CampaignTableRowType;
  selected: boolean;
};

const LBL_COLORS = {
  subscription: COLORS.success,
  rental: COLORS.info,
  trial: COLORS.warning,
  custom: COLORS.danger,
};
const LBL_STATUS_COLORS = {
  active: COLORS.success,
  paused: COLORS.warning,
  completed: COLORS.warning,
};

// ----------------------------------------------------------------------
export default function CampaignTableRow({ row, selected }: Props) {
  const popover = usePopover();
  const confirm = useBoolean();

  const { name, budget, available, type, access, id, status, perUser } = row;

  const onViewRow = () => {};

  const onEditRow = () => {};

  const onDeleteRow = () => {};

  const onChange = () => {
    setTimeout(() => {
      popover.onClose();
    }, 1000);
  };

  const renderPrimary = (
    <>
      <TableRow hover selected={selected} key={id}>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={name}
            secondary={`${perUser} MMC per user`}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={budget}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <Typography variant="body2">{available}</Typography>
        </TableCell>

        <TableCell>
          <Typography
            component={'span'}
            variant="body2"
            sx={{
              color: `${LBL_COLORS?.[type]}`,
              background: `${LBL_COLORS?.[type]}12`,
              borderRadius: 1,
              px: 1,
              py: '2px',
            }}
          >
            {capitalizeFirstLetter(type)}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{access}</Typography>
        </TableCell>

        <TableCell>
          <Grid display="flex" alignItems="center" justifyContent="space-between">
            <Typography
              component={'span'}
              variant="body2"
              sx={{
                color: `${LBL_STATUS_COLORS?.[status]}`,
                background: `${LBL_STATUS_COLORS?.[status]}12`,
                borderRadius: 1,
                px: 1,
                py: '2px',
              }}
            >
              {capitalizeFirstLetter(status)}
            </Typography>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="pixelarticons:more-vertical" />
            </IconButton>
          </Grid>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onClick={() => {
            onViewRow();
          }}
        >
          <Iconify icon="iconoir:pause" />
          Pause
          <Switch color={'secondary'} defaultChecked onChange={onChange} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mage:edit" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:eye-linear" />
          Deactivate
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={`Deactivate ${name}`}
        content="Are you sure want to deactivate the campaign?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Deactivate
          </Button>
        }
      />
    </>
  );

  return <>{renderPrimary}</>;
}
