import { formatDistance } from 'date-fns';

// @MUI
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

// Project components
import useReferrals, {Invitation} from "@src/hooks/use-referrals.ts";
import Button from "@mui/material/Button";
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import {useRouter} from "@src/routes/hooks";
import {paths} from "@src/routes/paths.ts";
import {useSelector} from "react-redux";
import {notifySuccess} from "@notifications/internal-notifications.ts";
import {SUCCESS} from "@notifications/success.ts";

// ----------------------------------------------------------------------

type Props = {
  row: Invitation;
  selected: boolean;
};


const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// ----------------------------------------------------------------------

export default function ProfileReferralsTableRow({ row, selected }: Props) {
  const { destination, status, created_at: date, id, receiver_id } = row;
  const sessionData = useSelector((state: any) => state.auth.session);
  const userEmail = useSelector((state: any) => state.auth.email);
  const router = useRouter();
  const { sendEmail } = useReferrals();

  // If receiver_id is null, send again; otherwise, view profile as link
  const handleClick = () => {
    if (receiver_id === null) {
      sendEmail({
        from_name: sessionData?.profile?.metadata?.displayName ?? 'Watchit Web3xAI',
        to_email: destination,
        from_email:  userEmail ?? 'contact@watchit.movie'
      }).then((_r) => {
        notifySuccess(SUCCESS.INVITATIONS_SUCCESSFULLY);
      })
    } else {
      router.push(paths.dashboard.user.root(receiver_id));
    }
  }

  const dateObject = new Date(date);
  const daysAgo = formatDistance(dateObject,new Date(), { addSuffix: true });

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <AvatarProfile src={`user_${id}`} alt={destination} sx={{mr: 2}} />
        <ListItemText
          primary={destination}
          secondary={`Sent ${daysAgo}`}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ color: status === 'accepted' ? '#00AB55' : '#FF4842' }}>
          {capitalizeFirstLetter(status)}
        </Typography>
      </TableCell>

      <TableCell>
        <Button variant="outlined" size="small" onClick={handleClick}>
          {
            receiver_id === null ? 'Resend' : 'View profile'
          }
        </Button>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}
