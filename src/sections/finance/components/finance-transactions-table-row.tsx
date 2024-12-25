import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// components
import Label from '@src/components/label';
import {TableRowTransactionType } from "@src/hooks/use-transaction-data.ts";

// ----------------------------------------------------------------------

type Props = {
  row: TableRowTransactionType;
  selected: boolean;
};

export default function FinanceTransactionTableRow({
  row,
  selected
}: Props) {
  const { date, name, amount, status, type, avatarUrl, message, category } = row;

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />
        <ListItemText
          primary={message}
          secondary={name}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(date), 'dd MMM yyyy')}
          secondary={format(new Date(date), 'p')}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell> {amount} MMC </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'completed' && 'success') ||
            (status === 'pending' && 'warning') ||
            (status === 'cancelled' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
    </>
  );
}
