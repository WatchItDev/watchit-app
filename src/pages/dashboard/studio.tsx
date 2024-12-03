import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {
  ProfileSession,
  useCreatePost,
  useSession,
} from '@lens-protocol/react-web';
import { AnyMedia, MediaVideoMimeType, video } from '@lens-protocol/metadata';
import axios from 'axios';
import uuidv4 from '../../utils/uuidv4';
import { Grid, Modal } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import HeaderContent from '@src/layouts/dashboard/HeaderContent.tsx';
import Header from '@src/layouts/dashboard/header.tsx';

const publicationMetadata = {
  title: "Nosferatu",
  synopsis: "homas Hutter, working for an estate agency, is sent to Transylvania by his boss to visit a new client named Count Orlok who plans to buy a property. After entrusting his wife Ellen to his good pal, he embarks on his journey. During his journey amid the mountainous regions, he stops at an inn for dinner. The locals discourage Hutter from traveling to the Count's castle but Hutter proceeds his journey by taking a coach. Due to nightfall, the coachman declines to take him any further than the bridge. Hutter continues his journey alone and after crossing the bridge, a mysterious coach appears and a mysterious coachman gestures Hutter to climb aboard. After leaving Hutter outside the Count's castle, the coach goes away. Hutter is welcomed at the castle by Count Orlok",
  asset: "bafkreih3d5mvezcyzzlp2qb7ezkh53vlmtjenfofjv3diafsl22xaowzcu",
  media: [
    {
      item: "bafkreihj3xgnid6d6os3d2sihsircvttgc44thcgvyou4z2mpmrpumj5am",
      type: "image/jpeg",
      altTag: "poster"
    },
    {
      item: "bafybeicj2bi3ozc6gwqok7m4v4pzhqp2wi6uhjkjugcj2clqxrwxaldgfe",
      type: "image/jpeg",
      altTag: "wallpaper"
    },
  ]
};

// Función para subir los metadatos a Pinata
const uploadToPinata = async (metadata: any) => {
  const pinataApiKey = '26e37a596e8e561427af'; // Reemplaza con tu clave de API
  const pinataSecretApiKey = '9d9469c678bb8db458851c5342f9201ab4811c29f281f7d8205a6a18cf302566'; // Reemplaza con tu clave secreta de API

  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  const response = await axios.post(url, metadata, {
    headers: {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });

  return `ipfs://${response.data.IpfsHash}`;
};

// ----------------------------------------------------------------------

export default function OverviewFilePage() {
  // @ts-ignore eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState(false);
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();

  // @ts-ignore eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { execute: createPost } = useCreatePost();

  const getMediaUri = (cid: string): string => `https://g.watchit.movie/fetch/${cid?.replace('ipfs://', '')}/`

  // @ts-ignore eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async () => {
    try {
      if (!sessionData?.authenticated) {
        console.error('No active profile found');
        return;
      }

      console.log('submit')

      console.log('attributes')

      // Prepara los medios
      const mediaItems: AnyMedia[] = publicationMetadata.media.map((mediaItem: any) => ({
        item: getMediaUri(mediaItem.item) as any,
        type: mediaItem.type as any,
        altTag: mediaItem.altTag as string,
      }));

      console.log('media')

      // Crear el objeto de metadatos usando el helper 'video'
      const metadata = video({
        id: uuidv4(),
        title: publicationMetadata.title,
        content: publicationMetadata.synopsis,
        video: {
          item: publicationMetadata.asset,
          type: MediaVideoMimeType.MP4,
          altTag: "asset"
        },
        locale: 'en',
        attachments: mediaItems,
        appId: 'watchit',
      });

      console.log('last media')
      console.log(metadata)
      console.log(mediaItems)
      console.log(mediaItems[mediaItems.length - 1])
      console.log('metadata')

      // Subir los metadatos a Pinata
      const metadataUri = await uploadToPinata(metadata);

      console.log('metadata cid')
      console.log(metadataUri)

      // Crear el post en Lens con el Collect Action Module
      const result = await createPost({
        metadata: metadataUri
      });

      console.log('result')

      if (result.isFailure()) {
        console.error('Error creating post', result.error);
      } else {
        const completion = await result.value.waitForCompletion();
        if (completion.isFailure()) {
          window.alert(completion.error.message);
        } else {
          window.alert('Post created successfully');
        }

        handleClose(); // Cierra el modal
      }
    } catch (error) {
      console.error('Error submitting to Lens:', error);
    }
  };

  // const createTipModuleMetadata = () => {
  //   return module({
  //     name: 'TipActionModule',
  //     title: 'Tip Action Module',
  //     description: 'This module allows users to tip the author of a publication.',
  //     authors: ['martijn.vanhalen@gmail.com'],
  //     initializeCalldataABI: `${JSON.stringify([
  //       {
  //         "type": "address",
  //         "name": "tipReceiver"
  //       }
  //     ])}`,
  //     processCalldataABI: `${JSON.stringify([
  //       {
  //         "type": "address",
  //         "name": "currency"
  //       },
  //       {
  //         "type": "uint256",
  //         "name": "tipAmount"
  //       }
  //     ])}`,
  //     $schema: ModuleSchemaId.LATEST
  //   } as ModuleOptions);
  // };
  //
  // const createAndUploadTipModuleMetadata = async () => {
  //   try {
  //     const metadata = createTipModuleMetadata();
  //     const metadataUri = await uploadToPinata(metadata);
  //     console.log(metadata);
  //     console.log('Module Metadata CID:', metadataUri);
  //   } catch (error) {
  //     console.error('Error uploading metadata:', error);
  //   }
  // };
  //
  // useEffect(() => {
  //   // createAndUploadTipModuleMetadata();
  // }, []);
  //
  // if (loading) return <LoadingScreen />

  return (
    <>
      <Helmet>
        <title> WatchIt | Studio</title>
      </Helmet>

      {/*<BlankView>*/}
      {/*  <ComingSoonView />*/}
      {/*</BlankView>*/}

      <Header>
        <HeaderContent title="Studio" />
      </Header>

      <Grid container spacing={2} style={{ height: 'calc(100vh - 5rem)', width: '100%', padding: '2rem 1.5rem 2rem 2rem' }}>
        <Grid item xs={8} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          <Grid container spacing={2} style={{ flexGrow: 1 }}>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={6}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 31rem)',borderRadius:'10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={6}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 31rem)',borderRadius:'10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={2} style={{ flexGrow: 1 }}>
            <Grid item xs={12}>
              <Box sx={{ height: '9rem' }}>
                <Box sx={{width:'100%',height:'100%',padding:'25px 15px',display:'flex',flexDirection:'column',borderRadius:'10px',background:'black',justifyContent:'center',alignItems:'center'}}>
                  <Box sx={{textAlign:'center',fontWeight:'bold'}}>
                    Do you want other people to see your movies?
                  </Box>
                  <Box>
                    <Button
                      variant='contained' onClick={handleOpen}
                      sx={{ mt: 3 , color:'#FFFFFF',background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)' }}
                    >
                      Upload Movie
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 14rem)',borderRadius:'10px' }} variant="rectangular" width="100%" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: '#2B2D31',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, color: '#fff' }}
          >
            Upload hardcoded movie
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Upload
          </Button>
        </Box>
      </Modal>
    </>
  );
}
