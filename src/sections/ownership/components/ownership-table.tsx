// REACT IMPORTS
import { FC } from 'react';

// MUI IMPORTS
import TableBody from '@mui/material/TableBody';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Box, Table, TableContainer } from '@mui/material';

// LOCAL IMPORTS
import Scrollbar from '@src/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '@src/components/table';
import { LoadingScreen } from "@src/components/loading-screen";
import { COLORS } from '@src/layouts/config-layout';
import {OwnershipTableProps} from "@src/sections/ownership/types.ts"
import {OWNERSHIP_TABLE_HEAD} from "@src/sections/ownership/CONSTANTS.tsx"
import {OwnershipTableRow} from "@src/sections/ownership/components/ownership-table-row.tsx"

// ----------------------------------------------------------------------

const OwnershipTable: FC<OwnershipTableProps> = (args) => {
  const { assets, loading } = args;

  const table = useTable({
    defaultOrder: 'desc',
    defaultOrderBy: 'createdAt',
  });

  const notFound = !assets.length && !loading;
  const denseHeight = table.dense ? 52 : 72;

  return (
    <>
      <TableContainer sx={{ position: 'relative', overflow: 'unset', mt: 1 }}>
        <Scrollbar>
          <Box sx={{ background: COLORS.GRAY_LIGHT, overflowX: 'auto', borderRadius: 2 }}>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={OWNERSHIP_TABLE_HEAD}
                rowCount={assets.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />
              <TableBody>
                {loading ? (
                  <TableRow sx={{ height: denseHeight }}>
                    <TableCell colSpan={9}>
                      <LoadingScreen />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {assets
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <OwnershipTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(String(row.id))}
                        />
                      ))}
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage,assets.length)}
                    />
                    <TableNoData
                      notFound={notFound}
                      loading={loading}
                      emptyText="No campaigns found"
                    />
                  </>
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={assets.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </>
  );
};

export default OwnershipTable;
