import { Helmet } from 'react-helmet-async';
// sections
import TabsView from 'src/sections/_examples/mui/tabs-view';

// ----------------------------------------------------------------------

export default function TabsPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Tabs</title>
      </Helmet>

      <TabsView />
    </>
  );
}
