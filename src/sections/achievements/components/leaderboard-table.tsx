import { FC, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { m } from 'framer-motion';

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
import { useGetLeaderboardQuery } from '@src/graphql/generated/hooks';
import { useAuth } from '@src/hooks/use-auth';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths';
import { varHover } from '@src/components/animate';
import { truncateAddress } from '@src/utils/wallet';
import { User } from '@src/graphql/generated/graphql.ts';
import { RANK_ICON } from '@src/utils/ranks.ts';
import { useStaleWhileLoading } from '@src/hooks/use-stale-while-loading.ts';

const medalFor = (rank: number) =>
  rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

const colorFromAddress = (addr: string) => `#${addr.slice(2, 8)}`;

const HEAD: HeadLabel[] = [
  { id: 'rank', label: 'Rank', align: 'center', width: 70 },
  { id: 'user', label: 'User' },
  { id: 'xp', label: 'XP', align: 'right', width: 120 },
  { id: 'badge', label: 'Badge', align: 'center', width: 100 },
];

const RankIcon = styled('img')({
  width: 20,
  height: 20,
  flexShrink: 0,
});

const LeaderboardTable: FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const { session } = useAuth();
  const raw = useGetLeaderboardQuery({
    variables: { limit: 50 },
    fetchPolicy: 'network-only',
    pollInterval: 2000,
  });

  const { data, isInitialLoad, error } = useStaleWhileLoading(raw);
  const table = useTable({
    defaultOrder: 'asc',
    defaultOrderBy: 'rank',
    defaultRowsPerPage: 5,
  });
  const myAddress = session?.user?.address?.toLowerCase() ?? '';
  const xpBalance = session?.user?.xpBalance ?? 0;
  const users: User[] = data?.getLeaderboard ?? [];
  const denseH = table.dense ? 52 : 72;

  const rows = useMemo(
    () =>
      users.map((u, idx) => {
        const isMe = u.address.toLowerCase() === myAddress;
        return {
          rank: idx + 1,
          rankId: u.currentRank,
          name: u.displayName || `User ${idx + 1}`,
          address: u.address,
          xp: isMe ? xpBalance : u.xpTotal,
          badge: RANK_ICON[u.currentRank] ?? RANK_ICON['watcher'],
          color: colorFromAddress(u.address),
          picture: u.profilePicture,
        };
      }),
    [users, xpBalance],
  );

  const sorted = useMemo(
    () =>
      [...rows].sort(
        getComparator(table.order, table.orderBy as keyof (typeof rows)[0]),
      ),
    [rows, table.order, table.orderBy],
  );

  const pageRows = sorted.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  return (
    <Card sx={{ pt: 2 }}>
      <CardHeader title="Leaderboard (top 50)" sx={{ p: 0 }} />

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error.message}
        </Alert>
      )}

      {isInitialLoad ? (
        <CardContent sx={{ pt: 1, pl: 0, pr: 0 }}>
          <TableContainer>
            <Table size="medium">
              <TableHeadCustom headLabel={HEAD} order="asc" orderBy="rank" />
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {HEAD.map((h) => (
                      <TableCell key={h.id} align={h.align || 'left'}>
                        <Skeleton variant="text" width={h.width || '80%'} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      ) : (
        <CardContent sx={{ pt: 1, pl: 0, pr: 0 }}>
          <TableContainer>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  onSort={table.onSort}
                  rowCount={sorted.length}
                  headLabel={HEAD}
                />

                <TableBody>
                  {pageRows.map((row) => {
                    const isMe = row.address.toLowerCase() === myAddress;
                    const medal = medalFor(row.rank);

                    return (
                      <TableRow
                        key={row.rank}
                        hover
                        onClick={() =>
                          router.push(paths.dashboard.user.root(row.address))
                        }
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: isMe
                            ? theme.palette.action.selected
                            : 'inherit',
                          border: isMe
                            ? `2px solid ${theme.palette.primary.main}`
                            : undefined,
                        }}
                      >
                        {/* RANK / MEDAL */}
                        <TableCell sx={{ fontSize: 20 }}>
                          {medal ? medal : `# ${row.rank}`}
                        </TableCell>

                        {/* USER */}
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AvatarProfile
                              src={row.picture || row.address || ''}
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
                                {truncateAddress(row.address)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell align="right">
                          {row.xp.toLocaleString()} XP
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip
                            title={
                              row.rankId.charAt(0).toUpperCase() +
                              row.rankId.slice(1)
                            }
                            arrow
                          >
                            <IconButton
                              component={m.button}
                              whileHover="hover"
                              whileTap="tap"
                              variants={varHover(1.05)}
                              sx={{ p: 0 }}
                            >
                              <RankIcon
                                src={row.badge}
                                alt={`${row.name} badge`}
                              />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableEmptyRows
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      sorted.length,
                    )}
                    height={denseH}
                  />

                  <TableNoData loading={false} notFound={!sorted.length} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={sorted.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default LeaderboardTable;
