import React, { useState, useCallback } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { alpha } from "@mui/material/styles";
import { IOrderTableFilters, IOrderTableFilterValue } from "@src/sections/finance/types";

// components
import Label from "@src/components/label";
import Scrollbar from "@src/components/scrollbar";

import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "@src/components/table";
//
import FinanceTransactionTableRow from "@src/sections/finance/components/finance-transactions-table-row";
import useGetSmartWalletTransactions from "@src/hooks/protocol/use-get-smart-wallet-transactions.ts";
import FinanceOverlayLoader from "@src/sections/finance/components/finance-overlay-loader.tsx";
import { processTransactionData } from "@src/libs/finance-graphs/groupedTransactions";
import { STATUS_OPTIONS, TABLE_HEAD } from "./CONSTANTS";
import { ProcessedTransactionData } from "@src/libs/types.ts";

const defaultFilters: IOrderTableFilters = {
  status: "all",
};

// ----------------------------------------------------------------------

export default function FinanceTransactionsHistory() {
  const { transactions, loading } = useGetSmartWalletTransactions();
  let transactionData = processTransactionData(transactions);
  const table = useTable({
    defaultOrder: "desc",
    defaultOrderBy: "createdAt",
  });

  transactionData = transactionData.map((item) => ({
    ...item,
    createdAt: Number(item.timestamp) * 1000,
  }));

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: transactionData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 52 : 72;
  const canReset = filters.status !== "all";
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IOrderTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table],
  );

  const handleFilterStatus = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      handleFilters("status", newValue);
    },
    [handleFilters],
  );

  const removeDuplicatesById = (array: ProcessedTransactionData[]) => {
    return Array.from(new Map(array.map((item) => [item.id, item])).values());
  };

  return (
    <>
      <Tabs
        value={filters.status}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
        }}>
        {Array.isArray(transactionData) &&
          STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === "all" || tab.value === filters.status) && "filled") || "soft"
                  }
                  color={
                    (tab.value === "transferFrom" && "success") ||
                    (tab.value === "transferTo" && "warning") ||
                    (tab.value === "other" && "info") ||
                    "default"
                  }>
                  {tab.value === "all" && removeDuplicatesById(transactionData).length}
                  {tab.value === "transferFrom" &&
                    removeDuplicatesById(
                      transactionData.filter(
                        (t) =>
                          t.type.toLowerCase() === "transferto" ||
                          t.type.toLowerCase() === "withdraw" ||
                          t.type.toLowerCase() === "collected",
                      ),
                    ).length}
                  {tab.value === "transferTo" &&
                    removeDuplicatesById(
                      transactionData.filter(
                        (t) =>
                          t.type.toLowerCase() === "transferfrom" ||
                          t.type.toLowerCase() === "deposit",
                      ),
                    ).length}
                </Label>
              }
            />
          ))}
      </Tabs>

      <TableContainer sx={{ position: "relative", overflow: "unset" }}>
        {loading && <FinanceOverlayLoader />}
        <Scrollbar>
          <Table size={table.dense ? "small" : "medium"}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={transactionData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage,
                )
                .map((row) => (
                  <FinanceTransactionTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(String(row.id))}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, transactionData.length)}
              />

              <TableNoData notFound={notFound} loading={loading} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: ProcessedTransactionData[];
  comparator: (a: ProcessedTransactionData, b: ProcessedTransactionData) => number;
  filters: IOrderTableFilters;
}) {
  if (!Array.isArray(inputData)) {
    return [];
  }

  const { status } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData = stabilizedThis.map((el) => el[0]);

  if (status !== "all") {
    if (status === "transferFrom") {
      filteredData = filteredData.filter(
        (t) =>
          t.type.toLowerCase() === "transferto" ||
          t.type.toLowerCase() === "withdraw" ||
          t.type.toLowerCase() === "collected",
      );
    }

    if (status === "transferTo") {
      filteredData = filteredData.filter(
        (t) => t.type.toLowerCase() === "transferfrom" || t.type.toLowerCase() === "deposit",
      );
    }
  }

  // delete duplicated items
  filteredData = Array.from(new Map(filteredData.map((item) => [item.id, item])).values());

  return filteredData;
}
