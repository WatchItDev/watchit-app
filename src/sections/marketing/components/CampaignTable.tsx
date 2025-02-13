import { FC } from 'react';

// MUI components
import TableBody from '@mui/material/TableBody';
import { Box, Table, TableContainer } from '@mui/material';

// Project components
import { CAMPAIGN_TABLE_HEAD, StrategyType } from '@src/types/marketing';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '@src/components/table';
import Scrollbar from '@src/components/scrollbar';
import CampaignTableRow from '@src/sections/marketing/components/CampaignTableRow.tsx';
import { COLORS } from '@src/layouts/config-layout.ts';

interface CampaignTableProps {
  strategy: StrategyType;
}
const CampaignTable: FC<CampaignTableProps> = ({ strategy }) => {
  const table = useTable({
    defaultOrder: 'desc',
    defaultOrderBy: 'createdAt',
  });

  const notFound = !strategy.campaigns.length;
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
                headLabel={CAMPAIGN_TABLE_HEAD}
                rowCount={strategy.campaigns.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />
              <TableBody>
                {strategy.campaigns
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <CampaignTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                    />
                  ))}
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, strategy.campaigns.length)}
                />

                <TableNoData notFound={notFound} loading={false} emptyText={'Still haven\'t registered any campaigns'} />
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={strategy.campaigns.length}
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

export default CampaignTable;
