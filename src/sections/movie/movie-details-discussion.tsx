// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// hooks
/* import { useBoolean } from '@src/hooks/use-boolean'; */
//
import { IconArrowUp, IconArrowDown, IconHeartFilled, IconMessageCircle2Filled } from '@tabler/icons-react';

// ----------------------------------------------------------------------

export default function MovieDetailsDiscussion() {
  // const review = useBoolean();
  const items = [
    { title: 'Item 1', description: 'Descripción del ítem 1' },
    { title: 'Item 2', description: 'Descripción del ítem 2' },
    { title: 'Item 3', description: 'Descripción del ítem 3' },
    { title: 'Item 4', description: 'Descripción del ítem 4' },
  ];

  return (
    <Box sx={{display:'flex'}}>
      <Box sx={{width:'70%',display:'flex',flexDirection:'column',padding:'0 20px'}}>
        {
          items.map(() => (
            <Box sx={{display:'flex',alignItems:'center',margin:'20px 0',width:'100%'}}>
              <Box>
                  <Box sx={{
                  display:'flex',
                  flexDirection:'column',
                  justifyContent:'center',
                  alignItems:'center',
                  border:'1px white solid',
                  borderRadius:'20px',
                  padding:'20px 15px'
                }}>
                    <Button sx={{background:'#FFFFFF',marginRight:'5px',padding:'5px',minWidth:'0',borderRadius:'50%'}} variant='contained'>
                      <IconArrowUp style={{marginRight:'4px'}} size={22} color='black' />
                    </Button>
                    <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)',whiteSpace: 'nowrap',margin:'10px 0'}} variant='body2'>12</Typography>
                    <Button sx={{background:'#FFFFFF',padding:'5px',minWidth:'0',borderRadius:'50%'}} variant='contained'>
                      <IconArrowDown style={{marginRight:'4px'}} size={22} color='black' />
                    </Button>
                  </Box>
              </Box>
              <Box sx={{display:'flex',flexDirection:'column',padding:'0px 10px',width:'90%'}}>
                <Typography style={{fontSize: 'clamp(1.5rem, 1vw, 3rem)'}} noWrap variant='h6' sx={{ mb: 1 }}>
                  Do you think the ending of Edge of Tomorrow makes sense? Why or why not?
                </Typography>

                <Stack sx={{overflow: 'hidden',flexDirection:'column', width:'100%'}} direction="row" spacing={1} alignItems='center'>
                  <Typography sx={{fontSize: 'clamp(1rem, 0.8vw, 2rem)'}} variant='body2'>
                      The movie Edge of Tomorrow has an ending that has left many viewers divided. Some believe that the
                      conclusion is satisfying and ties up the story well, while others think it is confusing and does not
                      resolve all the questions posed throughout the film. What do you think about the ending? Do you believe
                      it makes sense within the context of the movie?
                  </Typography>
                  <Box style={{display:'flex',alignItems:'center',justifyContent:'space-between', width:'100%'}}>
                    <Box style={{display:'flex',alignItems:'center'}}>
                      <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)',whiteSpace: 'nowrap',marginRight:'5px'}} variant='body2'>@Jadapema •</Typography>
                      <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)',whiteSpace: 'nowrap'}} variant='body2'>3 Hours ago</Typography>
                    </Box>
                    <Box style={{display:'flex',alignItems:'center'}}>
                      <Box style={{display:'flex',alignItems:'center',marginRight:'5px'}}>
                        <IconHeartFilled style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
                        <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)',whiteSpace: 'nowrap'}} variant='body2'>65</Typography>
                      </Box>
                      <Box style={{display:'flex',alignItems:'center'}}>
                        <IconMessageCircle2Filled style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
                        <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)',whiteSpace: 'nowrap'}} variant='body2'>12</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
          ))
        }
        <Box sx={{width:'100%',margin:'20px 0',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <Button variant="outlined" sx={{ mt: 3 , borderColor: '#FFFFFF',
                color: '#FFFFFF',
                '&:hover': {
                  borderColor: 'darkred',
                  color: 'darkred',
                }, }}>
                Show more
            </Button>
        </Box>
      </Box >
        <Box sx={{width:'30%'}}>
          <Box sx={{width:'100',margin:'20px',padding:'50px 30px',display:'flex',flexDirection:'column',borderRadius:'10px',background:'black',justifyContent:'center',alignItems:'center'}}>
              <Box sx={{textAlign:'center',fontWeight:'bold'}}>
                Want to be a movie influencer?
              </Box>
              <Box>
                <Button variant='contained' sx={{ mt: 3 , color:'#FFFFFF',background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)' }}>
                  Create a discussion
                </Button>
              </Box>
          </Box>
        </Box>
      </Box>
  );
}
