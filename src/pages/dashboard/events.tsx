import { Helmet } from 'react-helmet-async';
// sections
import { CalendarView } from 'src/sections/calendar/view';

// ----------------------------------------------------------------------

export default function CalendarPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Calendar</title>
      </Helmet>

      <CalendarView />
    </>
  );
}
