import { FC, useMemo } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import Scrollbar from '@src/components/scrollbar';
import {
  useTable,
  TableHeadCustom,
  TablePaginationCustom,
  TableEmptyRows,
  TableNoData,
  emptyRows,
  getComparator,
  HeadLabel,
} from '@src/components/table';

import AvatarProfile from '@src/components/avatar/avatar';
import Watcher from '@src/assets/illustrations/watcher.png';
import Fan from '@src/assets/illustrations/fan.png';
import Engager from '@src/assets/illustrations/engager.png';
import Supporter from '@src/assets/illustrations/supporter.png';
import Spotlighter from '@src/assets/illustrations/splotligther.png';
import Scout from '@src/assets/illustrations/scout.png';
import Storykeeper from '@src/assets/illustrations/storykeeper.png';
import Guardian from '@src/assets/illustrations/guardian.png';

const leaderboard = [
  {
    rank: 1,
    name: 'Max',
    address: '0x34K…78J',
    xp: 6052,
    badges: [Guardian, Storykeeper, Scout, Spotlighter, Supporter, Engager],
    color: '#FFD600',
  },
  {
    rank: 2,
    name: 'Alexandra',
    address: '0x34K…78J',
    xp: 5052,
    badges: [Supporter, Spotlighter, Scout, Engager],
    color: '#7E57C2',
  },
  {
    rank: 3,
    name: 'Diego',
    address: '0x34K…78J',
    xp: 4052,
    badges: [Engager, Fan, Watcher],
    color: '#26A69A',
  },
  {
    rank: 4,
    name: 'Anas',
    address: '0x34K…78J',
    xp: 3052,
    badges: [Engager, Fan],
    color: '#AB47BC',
  },
  {
    rank: 5,
    name: 'Jose',
    address: '0x34K…78J',
    xp: 2052,
    badges: [Watcher],
    color: '#8D6E63',
  },
];

const HEAD: HeadLabel[] = [
  { id: 'rank', label: 'Rank', width: 70 },
  { id: 'publication', label: 'Publication' },
  { id: 'xp', label: 'XP', align: 'right', width: 120 },
  { id: 'badges', label: 'Badges', align: 'center', width: 160 },
];

const LeaderboardTable: FC = () => {
  const table = useTable({
    defaultOrder: 'asc',
    defaultOrderBy: 'rank',
    defaultRowsPerPage: 5,
  });

  const rows = useMemo(
    () =>
      [...leaderboard].sort(
        getComparator(table.order, table.orderBy as keyof (typeof leaderboard)[0]),
      ),
    [table.order, table.orderBy],
  );

  const pageRows = rows.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  const denseH = table.dense ? 52 : 72;

  return (
    <Card sx={{ pt: 2 }}>
      <CardHeader title="Leaderboard" sx={{ p: 0 }} />
      <CardContent sx={{ pt: 1, pl: 0, pr: 0 }}>
        <TableContainer>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                onSort={table.onSort}
                rowCount={rows.length}
                headLabel={HEAD}
              />

              <TableBody>
                {pageRows.map((row) => {
                  const visible = row.badges.slice(-3);
                  const hidden = row.badges.length - visible.length;

                  return (
                    <TableRow key={row.rank} hover>
                      <TableCell># {row.rank}</TableCell>

                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AvatarProfile
                            src=""
                            alt={row.name}
                            sx={{
                              bgcolor: row.color,
                              width: 32,
                              height: 32,
                              fontSize: 14,
                            }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {row.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {row.address}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        {row.xp.toLocaleString()} XP
                      </TableCell>

                      <TableCell align="center">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          gap={0.5}
                        >
                          {visible.map((icon, idx) => (
                            <AvatarProfile
                              key={idx}
                              src={icon}
                              alt=""
                              sx={{ width: 24, height: 24 }}
                            />
                          ))}

                          {hidden > 0 && (
                            <Typography variant="caption">+{hidden}</Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableEmptyRows
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    rows.length,
                  )}
                  height={denseH}
                />

                <TableNoData loading={false} notFound={!rows.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={rows.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </CardContent>
    </Card>
  );
}

export default LeaderboardTable;
