import { Helmet } from 'react-helmet-async';
// sections
import OrganizationalChartView from 'src/sections/_examples/extra/organizational-chart-view';

// ----------------------------------------------------------------------

export default function OrganizationalChartPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Organizational Chart</title>
      </Helmet>

      <OrganizationalChartView />
    </>
  );
}
