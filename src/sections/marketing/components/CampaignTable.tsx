// REACT IMPORTS
import { FC } from 'react';

// MUI IMPORTS
import TableBody from '@mui/material/TableBody';
import { Box, Table, TableContainer } from '@mui/material';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

// LOCAL IMPORTS
import { CAMPAIGN_TABLE_HEAD } from '@src/sections/marketing/components/CONSTANTS.tsx';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '@src/components/table';
import Scrollbar from '@src/components/scrollbar';
import CampaignTableRow from '@src/sections/marketing/components/CampaignTableRow';
import { COLORS } from '@src/layouts/config-layout';
import { LoadingScreen } from "@src/components/loading-screen";
import { CampaignTableProps } from '@src/sections/marketing/components/types.ts';

// ----------------------------------------------------------------------

const CampaignTable: FC<CampaignTableProps> = (args) => {
  const { campaigns, loading } = args;

  const table = useTable({
    defaultOrder: 'desc',
    defaultOrderBy: 'createdAt',
  });

  // Map each contract log to the structure required by CampaignTableRow.
  const formattedCampaigns = campaigns
    .slice()
    .reverse()
    .map((item: any) => ({
      campaign: item.args?.campaign || item.transactionHash,
      name: item?.args?.description || 'Campaign Name',
      policy: item?.args?.policy,
      expiration: item?.args?.expireAt,
    }));

  const notFound = !formattedCampaigns.length && !loading;
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
                rowCount={formattedCampaigns.length}
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
                    {formattedCampaigns
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row: any) => (
                        <CampaignTableRow
                          key={row.campaign}
                          row={row}
                          selected={table.selected.includes(String(row.id))}
                        />
                      ))}
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, formattedCampaigns.length)}
                    />
                    <TableNoData
                      notFound={notFound}
                      loading={loading}
                      emptyText="No campaigns have been registered yet"
                    />
                  </>
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={formattedCampaigns.length}
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
