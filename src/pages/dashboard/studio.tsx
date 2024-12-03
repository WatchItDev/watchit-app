import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {
  ProfileSession,
  useCreatePost,
  useSession,
} from '@lens-protocol/react-web';
import { AnyMedia, MediaVideoMimeType, video } from '@lens-protocol/metadata';
// Eliminamos la importación de axios
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

// Arreglo de hashes
const hashes = [
  "bafkreiesxbax5sxsqbzsr75zopvjlk5rjcm2lnxwqae4l4c5epyanba2my",
  "bafkreih7asm7tnupnc3p7taxnjtfsprhkhx5p33nc2c4ugwu4yehlbq4bu",
  "bafkreies5vqdjoaegtp4yrh2zd2c2uhwu2vgqrhsvz6oqbfuev6qyiaczu",
  "bafkreiermwit7b5trwwsdcsprhvp3b4ikfjsfq7h635g4566yw4wpdc7lu",
  "bafkreiad6vo5ghbkvzhukybeoki6uzec7hdfcmwd65qu5r7e6csf6mpcfm",
  "bafkreiftoharz7dpsh5ardszoglaif67tbgrzd4ykm4y4q6rofxx5nzv5i",
  "bafkreigzbh6jpuia4bb4wdtmxyzgpdxggko4tgdcvk4ktmuxzthosdvrj4",
  "bafkreig34diqjcxjibnhmlp74cq23sctmaqrvqdfoipvbwzsl6tniuqgui",
  "bafkreicazpmltnhhkwe2p2p3ywmdn26eb4czo52p25qsxn4h5vmh3zcyju",
  "bafkreiatfredpvdqvnv24msps52xbssifjvelt2dybi7v6nkwoy54u4vrq",
  "bafkreiciiru57p2ptdnrztgcb4s7l2pa35fnhejo6nfnlgt7xe2crhnrci",
  "bafkreihetlx6dvbaf3yrhpvybeudmzo7nbrrbo3enagqbpqcfo5mvos7ie",
  "bafkreid5ftscepbia6j2art35z3ektnaamfvegivhxtxk35zthqfz6b3tq",
  "bafkreicbj5abwrstd7xdhsatjf2rq5kxigsabiyviv3j23km5jsili2jju",
  "bafkreibyv5ebjv2ajf2iv62pons4esk7djakex7blzuzhlspcbwcizwjoe",
  "bafkreihnns6ebss6hlgemfngsabbswp2pfldidz4u2skkaodoprj47c6gq",
  "bafkreibwx22vntonu6nuva53ccpllxh7q2gljf42p7jxukhi5okfnyb7he",
  "bafkreifysr6rm3hgdpe7wpzlgw6bz6ek6a2gj2pi5fprjb5pkd5cd7735m",
  "bafkreie5bkcphe2cbbqpsz6rbtliptxicvgomdcryguddeucaryffgq7xu",
  "bafkreicskbwqfmir5iqys2uf4b52r5wxff6cg6bqwxscro6wcezqe7vvsa",
  "bafkreif37obiy72fqdgvae7pqxyadwszrycnl4e2vkl22qcfn45qzncer4",
  "bafkreib7svi2bfoyp5q6o4vuigylf4us3j5izpo36a3nkwo3xvp6qxvfty",
  "bafkreiht36qng56d2wduzl2xwhftemx5y2dwzk4uurrats4lwyejall6tq",
  "bafkreickpzp5k7qhvq43vdrxasulds36zfu4ucyzousky7ubfnuylobtee",
  "bafkreifsazg77adyznouusxskf3si3celhlovjrozsa2fkm3xysue24ftq",
  "bafkreieq5bcjqr4mx6zilrzfyq356gpvkjlgm3jivximdsw2knbqhz56uq",
  "bafkreiet4j4fbxql4e7fr5pnlrdxmpkjz5xozyxvo35y3xqhn5rrl3lmby",
  "bafkreiad3bjehkqjizbt3auu7uyziwbpedyuhsogybqttqj6ibvklneofy",
  "bafkreia5jpogoioftbhzyza7gihwye4fsgdhkjxgwa3wegqzxqhs3tp7la"
];

