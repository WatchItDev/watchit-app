// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// api
import { useGetPost } from 'src/api/blog';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PostNewEditForm from '../post-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  title: string;
};

export default function PostEditView({ title }: Props) {
  const settings = useSettingsContext();

  const { post: currentPost } = useGetPost(title);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Blog',
            href: paths.dashboard.post.root,
          },
          {
            name: currentPost?.title,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PostNewEditForm currentPost={currentPost} />
    </Container>
  );
}
