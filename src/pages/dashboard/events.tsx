import { Helmet } from 'react-helmet-async';
// sections
// import { CalendarView } from '@src/sections/calendar/view';
import ComingSoonView from "@src/sections/coming-soon/view.tsx";
import BlankView from "@src/sections/blank/view.tsx";

// ----------------------------------------------------------------------

export default function CalendarPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Calendar</title>
      </Helmet>

      <BlankView>
        <ComingSoonView />
      </BlankView>
    </>
  );
}
