// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from '@src/routes/paths.ts';
import { useRouter } from '@src/routes/hooks';
import { formatDistanceToNow } from 'date-fns';
// types
import { IPostItem } from '@types/blog.ts';
// components
import Label from '@src/components/label';
import TextMaxLine from '@src/components/text-max-line';
import { usePopover } from '@src/components/custom-popover';
import { truncateAddress } from '../../../utils/wallet.ts';
import AvatarProfile from "@src/components/avatar/avatar.tsx";

// ----------------------------------------------------------------------

interface Props {
  post: IPostItem;
}

export default function GovernanceItemHorizontal({ post }: Props) {
  const popover = usePopover();

  const router = useRouter();

  const { title, author, publish, createdAt, description } = post;

  // Generar fechas y datos aleatorios
  let displayTime = '';
  let votesFor = 0;
  let votesAgainst = 0;
  let votesAbstain = 0;

  if (publish === 'active') {
    const endDate = new Date(createdAt);
    const daysToAdd = Math.floor(Math.random() * 5) + 1; //NOSONAR
    endDate.setDate(endDate.getDate() + daysToAdd);
    displayTime = `Ends in ${formatDistanceToNow(endDate, { addSuffix: false })}`;
  } else {
    const closedAt = new Date(createdAt);
    const daysToAdd = Math.floor(Math.random() * 30) + 1; //NOSONAR
    closedAt.setDate(closedAt.getDate() + daysToAdd);
    if (closedAt > new Date()) {
      closedAt.setDate(new Date().getDate() - daysToAdd);
    }
    displayTime = `Ended ${formatDistanceToNow(closedAt, { addSuffix: true })}`;

    // Datos aleatorios para los resultados de la votación
    votesFor = Math.floor(Math.random() * 1000);//NOSONAR
    votesAgainst = Math.floor(Math.random() * 1000);//NOSONAR
    votesAbstain = Math.floor(Math.random() * 1000);//NOSONAR
  }

  return (
    <Stack
      component={Card}
      direction="row"
      onClick={() => {
        router.push(paths.dashboard.governance.details('1'));
      }}
      sx={{
        width: '100%',
        cursor: 'pointer',
        border: (theme) => `dashed 1px ${theme.palette.divider}`,
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.01)',
        },
      }}
    >
      <Stack
        sx={{
          width: '100%',
          p: (theme) => theme.spacing(3, 3, 2, 3),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex' }} onClick={popover.onOpen}>
            <AvatarProfile
              src={author?.wallet}
              alt={author?.name}
              sx={{
                width: 20,
                height: 20,
                mr: 1,
              }}
            />
            <Typography variant="subtitle2" noWrap>
              {truncateAddress(author?.wallet)}
            </Typography>
          </Box>

          <Label variant="soft" color={publish === 'active' ? 'success' : 'error'}>
            {publish}
          </Label>
        </Stack>

        <Stack spacing={0} flexGrow={1}>
          <TextMaxLine variant="subtitle2" line={2}>
            {title}
          </TextMaxLine>

          <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </TextMaxLine>
        </Stack>

        {publish === 'closed' && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              For: {votesFor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Against: {votesAgainst}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Abstain: {votesAbstain}
            </Typography>
          </Stack>
        )}

        <Stack direction="row" alignItems="center" sx={{ mt: 2 }}>
          <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
            {displayTime}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
