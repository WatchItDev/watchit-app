import { Skeleton, Grid, Box, Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import BlankView from '../../sections/blank/view';
import ComingSoonView from '../../sections/coming-soon/view';

// ----------------------------------------------------------------------

export default function OverviewFilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: File</title>
      </Helmet>

      <BlankView sx={{display:'flex',alignItem:'center'}}>
        <Grid container spacing={2} style={{ height: 'calc(100vh - 5rem)', width: '100%' }}>

          <Grid item xs={8} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={2} style={{ flexGrow: 1 }}>

              <Grid item xs={4}>
                <Skeleton sx={{ bgcolor: 'grey.900', height: 'calc((100vh - 8rem) / 3)',borderRadius:'10px' }} variant="rectangular" width="100%" />
              </Grid>
              <Grid item xs={4}>
                <Skeleton sx={{ bgcolor: 'grey.900', height: 'calc((100vh - 8rem) / 3)',borderRadius:'10px' }} variant="rectangular" width="100%" />
              </Grid>
              <Grid item xs={4}>
                <Skeleton sx={{ bgcolor: 'grey.900', height: 'calc((100vh - 8rem) / 3)',borderRadius:'10px' }} variant="rectangular" width="100%" />
              </Grid>

              <Grid item xs={6}>
                <Skeleton sx={{ bgcolor: 'grey.900', height: 'calc((100vh - 8rem) / 3)',borderRadius:'10px' }} variant="rectangular" width="100%" />
              </Grid>
              <Grid item xs={6}>
                <Skeleton sx={{ bgcolor: 'grey.900', height: 'calc((100vh - 8rem) / 3)',borderRadius:'10px' }} variant="rectangular" width="100%" />
              </Grid>

              <Grid item xs={4}>
                <Skeleton sx={{ bgcolor: 'grey.900', height: 'calc((100vh - 8rem) / 3)',borderRadius:'10px' }} variant="rectangular" width="100%" />
              </Grid>
              <Grid item xs={4}>
                <Skeleton sx={{ bgcolor: 'grey.900', height: 'calc((100vh - 8rem) / 3)',borderRadius:'10px' }} variant="rectangular" width="100%" />
              </Grid>
              <Grid item xs={4}>
                <Skeleton sx={{ bgcolor: 'grey.900', height: 'calc((100vh - 8rem) / 3)',borderRadius:'10px' }} variant="rectangular" width="100%" />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={2} style={{ flexGrow: 1 }}>
              <Grid item xs={12}>
                {/* <Skeleton sx={{ bgcolor: 'grey.900', height: 'calc((100vh - 8rem) / 3)' }} variant="rectangular" width="100%" /> */}
                  <Box sx={{ height: 'calc((100vh - 8rem) / 3)' }}>
                    <Box sx={{width:'100',padding:'25px 15px',display:'flex',flexDirection:'column',borderRadius:'10px',background:'black',justifyContent:'center',alignItems:'center'}}>
                      <Box sx={{textAlign:'center',fontWeight:'bold'}}>
                        Do you want other people to see your movies?
                      </Box>
                      <Box>
                        <Button variant='contained' sx={{ mt: 3 , color:'#FFFFFF',background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)' }}>
                          Updload Movie
                        </Button>
                      </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Skeleton sx={{ bgcolor: 'grey.900', height: 'calc((200vh - 13rem) / 3)',borderRadius:'10px' }} variant="rectangular" width="100%" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </BlankView>
    </>
  );
}
