import { useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
// components
import Iconify from '@src/components/iconify';
import CustomPopover, { usePopover } from '@src/components/custom-popover';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  name: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function AnalyticsTasks({ title, subheader, list, ...other }: Props) {
  const [selected, setSelected] = useState(['2']);

  const handleClickComplete = (taskId: string) => {
    const tasksCompleted = selected.includes(taskId)
      ? selected.filter((value) => value !== taskId)
      : [...selected, taskId];

    setSelected(tasksCompleted);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      {list.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          checked={selected.includes(task.id)}
          onChange={() => handleClickComplete(task.id)}
        />
      ))}
    </Card>
  );
}

// ----------------------------------------------------------------------

interface TaskItemProps extends CheckboxProps {
  task: ItemProps;
}

function TaskItem({ task, checked, onChange }: TaskItemProps) {
  const popover = usePopover();

  const handleMarkComplete = () => {
    popover.onClose();
    console.info('MARK COMPLETE', task.id);
  };

  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', task.id);
  };

  const handleEdit = () => {
    popover.onClose();
    console.info('EDIT', task.id);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', task.id);
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          pl: 2,
          pr: 1,
          py: 1,
          '&:not(:last-of-type)': {
            borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
          },
          ...(checked && {
            color: 'text.disabled',
            textDecoration: 'line-through',
          }),
        }}
      >
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={onChange} />}
          label={task.name}
          sx={{ flexGrow: 1, m: 0 }}
        />

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
        <MenuItem onClick={handleMarkComplete}>
          <Iconify icon="eva:checkmark-circle-2-fill" />
          Mark Complete
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
