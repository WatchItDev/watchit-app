import Box from "@mui/material/Box";
import {FC} from "react";

import Typography from "@mui/material/Typography";

import {Invitation} from "@src/types/invitation";
import TableContainer from "@mui/material/TableContainer";
import Scrollbar from "@src/components/scrollbar";
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from "@src/components/table";
import TableBody from "@mui/material/TableBody";
import ProfileReferralsTableRow from "@src/sections/user/view/profile-referrals-table-row.tsx";
import Table from "@mui/material/Table";

interface ProfileReferralsProps {
  referrals: Invitation[];
  loading: boolean;
}

const TABLE_HEAD = [
  {id: "email", label: "Email"},
  {id: "status", label: "Status"},
];

const ProfileReferrals: FC<ProfileReferralsProps> = ({referrals, loading}) => {
  const table = useTable({
    defaultOrder: "desc",
    defaultOrderBy: "createdAt",
  });

  const notFound = !referrals.length;
  const denseHeight = table.dense ? 52 : 72;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: `${16}px`,
        alignItems: "flex-start",
      }}
      gap={3}>
      {referrals?.length ? (
        <>
          <TableContainer sx={{position: "relative", overflow: "unset"}}>
            <Scrollbar>
              <Table size={table.dense ? "small" : "medium"}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={referrals.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />
                <TableBody>
                  {referrals
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row) => (
                      <ProfileReferralsTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, referrals.length)}
                  />
                  <TableNoData notFound={notFound} loading={loading} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={referrals.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </>
      ) : (
        <Typography
          sx={{
            height: "20rem",
            textAlign: "center",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            background: "#2b2d31",
            borderRadius: "1rem",
          }}>
          This profile has no referrals
        </Typography>
      )}
    </Box>
  );
};

export default ProfileReferrals;
