// REACT IMPORTS
import { FC } from 'react';

// MUI IMPORTS
import TableBody from '@mui/material/TableBody';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Box, Table, TableContainer } from '@mui/material';

// LOCAL IMPORTS
import Scrollbar from '@src/components/scrollbar';
import CampaignTableRow from '@src/sections/marketing/components/campaign-table-row.tsx';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '@src/components/table';
import { LoadingScreen } from "@src/components/loading-screen";
import { CampaignTableProps } from '@src/sections/marketing/types.ts';
import { COLORS } from '@src/layouts/config-layout';
import { CAMPAIGN_TABLE_HEAD } from '@src/sections/marketing/CONSTANTS.tsx';
import {CampaignLog} from "@src/hooks/protocol/types.ts"
import { FormattedCampaign } from '@src/sections/marketing/types.ts';

const CampaignTable: FC<CampaignTableProps> = (args) => {
  const { campaigns, loading } = args;

  const table = useTable({
    defaultOrder: 'desc',
    defaultOrderBy: 'createdAt',
  });

  // Map each contract log to the structure required by CampaignTableRow.
  const formattedCampaigns: FormattedCampaign[] = campaigns
    .slice()
    .reverse()
    .map((item: CampaignLog) => ({
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
                      .map((row: FormattedCampaign) => (
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
