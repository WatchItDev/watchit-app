import { Helmet } from 'react-helmet-async';
// sections
import RatingView from 'src/sections/_examples/mui/rating-view';

// ----------------------------------------------------------------------

export default function RatingPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Rating</title>
      </Helmet>

      <RatingView />
    </>
  );
}
