import { Helmet } from 'react-helmet-async';
// routes
import { useParams, useRouter } from '@src/routes/hooks';
// sections
import { PublicationDetailsView } from '@src/sections/publication/view';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { IconChevronLeft } from '@tabler/icons-react';
import Typography from '@mui/material/Typography';
import Label from '@src/components/label';
import Header from '@src/layouts/dashboard/header.tsx';
import { paths } from '@src/routes/paths.ts';
import { useResponsive } from '@src/hooks/use-responsive.ts';

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { id } = params;

  const handleBack = () => {
    router.push(paths.dashboard.root);
  }

  return (
    <>
      <Helmet>
        <title> Dashboard: Movie Details</title>
      </Helmet>

      <Header>
        <>
          <Button
            onClick={handleBack} disableFocusRipple
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: '#24262A',
              borderRadius: 1.5,
              m: 1,
              p: 0.2,
              '&:hover': {
                backgroundColor: '#1E1F22'
              }
            }}
          >
            <IconButton disableRipple>
              <IconChevronLeft size={20} />
              <Typography sx={{ ml: 1 }} variant='subtitle2'>Back</Typography>
            </IconButton>


            {mdUp && <Label sx={{ px: 0.75, mr: 1, fontSize: 12, color: 'text.secondary' }}>Esc</Label>}
          </Button>
          <Typography variant="h6" sx={{ ml: 2 }}>
            Movie details
          </Typography>
        </>
      </Header>

      <PublicationDetailsView id={`${id}`} />
    </>
  );
}
