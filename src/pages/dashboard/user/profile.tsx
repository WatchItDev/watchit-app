import { Helmet } from 'react-helmet-async';
// sections
import { UserProfileView } from 'src/sections/user/view';
import { useParams } from '../../../routes/hooks';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: User Profile</title>
      </Helmet>

      <UserProfileView id={id} />
    </>
  );
}
