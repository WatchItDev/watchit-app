// @mui
import { Theme, SxProps } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
//
import EmptyContent from '../empty-content';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  notFound: boolean;
  sx?: SxProps<Theme>;
  emptyText?: string;
};

export default function TableNoData({ loading, notFound, sx, emptyText= 'No data found' }: Props) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12} sx={{ p: 0, pt: 2 }}>
          <EmptyContent
            filled
            title={loading ? 'Loading ...' : emptyText}
            sx={{
              py: 10,
              ...sx,
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
