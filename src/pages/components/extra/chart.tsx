import { Helmet } from 'react-helmet-async';
// sections
import ChartView from 'src/sections/_examples/extra/chart-view';

// ----------------------------------------------------------------------

export default function ChartPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Chart</title>
      </Helmet>

      <ChartView />
    </>
  );
}
