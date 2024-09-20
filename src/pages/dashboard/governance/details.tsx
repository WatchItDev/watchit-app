import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { GovernanceDetailsView } from '../../../sections/governance/view';

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  // const params = useParams();
  //
  // const { id } = params;

  return (
    <GovernanceDetailsView title="" />
  );
}
