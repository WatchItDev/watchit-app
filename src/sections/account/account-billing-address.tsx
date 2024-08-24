import { useCallback, useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IAddressItem } from 'src/types/address';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
//
import { AddressNewForm, AddressItem } from '../address';

// ----------------------------------------------------------------------

type Props = {
  addressBook: IAddressItem[];
};

export default function AccountBillingAddress({ addressBook }: Props) {
  const [addressId, setAddressId] = useState('');

  const popover = usePopover();

  const addressForm = useBoolean();

  const handleAddNewAddress = useCallback((address: IAddressItem) => {
    console.info('ADDRESS', address);
  }, []);

  const handleSelectedId = useCallback(
    (event: React.MouseEvent<HTMLElement>, id: string) => {
      popover.onOpen(event);
      setAddressId(id);
    },
    [popover]
  );

  const handleClose = useCallback(() => {
    popover.onClose();
    setAddressId('');
  }, [popover]);

  return (
    <>
      <Card>
        <CardHeader
          title="Address Book"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addressForm.onTrue}
            >
              Address
            </Button>
          }
        />

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {addressBook.map((address) => (
            <AddressItem
              variant="outlined"
              key={address.id}
              address={address}
              action={
                <IconButton
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    handleSelectedId(event, `${address.id}`);
                  }}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              }
              sx={{
                p: 2.5,
                borderRadius: 1,
              }}
            />
          ))}
        </Stack>
      </Card>

      <CustomPopover open={popover.open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            console.info('SET AS PRIMARY', addressId);
          }}
        >
          <Iconify icon="eva:star-fill" />
          Set as primary
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            console.info('EDIT', addressId);
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            console.info('DELETE', addressId);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={handleAddNewAddress}
      />
    </>
  );
}
