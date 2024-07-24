import { Helmet } from 'react-helmet-async';
// sections
import TimelineView from 'src/sections/_examples/mui/timeline-view';

// ----------------------------------------------------------------------

export default function TimelinePage() {
  return (
    <>
      <Helmet>
        <title> MUI: Timeline</title>
      </Helmet>

      <TimelineView />
    </>
  );
}
