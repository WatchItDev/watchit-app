import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// routes
import { paths } from 'src/routes/paths';
// components
import Editor from 'src/components/editor';
import Markdown from 'src/components/markdown';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function EditorView() {
  const [quillSimple, setQuillSimple] = useState('');

  const [quillFull, setQuillFull] = useState('');

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Editor"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Editor' },
            ]}
            moreLink={['https://github.com/zenoamaro/react-quill']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Editor Simple" />
              <CardContent>
                <Editor
                  simple
                  id="simple-editor"
                  value={quillSimple}
                  onChange={(value) => setQuillSimple(value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Editor Full" />
              <CardContent>
                <Editor
                  id="full-editor"
                  value={quillFull}
                  onChange={(value) => setQuillFull(value)}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack sx={{ p: 3, borderRadius: 2, bgcolor: 'background.neutral' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Preview Plain Text
              </Typography>
              <Markdown children={quillFull} />

              <Divider sx={{ my: 5 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>
                Preview Html
              </Typography>
              <Typography>{quillFull}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
