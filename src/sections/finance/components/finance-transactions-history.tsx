import React, {useState, useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import TableContainer from '@mui/material/TableContainer';
// _mock
import {TRANSACTIONS_TYPES} from '@src/types/transaction';
// components
import Label from '@src/components/label';
import Scrollbar from '@src/components/scrollbar';

import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '@src/components/table';
// types
import { IOrderTableFilters, IOrderTableFilterValue } from '@src/types/transaction';
//
import FinanceTransactionTableRow from '@src/sections/finance/components/finance-transactions-table-row';
import FinanceTransactionsTableFiltersResult from '@src/sections/finance/components/finance-transactions-table-filters-result';
import {ProcessedTransactionData} from "@src/utils/finance-graphs/groupedTransactions.ts";

// ----------------------------------------------------------------------
// REmove last 2 elements from the array TRANSACTIONS_TYPES
const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...TRANSACTIONS_TYPES.slice(0, -2)];

const TABLE_HEAD = [
  { id: 'name', label: 'Profile Info', width: 20 },
  { id: 'createdAt', label: 'Date', width: 40 },
  { id: 'amount', label: 'Amount', width: 40 },
];

const defaultFilters: IOrderTableFilters = {
  status: 'all'
};

type TransactionsProcessedData = {
  transactionData: ProcessedTransactionData[];
}

export default function FinanceTransactionsHistory({ transactionData }: TransactionsProcessedData) {
  const table = useTable({ defaultOrderBy: 'name' });
  const [tableData, _setTableData] = useState(transactionData);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: transactionData,
    comparator: getComparator(table.order, table.orderBy),
    filters
  });

  const denseHeight = table.dense ? 52 : 72;
  const canReset = filters.status !== 'all';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IOrderTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleFilterStatus = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {Array.isArray(transactionData) &&  STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'transferFrom' && 'success') ||
                      (tab.value === 'transferTo' && 'warning') ||
                      'default'
                    }
                  >

                    {tab.value === 'all' && transactionData.length}
                    {tab.value === 'transferFrom' && transactionData.filter((t) => t.type.toLowerCase() === 'transferfrom' || t.type.toLowerCase() === 'withdraw').length}
                    {tab.value === 'transferTo' && transactionData.filter((t) => t.type.toLowerCase() === 'transferto' || t.type.toLowerCase() === 'deposit').length}

                  </Label>
                }
              />
            ))}
          </Tabs>

          {canReset && (
            <FinanceTransactionsTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
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
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
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
  filters
}: {
  inputData: ProcessedTransactionData[];
  comparator: (a: any, b: any) => number;
  filters: IOrderTableFilters;
}) {

  //Verify if the input data is an array; otherwise, return an empty array
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

  inputData = stabilizedThis.map((el) => el[0]);

  if (status !== 'all') {
    if(status === 'transferFrom') {
      inputData = inputData.filter((t) => t.type.toLowerCase() === 'transferfrom' || t.type.toLowerCase() === 'withdraw');
    }

    if(status === 'transferTo') {
      inputData = inputData.filter((t) => t.type.toLowerCase() === 'transferto' || t.type.toLowerCase() === 'deposit');
    }
  }

  return inputData;
}
