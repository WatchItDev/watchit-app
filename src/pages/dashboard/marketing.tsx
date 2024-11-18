import { Helmet } from 'react-helmet-async';
import BlankView from '../../sections/blank/view';
import ComingSoonView from '../../sections/coming-soon/view';

// ----------------------------------------------------------------------

export default function ChatPage() {
  return (
    <>
      <Helmet>
        <title> WatchIt | Marketing</title>
      </Helmet>

      <BlankView>
        <ComingSoonView />
      </BlankView>
    </>
  );
}
