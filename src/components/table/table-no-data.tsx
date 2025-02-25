// @mui
import { Theme, SxProps } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
//
import EmptyContent from '../empty-content';

// ----------------------------------------------------------------------

interface Props {
  loading: boolean;
  notFound: boolean;
  sx?: SxProps<Theme>;
}

export default function TableNoData({ loading, notFound, sx }: Props) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12} sx={{ p: 0, pt: 2 }}>
          <EmptyContent
            filled
            title={loading ? 'Loading ...' : 'No data found'}
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
