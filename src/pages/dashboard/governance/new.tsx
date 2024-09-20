import { Helmet } from 'react-helmet-async';
// sections
import { GovernanceCreateView } from 'src/sections/governance/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new user</title>
      </Helmet>

      <GovernanceCreateView />
    </>
  );
}
