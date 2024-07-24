// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
//
import Iconify from '../../iconify';
import CustomPopover, { usePopover } from '../../custom-popover';
//
import { ItemProps } from '../types';

// ----------------------------------------------------------------------

type Props = {
  node: ItemProps;
  onEdit?: VoidFunction;
  onDelete?: VoidFunction;
  sx?: SxProps<Theme>;
};

export default function StandardNode({ node, onEdit, onDelete, sx }: Props) {
  const popover = usePopover();

  return (
    <>
      <Card
        sx={{
          p: 2,
          minWidth: 200,
          borderRadius: 1.5,
          textAlign: 'left',
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          textTransform: 'capitalize',
          ...sx,
        }}
      >
        <IconButton
          color={popover.open ? 'inherit' : 'default'}
          onClick={popover.onOpen}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <Iconify icon="eva:more-horizontal-fill" />
        </IconButton>

        <Avatar
          alt={node.name}
          src={node.avatarUrl || ''}
          sx={{ mr: 2, mb: 1, width: 48, height: 48 }}
        />

        <Typography variant="subtitle2" noWrap>
          {node.name}
        </Typography>

        <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
          {node.role}
        </Typography>
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="left-center"
        sx={{ width: 160 }}
      >
        {onDelete && (
          <MenuItem
            onClick={() => {
              popover.onClose();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem
            onClick={() => {
              popover.onClose();
              onEdit();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        )}
      </CustomPopover>
    </>
  );
}
