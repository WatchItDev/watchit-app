import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import {
  Amount,
  OpenActionType,
  ProfileSession,
  useCreatePost,
  useCurrencies,
  useSession,
} from '@lens-protocol/react-web';
import { AnyMedia, MetadataAttributeType, module, ModuleOptions, ModuleSchemaId, video } from '@lens-protocol/metadata';
import axios from 'axios';
import uuidv4 from '../../utils/uuidv4';
import { LoadingScreen } from '../../components/loading-screen';
import { encodeData } from '@lens-protocol/react';
import { Grid, Modal } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';

// Metadatos de la película en una constante
const movieMetadata = {
  title: "Infinite Skies (collectable 4)",
  synopsis: "In a world where gravity is no longer a constant, humanity has learned to live in the clouds. A young inventor discovers a way to unlock the secrets of flight, but dangerous forces are ready to exploit his discoveries for their own gain.",
  genres: ["Sci-Fi", "Adventure"],
  releaseDate: "2022-07-11",
  duration: "112 minutes",
  language: "English",
  country: "USA",
  rating: "PG",
  format: "4DX",
  studioName: "Cloud Productions",
  budget: "$90,000,000",
  director: "Lucas Brown",
  writer: "Grace Martin",
  producers: ["Samuel Lee", "Isabella Carter"],
  editor: "Nathan Lewis",
  price: 50,
  media: [
    {
      item: "QmU1DBnZ8ut5iztmMMn412FVKGFAJgVokFaUtxW59KuHCm",
      type: "image/jpeg",
      altTag: "Vertical Poster"
    },
    {
      item: "QmZhcxRvNhTZ5SGNU5RFVheHa3bAbg5QuR2PPeevhoZmMf",
      type: "image/jpeg",
      altTag: "Horizontal Poster"
    },
    {
      item: "QmNrua6yuwbmxxKKwaHSvmsjSLjJ79P4jbSBqsbJS1SjNS",
      type: "image/jpeg",
      altTag: "Wallpaper"
    },
    {
      item: "QmQMZt69xAU1qwn6cvQywzXsMSaWVdwEht7vuLE4AGWZFg",
      type: "video/mp4",
      altTag: "Movie Trailer"
    },
    {
      item: "QmQMZt69xAU1qwn6cvQywzXsMSaWVdwEht7vuLE4AGWZFg",
      type: "video/mp4",
      altTag: "Full Movie"
    }
  ],
  creators: ["Lucas Brown", "Grace Martin"]
};

const TIP_ACTION_MODULE_ADDRESS = '0xe95A8326EBd29B6574875806474d6f9734De80A5';
const MMC_ADDRESS = '0xdC2E7C4444730980CEB8982CfC8A1c4902fa36bE';

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
  const { data, loading } = useCurrencies();

  console.log('currencies')
  console.log(data)

  console.log('activeProfile')
  console.log(sessionData?.profile)

  // @ts-ignore eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async () => {
    try {
      if (!sessionData?.authenticated) {
        console.error('No active profile found');
        return;
      }

      console.log('submit')

      // Prepara los atributos
      const attributes = [
        { traitType: 'Genres', value: movieMetadata.genres.join(', ') },
        { traitType: 'Release Date', value: movieMetadata.releaseDate },
        { traitType: 'Duration', value: movieMetadata.duration },
        { traitType: 'Language', value: movieMetadata.language },
        { traitType: 'Country', value: movieMetadata.country },
        { traitType: 'Rating', value: movieMetadata.rating },
        { traitType: 'Format', value: movieMetadata.format },
        { traitType: 'Studio Name', value: movieMetadata.studioName },
        { traitType: 'Budget', value: movieMetadata.budget },
        { traitType: 'Director', value: movieMetadata.director },
        { traitType: 'Writer', value: movieMetadata.writer },
        { traitType: 'Producers', value: movieMetadata.producers.join(', ') },
        { traitType: 'Editor', value: movieMetadata.editor },
        { traitType: 'Creators', value: movieMetadata.creators.join(', ') },
      ];

      console.log('attributes')

      // Prepara los medios
      const mediaItems: AnyMedia[] = movieMetadata.media.map((mediaItem: any) => ({
        item: `ipfs://${mediaItem.item}` as any,
        type: mediaItem.type as any,
        altTag: mediaItem.altTag as string,
      }));

      console.log('media')

      // Crear el objeto de metadatos usando el helper 'video'
      const metadata = video({
        id: uuidv4(),
        title: movieMetadata.title,
        content: movieMetadata.synopsis,
        video: mediaItems[mediaItems.length - 2] as any,
        locale: 'en',
        attributes: attributes.map((attr) => ({
          type: MetadataAttributeType.STRING,
          key: attr.traitType,
          value: attr.value,
        })),
        attachments: mediaItems,
        appId: 'watchit',
      });

      console.log('metadata')

      // Subir los metadatos a Pinata
      const metadataUri = await uploadToPinata(metadata);

      console.log('metadata cid')
      console.log(metadataUri)

      // Obtener la moneda MMC
      const mmc = data?.find((el) => (el.address === MMC_ADDRESS))

      if (!mmc) {
        console.error('Currency not found');
        return;
      }

      const amount = Amount.erc20(mmc, movieMetadata.price);

      console.log(amount)

      const calldata = encodeData(
        [{ name: 'tipReceiver', type: 'address' }],
        [sessionData?.profile.ownedBy.address], // Address of tip receiver
      );

      // Crear el post en Lens con el Collect Action Module
      const result = await createPost({
        metadata: metadataUri,
        actions: [
          {
            type: OpenActionType.SIMPLE_COLLECT,
            amount,
            recipient: sessionData?.profile?.ownedBy.address,
            followerOnly: false,
            referralFee: 0,
          },
          {
            type: OpenActionType.UNKNOWN_OPEN_ACTION,
            address: TIP_ACTION_MODULE_ADDRESS,
            data: calldata,
          },
        ],
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

  const createTipModuleMetadata = () => {
    return module({
      name: 'TipActionModule',
      title: 'Tip Action Module',
      description: 'This module allows users to tip the author of a publication.',
      authors: ['martijn.vanhalen@gmail.com'],
      initializeCalldataABI: `${JSON.stringify([
        {
          "type": "address",
          "name": "tipReceiver"
        }
      ])}`,
      processCalldataABI: `${JSON.stringify([
        {
          "type": "address",
          "name": "currency"
        },
        {
          "type": "uint256",
          "name": "tipAmount"
        }
      ])}`,
      $schema: ModuleSchemaId.LATEST
    } as ModuleOptions);
  };

  const createAndUploadTipModuleMetadata = async () => {
    try {
      const metadata = createTipModuleMetadata();
      const metadataUri = await uploadToPinata(metadata);
      console.log(metadata);
      console.log('Module Metadata CID:', metadataUri);
    } catch (error) {
      console.error('Error uploading metadata:', error);
    }
  };

  useEffect(() => {
    // createAndUploadTipModuleMetadata();
  }, []);

  if (loading) return <LoadingScreen />

  return (
    <>
      <Helmet>
        <title> WatchIt | Studio</title>
      </Helmet>

      {/*<BlankView>*/}
      {/*  <ComingSoonView />*/}
      {/*</BlankView>*/}

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
            Ingresar Hash de IPFS
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
