import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from '@src/routes/hooks';
// sections
import { PublicationDetailsView } from '@src/sections/publication/view';
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Movie Details</title>
      </Helmet>

      <PublicationDetailsView id={`${id}`} />
    </>
  );
}
