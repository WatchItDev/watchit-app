import { Helmet } from 'react-helmet-async';
// sections
import { GovernanceListView } from '../../../sections/governance/view';

// ----------------------------------------------------------------------

export default function GovernanceList() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Kanban</title>
      </Helmet>

      <GovernanceListView />
    </>
  );
}
