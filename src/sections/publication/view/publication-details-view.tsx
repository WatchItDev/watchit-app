// REACT IMPORTS
import { useRef, useState } from 'react';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

// LENS IMPORTS
import { usePublication } from '@lens-protocol/react';

// MOTION IMPORTS
import { m } from 'framer-motion';

// ICONS IMPORTS
import { IconChevronLeft, IconLock } from '@tabler/icons-react';

// LOCAL IMPORTS
import { paths } from '@src/routes/paths';
import Label from '@src/components/label';
import Image from '@src/components/image';
import { useRouter } from '@src/routes/hooks';
import Markdown from '@src/components/markdown';
import { varFade } from '@src/components/animate';
import Header from '@src/layouts/dashboard/header';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import ProfileHome from '@src/sections/user/profile-home.tsx';
import { LoadingScreen } from '@src/components/loading-screen';
import MoviePlayView from '@src/sections/publication/view/publication-play-view.tsx';
import PublicationDetailMain from '@src/components/publication-detail-main.tsx';

const videoDescription = `
¡Bienvenidos al canal! 🎥 En este video, vamos a explorar **[Tema del Video]**, donde desglosaremos paso a paso todo lo que necesitas saber. Este es un video extenso y detallado, así que si eres alguien que quiere profundizar en este tema y conocer todos los aspectos importantes, ¡has llegado al lugar correcto!

## Contenido del video

1. **Introducción y objetivos**: Comenzamos con una breve introducción para explicar por qué este tema es relevante y lo que puedes esperar al finalizar el video.
2. **Explicación detallada**: Desglosamos cada sección con ejemplos prácticos y explicaciones fáciles de seguir.
3. **Ejemplos y demostraciones**: Incluimos casos de uso reales y simulaciones para ilustrar los conceptos de manera visual.
4. **Resumen y puntos clave**: Recapitulamos los puntos más importantes para asegurarnos de que te lleves un aprendizaje completo.
5. **Conclusiones y próxima sesión**: Te contamos cómo puedes seguir profundizando y qué se viene en los próximos videos.

## Recursos mencionados

- [Enlace a documentación](#)
- [Artículos relacionados](#)
- [Plantillas de trabajo](#)

## ¡Únete a la comunidad!

Si te gustó este contenido y quieres seguir aprendiendo sobre **[tema del video]**, no olvides darle like 👍, suscribirte 🔔 y activar la campanita para no perderte ninguna actualización. También puedes dejar tus comentarios y preguntas abajo, ya que me encanta interactuar con la comunidad y conocer tus opiniones.

---

**¿Te ha resultado útil este video?** Compártelo con tus amigos o colegas que puedan estar interesados. Nos vemos en el próximo video, donde seguiremos explorando temas fascinantes y prácticos para tu crecimiento personal y profesional.

¡Gracias por tu tiempo y hasta pronto! 🙌
`;


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

// ----------------------------------------------------------------------

