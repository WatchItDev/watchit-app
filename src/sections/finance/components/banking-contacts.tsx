// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
// components
import Iconify from '@src/components/iconify';
import {Profile} from "@lens-protocol/api-bindings";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: Profile[];
}

export default function BankingContacts({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Button
            size="small"
            color="inherit"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          >
            View All
          </Button>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        {list.map((profile) => (
          <Stack direction="row" alignItems="center" key={profile.id}>
            <Avatar
              src={
                (profile?.metadata?.picture as any)?.optimized?.uri ??
                `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`
              }
              sx={{ width: 48, height: 48, mr: 2 }} />

            <ListItemText primary={profile.metadata?.displayName} secondary={profile.id} />

            <Tooltip title="Quick Transfer">
              <IconButton>
                <Iconify icon="eva:diagonal-arrow-right-up-fill" />
              </IconButton>
            </Tooltip>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
