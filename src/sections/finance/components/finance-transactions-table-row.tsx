import { format } from 'date-fns';

// @MUI
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

// Project components
import { TableRowTransactionType } from '@src/hooks/use-transaction-data.ts';
import { truncateAddress } from '@src/utils/wallet.ts';
import AvatarProfile from "@src/components/avatar/avatar.tsx";

// ----------------------------------------------------------------------

type Props = {
  row: TableRowTransactionType;
  selected: boolean;
};

export default function FinanceTransactionTableRow({ row, selected }: Props) {
  const { date, name, amount, avatarUrl, message, category } = row;

  const dateObject = new Date(Number(date) * 1000);
  const dateLbl = format(dateObject, 'dd/MM/yyyy');
  const timeLbl = format(dateObject, 'p');

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <AvatarProfile src={avatarUrl} alt={name} sx={{mr: 2}} />
        <ListItemText
          primary={message}
          secondary={truncateAddress(name)}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={dateLbl}
          secondary={timeLbl}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ color: category === 'income' ? '#00AB55' : '#FF4842' }}>
          {category === 'income' ? '' : '-'} {amount} MMC
        </Typography>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}
