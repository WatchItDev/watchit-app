import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRowSelectionModel,
  getGridNumericOperators,
  GridFilterInputValueProps,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';
// utils
import { fPercent } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const columns: GridColDef[] = [
  {
    field: 'id',
  },
  {
    field: 'avatar',
    headerName: 'Avatar',
    align: 'center',
    headerAlign: 'center',
    width: 64,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Avatar alt={params.row.name} sx={{ width: 36, height: 36 }}>
        {params.row.name.charAt(0).toUpperCase()}
      </Avatar>
    ),
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    editable: true,
    renderCell: (params) => (
      <Typography variant="body2" sx={{ textDecoration: 'underline' }} noWrap>
        {params.row.email}
      </Typography>
    ),
  },
  {
    field: 'lastLogin',
    type: 'dateTime',
    headerName: 'Last login',
    align: 'right',
    headerAlign: 'right',
    width: 200,
  },
  {
    field: 'rating',
    type: 'number',
    headerName: 'Rating',
    width: 160,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Rating size="small" value={params.row.rating} precision={0.5} readOnly />
    ),
  },
  {
    field: 'status',
    type: 'singleSelect',
    headerName: 'Status',
    valueOptions: ['online', 'alway', 'busy'],
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => (
      <Label
        variant="soft"
        color={
          (params.row.status === 'busy' && 'error') ||
          (params.row.status === 'alway' && 'warning') ||
          'success'
        }
        sx={{ mx: 'auto' }}
      >
        {params.row.status}
      </Label>
    ),
  },
  {
    field: 'isAdmin',
    type: 'boolean',
    align: 'center',
    headerAlign: 'center',
    width: 120,

    renderCell: (params) =>
      params.row.isAdmin ? (
        <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main' }} />
      ) : (
        '-'
      ),
  },
  {
    field: 'performance',
    type: 'number',
    headerName: 'Performance',
    align: 'center',
    headerAlign: 'center',
    width: 160,
    renderCell: (params) => (
      <Stack spacing={1} direction="row" alignItems="center" sx={{ px: 1, width: 1, height: 1 }}>
        <LinearProgress
          value={params.row.performance}
          variant="determinate"
          color={
            (params.row.performance < 30 && 'error') ||
            (params.row.performance > 30 && params.row.performance < 70 && 'warning') ||
            'primary'
          }
          sx={{ width: 1, height: 6 }}
        />
        <Typography variant="caption" sx={{ width: 80 }}>
          {fPercent(params.row.performance)}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'action',
    headerName: ' ',
    align: 'right',
    width: 80,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <IconButton onClick={() => console.info('ID', params.row.id)}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    ),
  },
];

// ----------------------------------------------------------------------

type Props = {
  data: {
    id: string;
    name: string;
    email: string;
    lastLogin: Date;
    performance: number;
    rating: number;
    status: string;
    isAdmin: boolean;
    lastName: string;
    firstName: string;
    age: number;
  }[];
};

export default function DataGridCustom({ data }: Props) {
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    id: false,
  });

  if (columns.length) {
    const ratingColumn = columns.find((column) => column.field === 'rating')!;

    const ratingColIndex = columns.findIndex((col) => col.field === 'rating');

    const ratingFilterOperators = getGridNumericOperators().map((operator) => ({
      ...operator,
      InputComponent: RatingInputValue,
    }));
    columns[ratingColIndex] = {
      ...ratingColumn,
      filterOperators: ratingFilterOperators,
    };
  }

  const handleChangeColumnVisibilityModel = useCallback((newModel: GridColumnVisibilityModel) => {
    setColumnVisibilityModel(newModel);
  }, []);

  const hiddenFields = ['id', 'action'];

  const getTogglableColumns = () =>
    columns.filter((column) => !hiddenFields.includes(column.field)).map((column) => column.field);

  const selected = data.filter((row) => selectedRows.includes(row.id));

  console.info('SELECTED ROWS', selected);

  return (
    <DataGrid
      checkboxSelection
      disableRowSelectionOnClick
      rows={data}
      columns={columns}
      onRowSelectionModelChange={(newSelectionModel) => {
        setSelectedRows(newSelectionModel);
      }}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={handleChangeColumnVisibilityModel}
      slots={{
        toolbar: GridToolbar,
      }}
      slotProps={{
        columnsPanel: {
          getTogglableColumns,
        },
      }}
    />
  );
}

// ----------------------------------------------------------------------

function RatingInputValue({ item, applyValue }: GridFilterInputValueProps) {
  return (
    <Box sx={{ p: 1, height: 1, alignItems: 'flex-end', display: 'flex' }}>
      <Rating
        size="small"
        precision={0.5}
        placeholder="Filter value"
        value={Number(item.value)}
        onChange={(event, newValue) => {
          applyValue({ ...item, value: newValue });
        }}
      />
    </Box>
  );
}
