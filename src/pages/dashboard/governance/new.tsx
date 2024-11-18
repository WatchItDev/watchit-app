import { Helmet } from 'react-helmet-async';
// sections
import { GovernanceCreateView } from '@src/sections/governance/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> WatchIt | Governance</title>
      </Helmet>

      <GovernanceCreateView />
    </>
  );
}
