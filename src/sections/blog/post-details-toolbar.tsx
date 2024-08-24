// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Stack, { StackProps } from '@mui/material/Stack';
// routes
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = StackProps & {
  backLink: string;
  editLink: string;
  liveLink: string;
  publish: string;
  onChangePublish: (newValue: string) => void;
  publishOptions: {
    value: string;
    label: string;
  }[];
};

export default function PostDetailsToolbar({
  publish,
  backLink,
  editLink,
  liveLink,
  publishOptions,
  onChangePublish,
  sx,
  ...other
}: Props) {
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Back
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {publish === 'published' && (
          <Tooltip title="Go Live">
            <IconButton component={RouterLink} href={liveLink}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Edit">
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <LoadingButton
          color="inherit"
          variant="contained"
          loading={!publish}
          loadingIndicator="Loading…"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          {publish}
        </LoadingButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {publishOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === publish}
            onClick={() => {
              popover.onClose();
              onChangePublish(option.value);
            }}
          >
            {option.value === 'published' && <Iconify icon="eva:cloud-upload-fill" />}
            {option.value === 'draft' && <Iconify icon="solar:file-text-bold" />}
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
