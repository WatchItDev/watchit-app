import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton, { listItemButtonClasses } from '@mui/material/ListItemButton';
// types
import { IAddressItem } from 'src/types/address';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  list: IAddressItem[];
  action?: React.ReactNode;
  //
  open: boolean;
  onClose: VoidFunction;
  //
  selected: (selectedId: string) => boolean;
  onSelect: (address: IAddressItem | null) => void;
};

export default function AddressListDialog({
  title = 'Address Book',
  list,
  action,
  //
  open,
  onClose,
  //
  selected,
  onSelect,
}: Props) {
  const [searchAddress, setSearchAddress] = useState('');

  const dataFiltered = applyFilter({
    inputData: list,
    query: searchAddress,
  });

  const notFound = !dataFiltered.length && !!searchAddress;

  const handleSearchAddress = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value);
  }, []);

  const handleSelectAddress = useCallback(
    (address: IAddressItem | null) => {
      onSelect(address);
      setSearchAddress('');
      onClose();
    },
    [onClose, onSelect]
  );

  const renderList = (
    <Stack
      spacing={0.5}
      sx={{
        p: 0.5,
        maxHeight: 80 * 8,
        overflowX: 'hidden',
      }}
    >
      {dataFiltered.map((address) => (
        <Stack
          key={address.id}
          spacing={0.5}
          component={ListItemButton}
          selected={selected(`${address.id}`)}
          onClick={() => handleSelectAddress(address)}
          sx={{
            py: 1,
            px: 1.5,
            borderRadius: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            [`&.${listItemButtonClasses.selected}`]: {
              bgcolor: 'action.selected',
              '&:hover': {
                bgcolor: 'action.selected',
              },
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{address.name}</Typography>

            {address.primary && <Label color="info">Default</Label>}
          </Stack>

          {address.company && (
            <Box sx={{ color: 'primary.main', typography: 'caption' }}>{address.company}</Box>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {address.fullAddress}
          </Typography>

          {address.phoneNumber && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {address.phoneNumber}
            </Typography>
          )}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action && action}
      </Stack>

      <Stack sx={{ p: 2, pt: 0 }}>
        <TextField
          value={searchAddress}
          onChange={handleSearchAddress}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {notFound ? (
        <SearchNotFound query={searchAddress} sx={{ px: 3, pt: 5, pb: 10 }} />
      ) : (
        renderList
      )}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, query }: { inputData: IAddressItem[]; query: string }) {
  if (query) {
    return inputData.filter(
      (address) =>
        address.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        address.fullAddress.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        `${address.company}`.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
