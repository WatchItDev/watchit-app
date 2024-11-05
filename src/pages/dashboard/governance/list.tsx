import { Helmet } from 'react-helmet-async';
// sections
// import { GovernanceListView } from '../../../sections/governance/view';
import ComingSoonView from "@src/sections/coming-soon/view.tsx";
import BlankView from "@src/sections/blank/view.tsx";

// ----------------------------------------------------------------------

export default function GovernanceList() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Kanban</title>
      </Helmet>

      <BlankView>
        <ComingSoonView />
      </BlankView>
    </>
  );
}
