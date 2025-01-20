// LOCAL IMPORTS
import { UserProfileView } from '@src/sections/user/view';
import { useParams } from '@src/routes/hooks';
import Header from '@src/layouts/dashboard/header.tsx';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Header>
        <HeaderContent title="Profile" />
      </Header>

      <UserProfileView id={id} />
    </>
  );
}
