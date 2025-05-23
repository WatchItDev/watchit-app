// DATE IMPORTS
import { formatDistance } from 'date-fns';

// MUI IMPORTS
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Button from "@mui/material/Button";

// LOCAL IMPORTS
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import {useRouter} from "@src/routes/hooks";
import {paths} from "@src/routes/paths";
import { capitalizeFirstLetter } from '@src/utils/text-transform';
import { ProfileReferralsTableRowProps } from '../types';
// ----------------------------------------------------------------------

export default function ProfileReferralsTableRow({ row, selected }: Readonly<ProfileReferralsTableRowProps>) {
  const { destination, status, created_at: date, id, receiver_id } = row;
  const router = useRouter();

  // If receiver_id is null, send again; otherwise, views profile as link
  const handleClick = () => {
    if (receiver_id) {
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
        {
          receiver_id ?  (
            <Button variant="outlined" size="small" onClick={handleClick}>
              View profile
            </Button>
          ) :  <Typography variant="body2" sx={{ color: '#FF4842' }}>
            {capitalizeFirstLetter(status)}
          </Typography>
        }

      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}
