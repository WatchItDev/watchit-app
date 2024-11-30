import { Helmet } from 'react-helmet-async';
// routes
import { useParams, useRouter } from '@src/routes/hooks';
// sections
import { PublicationDetailsView } from '@src/sections/publication/view';
import Header from '@src/layouts/dashboard/header.tsx';
import { paths } from '@src/routes/paths.ts';

import HeaderContent from "@src/layouts/dashboard/HeaderContent.tsx";

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const handleBack = () => {
    router.push(paths.dashboard.root);
  }

  return (
    <>
      <Helmet>
        <title> Dashboard: Movie details</title>
      </Helmet>

      <Header>
        <HeaderContent handleBack={handleBack} title="Movie details" />
      </Header>

      <PublicationDetailsView id={`${id}`} />
    </>
  );
}
