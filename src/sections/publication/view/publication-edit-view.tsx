// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from '@src/routes/paths';
// api
import { useGetProduct } from '@src/api/product';
// components
import { useSettingsContext } from '@src/components/settings';
import CustomBreadcrumbs from '@src/components/custom-breadcrumbs';
//
import PublicationNewEditForm from '../publication-new-edit-form.tsx';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function PublicationEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { product: currentProduct } = useGetProduct(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Movie',
            href: paths.dashboard.publication.root,
          },
          { name: currentProduct?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PublicationNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}