const uploadToPinata = async (metadata: any) => {
  const pinataApiKey = '26e37a596e8e561427af';
  const pinataSecretApiKey = '9d9469c678bb8db458851c5342f9201ab4811c29f281f7d8205a6a18cf302566';

  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataSecretApiKey,
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    throw new Error(`Error uploading to Pinata: ${response.statusText}`);
  }

  const data = await response.json();

  return `ipfs://${data.IpfsHash}`;
};

const sanitizeDescription = (description: any): string => {
  if (typeof description !== 'string') {
    return description;
  }

  let sanitized = description.replace(/"/g, "'");

  sanitized = sanitized.replace(/\\/g, '');

  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  // sanitized = sanitized.replace(/[^a-zA-Z0-9 .,;:!?'"-]/g, '');

  return sanitized;
}

// ----------------------------------------------------------------------

export default function OverviewFilePage() {
  const [open, setOpen] = useState(false);
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { execute: createPost } = useCreatePost();

  const handleSubmitAll = async () => {
    try {
      if (!sessionData?.authenticated) {
        console.error('No active profile found');
        return;
      }

      for (const asset of hashes) {
        try {
          const response = await fetch(`https://g.watchit.movie/metadata/${asset}/`);

          if (!response.ok) {
            console.error(`Error fetching metadata for asset ${asset}: ${response.statusText}`);
            continue;
          }

          const data = await response.json();
          const title = data.Meta.title;
          const descriptionRaw = data.Meta.description;
          const description = sanitizeDescription(descriptionRaw);

          let wallpaperCid = '';
          let largeCid = '';

          for (const attachment of data.Attachment) {
            if (attachment.title === 'wallpaper') {
              wallpaperCid = attachment.cid;
            } else if (attachment.title === 'large') {
              largeCid = attachment.cid;
            }
          }

          if (!wallpaperCid || !largeCid) {
            console.error(`No se encontraron los cids de wallpaper o large para el hash ${asset}`);
            continue;
          }

          const getMediaUri = (cid: string): string => `https://g.watchit.movie/fetch/${cid}/`;

          const mediaItems: AnyMedia[] = [
            {
              item: getMediaUri(largeCid) as any,
              type: 'image/jpeg' as any,
              altTag: 'poster' as string,
            },
            {
              item: getMediaUri(wallpaperCid) as any,
              type: 'image/png' as any,
              altTag: 'wallpaper' as string,
            },
          ];

          const metadata = video({
            id: uuidv4(),
            title: title,
            content: description,
            video: {
              item: `${asset}`,
              type: MediaVideoMimeType.MP4,
              altTag: 'asset',
            },
            locale: 'en',
            attachments: mediaItems,
            appId: 'watchit',
          });

          // Subir los metadatos a Pinata
          const metadataUri = await uploadToPinata(metadata);

          // Crear el post en Lens
          const result = await createPost({
            metadata: metadataUri,
          });

          if (result.isFailure()) {
            console.error(`Error creating post for asset ${asset}:`, result.error);
          } else {
            const completion = await result.value.waitForCompletion();
            if (completion.isFailure()) {
              console.error(`Error waiting for completion for asset ${asset}:`, completion.error.message);
            } else {
              console.log(`Post for asset ${asset} created successfully`);
            }
          }
        } catch (error) {
          console.error(`Error processing asset ${asset}:`, error);
          // Continuar con el siguiente asset
        }
      }

      window.alert('All posts processed');
      handleClose();

    } catch (error) {
      console.error('Error in handleSubmitAll:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title> WatchIt | Studio</title>
      </Helmet>

      <Header>
        <HeaderContent title="Studio" />
      </Header>

      <Grid container spacing={2} style={{ height: 'calc(100vh - 5rem)', width: '100%', padding: '2rem 1.5rem 2rem 2rem' }}>
        <Grid item xs={8} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          <Grid container spacing={2} style={{ flexGrow: 1 }}>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem', borderRadius: '10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem', borderRadius: '10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem', borderRadius: '10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={6}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 31rem)', borderRadius: '10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={6}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 31rem)', borderRadius: '10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem', borderRadius: '10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem', borderRadius: '10px' }} variant="rectangular" width="100%" />
            </Grid>
            <Grid item xs={4}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem', borderRadius: '10px' }} variant="rectangular" width="100%" />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={2} style={{ flexGrow: 1 }}>
            <Grid item xs={12}>
              <Box sx={{ height: '9rem' }}>
                <Box sx={{ width: '100%', height: '100%', padding: '25px 15px', display: 'flex', flexDirection: 'column', borderRadius: '10px', background: 'black', justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Do you want other people to see your movies?
                  </Box>
                  <Box>
                    <Button
                      variant='contained' onClick={handleOpen}
                      sx={{ mt: 3, color: '#FFFFFF', background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)' }}
                    >
                      Upload Movie
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 14rem)', borderRadius: '10px' }} variant="rectangular" width="100%" />
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
            Upload movies
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSubmitAll}
          >
            Upload
          </Button>
        </Box>
      </Modal>
    </>
  );
}


// import { Helmet } from 'react-helmet-async';
// import { useState } from 'react';
// import {
//   ProfileSession,
//   useCreatePost,
//   useSession,
// } from '@lens-protocol/react-web';
// import { AnyMedia, MediaVideoMimeType, video } from '@lens-protocol/metadata';
// import axios from 'axios';
// import uuidv4 from '../../utils/uuidv4';
// import { Grid, Modal } from '@mui/material';
// import Skeleton from '@mui/material/Skeleton';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// // @ts-ignore
// import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
// import HeaderContent from '@src/layouts/dashboard/HeaderContent.tsx';
// import Header from '@src/layouts/dashboard/header.tsx';
//
// const publicationMetadata = {
//   title: "Nosferatu",
//   synopsis: "homas Hutter, working for an estate agency, is sent to Transylvania by his boss to visit a new client named Count Orlok who plans to buy a property. After entrusting his wife Ellen to his good pal, he embarks on his journey. During his journey amid the mountainous regions, he stops at an inn for dinner. The locals discourage Hutter from traveling to the Count's castle but Hutter proceeds his journey by taking a coach. Due to nightfall, the coachman declines to take him any further than the bridge. Hutter continues his journey alone and after crossing the bridge, a mysterious coach appears and a mysterious coachman gestures Hutter to climb aboard. After leaving Hutter outside the Count's castle, the coach goes away. Hutter is welcomed at the castle by Count Orlok",
//   asset: "bafkreih3d5mvezcyzzlp2qb7ezkh53vlmtjenfofjv3diafsl22xaowzcu",
//   media: [
//     {
//       item: "bafkreihj3xgnid6d6os3d2sihsircvttgc44thcgvyou4z2mpmrpumj5am",
//       type: "image/jpeg",
//       altTag: "poster"
//     },
//     {
//       item: "bafybeicj2bi3ozc6gwqok7m4v4pzhqp2wi6uhjkjugcj2clqxrwxaldgfe",
//       type: "image/jpeg",
//       altTag: "wallpaper"
//     },
//   ]
// };
//
// // Función para subir los metadatos a Pinata
// const uploadToPinata = async (metadata: any) => {
//   const pinataApiKey = '26e37a596e8e561427af'; // Reemplaza con tu clave de API
//   const pinataSecretApiKey = '9d9469c678bb8db458851c5342f9201ab4811c29f281f7d8205a6a18cf302566'; // Reemplaza con tu clave secreta de API
//
//   const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
//
//   const response = await axios.post(url, metadata, {
//     headers: {
//       pinata_api_key: pinataApiKey,
//       pinata_secret_api_key: pinataSecretApiKey,
//     },
//   });
//
//   return `ipfs://${response.data.IpfsHash}`;
// };
//
// // ----------------------------------------------------------------------
//
// export default function OverviewFilePage() {
//   // @ts-ignore eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [open, setOpen] = useState(false);
//   const { data: sessionData }: ReadResult<ProfileSession> = useSession();
//
//   // @ts-ignore eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//
//   const { execute: createPost } = useCreatePost();
//
//   const getMediaUri = (cid: string): string => `https://g.watchit.movie/fetch/${cid?.replace('ipfs://', '')}/`
//
//   // @ts-ignore eslint-disable-next-line @typescript-eslint/no-unused-vars
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const handleSubmit = async () => {
//     try {
//       if (!sessionData?.authenticated) {
//         console.error('No active profile found');
//         return;
//       }
//
//       console.log('submit')
//
//       console.log('attributes')
//
//       // Prepara los medios
//       const mediaItems: AnyMedia[] = publicationMetadata.media.map((mediaItem: any) => ({
//         item: getMediaUri(mediaItem.item) as any,
//         type: mediaItem.type as any,
//         altTag: mediaItem.altTag as string,
//       }));
//
//       console.log('media')
//
//       // Crear el objeto de metadatos usando el helper 'video'
//       const metadata = video({
//         id: uuidv4(),
//         title: publicationMetadata.title,
//         content: publicationMetadata.synopsis,
//         video: {
//           item: publicationMetadata.asset,
//           type: MediaVideoMimeType.MP4,
//           altTag: "asset"
//         },
//         locale: 'en',
//         attachments: mediaItems,
//         appId: 'watchit',
//       });
//
//       console.log('last media')
//       console.log(metadata)
//       console.log(mediaItems)
//       console.log(mediaItems[mediaItems.length - 1])
//       console.log('metadata')
//
//       // Subir los metadatos a Pinata
//       const metadataUri = await uploadToPinata(metadata);
//
//       console.log('metadata cid')
//       console.log(metadataUri)
//
//       // Crear el post en Lens con el Collect Action Module
//       const result = await createPost({
//         metadata: metadataUri
//       });
//
//       console.log('result')
//
//       if (result.isFailure()) {
//         console.error('Error creating post', result.error);
//       } else {
//         const completion = await result.value.waitForCompletion();
//         if (completion.isFailure()) {
//           window.alert(completion.error.message);
//         } else {
//           window.alert('Post created successfully');
//         }
//
//         handleClose(); // Cierra el modal
//       }
//     } catch (error) {
//       console.error('Error submitting to Lens:', error);
//     }
//   };
//
//   return (
//     <>
//       <Helmet>
//         <title> WatchIt | Studio</title>
//       </Helmet>
//
//       <Header>
//         <HeaderContent title="Studio" />
//       </Header>
//
//       <Grid container spacing={2} style={{ height: 'calc(100vh - 5rem)', width: '100%', padding: '2rem 1.5rem 2rem 2rem' }}>
//         <Grid item xs={8} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
//           <Grid container spacing={2} style={{ flexGrow: 1 }}>
//             <Grid item xs={4}>
//               <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
//             </Grid>
//             <Grid item xs={4}>
//               <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
//             </Grid>
//             <Grid item xs={4}>
//               <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
//             </Grid>
//             <Grid item xs={6}>
//               <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 31rem)',borderRadius:'10px' }} variant="rectangular" width="100%" />
//             </Grid>
//             <Grid item xs={6}>
//               <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 31rem)',borderRadius:'10px' }} variant="rectangular" width="100%" />
//             </Grid>
//             <Grid item xs={4}>
//               <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
//             </Grid>
//             <Grid item xs={4}>
//               <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
//             </Grid>
//             <Grid item xs={4}>
//               <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem',borderRadius:'10px' }} variant="rectangular" width="100%" />
//             </Grid>
//           </Grid>
//         </Grid>
//
//         <Grid item xs={4} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//           <Grid container spacing={2} style={{ flexGrow: 1 }}>
//             <Grid item xs={12}>
//               <Box sx={{ height: '9rem' }}>
//                 <Box sx={{width:'100%',height:'100%',padding:'25px 15px',display:'flex',flexDirection:'column',borderRadius:'10px',background:'black',justifyContent:'center',alignItems:'center'}}>
//                   <Box sx={{textAlign:'center',fontWeight:'bold'}}>
//                     Do you want other people to see your movies?
//                   </Box>
//                   <Box>
//                     <Button
//                       variant='contained' onClick={handleOpen}
//                       sx={{ mt: 3 , color:'#FFFFFF',background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)' }}
//                     >
//                       Upload Movie
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>
//             </Grid>
//             <Grid item xs={12}>
//               <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 14rem)',borderRadius:'10px' }} variant="rectangular" width="100%" />
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//
//       <Modal open={open} onClose={handleClose}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: 400,
//             bgcolor: '#2B2D31',
//             borderRadius: '10px',
//             boxShadow: 24,
//             p: 4,
//           }}
//         >
//           <Typography
//             variant="h6"
//             component="h2"
//             sx={{ mb: 2, color: '#fff' }}
//           >
//             Upload hardcoded movie
//           </Typography>
//           <Button
//             variant="contained"
//             sx={{ mt: 3 }}
//             onClick={handleSubmit}
//           >
//             Upload
//           </Button>
//         </Box>
//       </Modal>
//     </>
//   );
// }