export default function PublicationDetailsView({ id }: Props) {
  // STATES HOOKS
  const [showToggle, setShowToggle] = useState(false);
  const [hasAccess, setHasAccess] = useState(false)
  const descriptionRef = useRef(null);
  // LOCAL HOOKS
  const theme = useTheme();
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  // LENS HOOKS
  const { data, loading }: any = usePublication({
    forId: id as any,
  });
  // CONSTANTS
  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  const handleBack = () => {
    router.push(paths.dashboard.root);
  }

  const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid.replace('ipfs://', '')}`

  const getWallpaperCid = (): string => data?.metadata?.attachments?.find((el: any) => el.altTag === 'Wallpaper')?.image?.raw?.uri

  const getPosterCid = (): string => data?.metadata?.attachments?.find((el: any) => el.altTag === 'Vertical Poster')?.image?.raw?.uri

  const toggleDescription = () => {
    setShowToggle(!showToggle);
  };

  const handleSubscribe = () => {
    setHasAccess(true)
  };

  if (loading) return <LoadingScreen />

  return (
    <>
      <Header>
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
      </Header>
      <Box sx={{ width: '100%', maxWidth: 'calc(100% - 1.5rem)', maxHeight: '100%', position: 'relative' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', maxWidth: '100%' }}>
          <Stack
            sx={{
              display: 'flex', flexGrow: 1, maxWidth: 'calc(100% - 450px)'
            }}
          >
            <Card sx={{ width: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {hasAccess ? (
                  <MoviePlayView publication={data} loading={loading} />
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: '100%',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '15px',
                        backdropFilter: 'blur(8px)',
                        background: 'rgba(25, 28, 31, 0.5)'
                      }}
                    />

                    <Image
                      dir="ltr"
                      alt={data?.metadata?.title}
                      src={getMediaUri(getWallpaperCid())}
                      ratio="21/9"
                      sx={{
                        borderRadius: 2,
                        zIndex: 0,
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                    />

                    <Image
                      alt={data.id}
                      src={getMediaUri(getPosterCid())}
                      ratio="1/1"
                      sx={{
                        borderRadius: 1,
                        objectFit: 'cover',
                        maxWidth: '30%',
                        position: 'absolute',
                        zIndex: 2,
                        border: '2px solid rgba(255, 255, 255, 0.08)'
                      }}
                    />

                    <Button
                      variant='contained'
                      sx={{
                        color: '#1E1F22',
                        background: '#FFFFFF',
                        height: '35px',
                        bottom: 16,
                        left: 16,
                        position: 'absolute',
                        zIndex: 2,
                      }}
                      onClick={() => {}}
                      disabled={false}
                    >
                      <IconLock fontSize="large" size={18} />
                      <Typography variant="body2" sx={{ lineHeight: 1 , fontWeight: '700', ml: 1}}>
                        Locked
                      </Typography>
                    </Button>
                  </Box>
                )}

                <Container sx={{ mb: 8, p: '0 !important' }}>
                  <Box sx={{ display:'flex', flexDirection: 'column' }}>
                    <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'end', mt: 3 }}>
                      <m.div variants={variants}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }} gutterBottom>
                          Overview
                        </Typography>
                      </m.div>
                      <Box sx={{ mt: 2, px: 4, position: 'relative' }}>
                        <m.div variants={variants}>
                          <Box
                            ref={descriptionRef}
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: showToggle ? 'none' : 5,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              opacity: 0.8,
                            }}
                          >
                            <Markdown children={videoDescription} />
                          </Box>
                          <Button variant="outlined" onClick={toggleDescription} sx={{ mt: 2 }}>
                            {showToggle ? 'Mostrar menos' : 'Mostrar más'}
                          </Button>
                        </m.div>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', mt: 4 }}>
                      <m.div variants={variants}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }}
                                    gutterBottom>
                          Sponsors
                        </Typography>
                      </m.div>
                      <Box sx={{ mt: 2, opacity: 0.8, px: 4 }}>
                        <m.div variants={variants}>
                          <Typography variant="body1" color="textSecondary"
                                      sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }} gutterBottom>
                            No Sponsors yet. Be the first to support!
                          </Typography>
                        </m.div>
                      </Box>
                    </Box>
                    <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'end', mt: 4 }}>
                      <m.div variants={variants}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }} gutterBottom>
                          Bakers
                        </Typography>
                      </m.div>
                      <Box sx={{ mt: 2, opacity: 0.8, px: 4 }}>
                        <m.div  variants={variants}>
                          <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }} gutterBottom>
                            No Bakers yet. Be the first to support!
                          </Typography>
                        </m.div>
                      </Box>
                    </Box>
                    <Box sx={{ display:'flex', flexDirection:'column', mt: 6 }}>
                      <Typography variant="h5" sx={{ mb: 2, width: '100%' }}>
                        More from {data?.by?.metadata?.displayName.split(' ')[0]}
                      </Typography>
                      <ProfileHome profile={data?.by} noPaddings={true} />
                    </Box>
                  </Box>
                </Container>
              </CardContent>
            </Card>
          </Stack>
          <PublicationDetailMain post={data} handleSubscribe={handleSubscribe} />
        </Box>
      </Box>
    </>
  );
}
