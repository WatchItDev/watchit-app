import { Helmet } from 'react-helmet-async';
// import { useState } from 'react';
// import {
//   ProfileSession,
//   useCreatePost,
//   useSession,
// } from '@lens-protocol/react-web';
// import { AnyMedia, MediaVideoMimeType, video } from '@lens-protocol/metadata';
// import uuidv4 from '../../utils/uuidv4';
// import { Grid, Modal } from '@mui/material';
// import Skeleton from '@mui/material/Skeleton';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// @ts-ignore
// import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
// import HeaderContent from '@src/layouts/dashboard/HeaderContent.tsx';
// import Header from '@src/layouts/dashboard/header.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
// import { verifyIpfsData } from '@src/utils/ipfs.ts';
import ComingSoonView from '@src/sections/coming-soon/view.tsx';
import BlankView from '@src/sections/blank/view.tsx';

// const hashes = [
//   "f015512202a1ffe6fa1e52d3f03e6b09b0d105f7c201c80fee05d90455b08f57906183303",
//   "f015512203dafa4a9d9ae0d0e16bee89b8230c8fe1f91db67919c7326a6c5c0976c4f246b",
//   "f01551220c696444d71d75a46b400a3198dc16351bb4a7ff11e75384b188e900eb31b8ef8",
//   "f015512208e25ef42185e1d11ee48e911289159308038ed97fd218fd90a671deff6670880",
//   "f015512208eea74c04c38a6f6609bf53f7ac5bc8c24bdebb46d406a6a5d8612e493e94af0",
//   "f01551220f58606f61cf1271f6ded236d2cb20911b00a6bebbc2a18ff3fada00e4e0f9e32",
//   "f015512203aad73512150ea88fdd31781b3f7a04640b45d5645ccfdb37fec761e3199d2e9",
//   "f01551220efd87dbaec40d324f3224b9fe4e1238fbb1b831fa653265022fd24a8635112b7",
//   "f01551220d363966908be72199afae5855f60886e05701e7cdb59b087dadc344c88ec334c",
//   "f01551220cb5fa178f7c0bd2e5f0a480b081e4e9cc3d154a1c253c2415ce87a2221d782b0",
//   "f015512208411500f9966a1bdabeb0dc034ab493b615dada9df3bbfd75c43e4114db3f4fc",
//   "f0155122082cad5ed4141911433832f6306c23f5d34b59aaac750d9632c9ed0ecb41f5d92",
//   "f01551220d0ef33bc6cf62908148e80607996277095e9dc61e582c76ebc88339f515cd118",
//   "f01551220ebab866f0886fc9513630dc39589a33d76b631d982431c357084431b06cf8675",
//   "f0155122095a72df6619e5a417bfd9e67dcb3c7252ed3067a50fdc84fcb398ceebf59ecaa",
//   "f0155122082c55e91518dd9cac1c635b339461594680ba464832098202d0136becf11c537",
//   "f01551220736147635725d09c284b23705c30b2bb56fe0c500e15c004d5e311e7bd5e5ce7",
//   "f0155122014381ea629eb63cc449f824794e2731f460f75ca0fc03220b18baa5c88f3af12",
//   "f015512201eeb60f6098f368c42fe704dda57c2e13fdf47f073a8044141c46cae1d5ad421",
//   "f015512200de6a10a2afcbd70decbbdae5a71f3366e5e948aeea7e5e1de40f8585b617c91",
//   "f0155122011b528f47f290f0ad5362e4f65c218df5032b63b2fb6c315bc6fbbe82475d35d",
//   "f01551220b87d8e2a295e0c8af52f6929df9383ac7975065ea50f888588f36a0c15f7e1ab",
//   "f0155122054ab3a06dd0ca492ee406dd21ede25bc07fc451776817ddee81c8a5ea1bdce98",
//   "f015512208a2655867c98f8e73ca5175b1d47cc09be207045e272f497acf06838a38da029",
//   "f01551220d5eb396a1f8d8b08f58b3c627898b281f31fe6ca01588b89c4d21e44944d28a9",
//   "f01551220a71984d851e7fa636d4556a3fc1616fa1afaab1d3489da65d0b97b07ddbd9675",
//   "f01551220a9dfd94e5e27f802855f95f10eb1ed9740c12a00699e1ef09282610d60d4efc2",
//   "f015512207e3202607b69133f1625156ae09b1f245d61150c95cf40f11ce7c0b9d48f2d4c",
//   "f01551220c926bd7fd89b757258649d0b66266ce74839fba505ea93c424be83b04f20bd2f",
//   "f01551220a718cc1dbfc2c53120d5ee4cbe9b8068d5da7177b8f7e7780b583ffc100eeeee",
//   "f015512208d0f2af9b8de2a7600cccc4242dc75ad0dd022f67ad8d41442a1d2e9bd678c18",
//   "f0155122049baef9705bdaf6b337e22d4e80b4b6bcecf6ed0ae032d185998ee05fb9c1be7",
//   "f015512208f22205a57b9d6c5b6b66ba352d5e4ca1b4dcf0d6f1bc6f4a55c113641758295",
//   "f0155122009b7c97d74554671f2a0b122776f612765fff152abc83a85c8ab75f9d9657ecd",
//   "f01551220879745f7c08618e4ab05cb612963ba9365f721f521ea6e7607ea8b6a29984da0"
// ];

// const uploadToPinata = async (metadata: any) => {
//   const pinataApiKey = GLOBAL_CONSTANTS.PINATA_API_KEY;
//   const pinataSecretApiKey = GLOBAL_CONSTANTS.PINATA_SECRET_API_KEY;
//
//   const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
//
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'pinata_api_key': pinataApiKey,
//       'pinata_secret_api_key': pinataSecretApiKey,
//     },
//     body: JSON.stringify(metadata),
//   });
//
//   if (!response.ok) {
//     throw new Error(`Error uploading to Pinata: ${response.statusText}`);
//   }
//
//   const data = await response.json();
//
//   return `ipfs://${data.IpfsHash}`;
// };
//
// const sanitizeDescription = (description: any): string => {
//   if (typeof description !== 'string') {
//     return description;
//   }
//
//   let sanitized = description.replace(/"/g, "'");
//
//   sanitized = sanitized.replace(/\\/g, '');
//
//   sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
//
//   // sanitized = sanitized.replace(/[^a-zA-Z0-9 .,;:!?'"-]/g, '');
//
//   return sanitized;
// }

// ----------------------------------------------------------------------

export default function OverviewFilePage() {
  // const [open, setOpen] = useState(false);
  // const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  //
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  //
  // const { execute: createPost } = useCreatePost();
  //
  // const handleSubmitAll = async () => {
  //   try {
  //     if (!sessionData?.authenticated) {
  //       console.error('No active profile found');
  //       return;
  //     }
  //
  //     for (const asset of hashes) {
  //       try {
  //         const response = await fetch(`https://g.watchit.movie/metadata/${asset}/`);
  //
  //         if (!response.ok) {
  //           console.error(`Error fetching metadata for asset ${asset}: ${response.statusText}`);
  //           continue;
  //         }
  //
  //         const data = await response.json();
  //         const title = data.Meta.title;
  //         const descriptionRaw = data.Meta.description;
  //         const description = sanitizeDescription(descriptionRaw);
  //
  //         let wallpaperCid = '';
  //         let largeCid = '';
  //
  //         for (const attachment of data.Attachment) {
  //           if (attachment.title === 'wallpaper') {
  //             wallpaperCid = attachment.cid;
  //           } else if (attachment.title === 'large') {
  //             largeCid = attachment.cid;
  //           }
  //         }
  //
  //         if (!wallpaperCid || !largeCid) {
  //           console.error(`Poster or wallpaper not found ${asset}`);
  //           continue;
  //         }
  //
  //         const getMediaUri = (cid: string): string => `https://g.watchit.movie/content/${cid}/`;
  //
  //         const mediaItems: AnyMedia[] = [
  //           {
  //             item: getMediaUri(largeCid) as any,
  //             type: 'image/jpeg' as any,
  //             altTag: 'poster' as string,
  //           },
  //           {
  //             item: getMediaUri(wallpaperCid) as any,
  //             type: 'image/png' as any,
  //             altTag: 'wallpaper' as string,
  //           },
  //         ];
  //
  //         const metadata = video({
  //           id: uuidv4(),
  //           title: title,
  //           content: description,
  //           video: {
  //             item: `${asset}`,
  //             type: MediaVideoMimeType.MP4,
  //             altTag: 'asset',
  //           },
  //           locale: 'en',
  //           attachments: mediaItems,
  //           appId: 'watchit',
  //         });
  //
  //         // Subir los metadatos a Pinata
  //         const metadataUri = await uploadToPinata(metadata);
  //
  //         // Verify availability of metadata on IPFS
  //         await verifyIpfsData(metadataUri);
  //
  //         // Crear el post en Lens
  //         const result = await createPost({
  //           metadata: metadataUri,
  //         });
  //
  //         if (result.isFailure()) {
  //           console.error(`Error creating post for asset ${asset}:`, result.error);
  //         } else {
  //           const completion = await result.value.waitForCompletion();
  //           if (completion.isFailure()) {
  //             console.error(`Error waiting for completion for asset ${asset}:`, completion.error.message);
  //           } else {
  //             console.log(`Post for asset ${asset} created successfully`);
  //           }
  //         }
  //       } catch (error) {
  //         console.error(`Error processing asset ${asset}:`, error);
  //         // Continue with next asset
  //       }
  //     }
  //
  //     window.alert('All posts processed');
  //     handleClose();
  //
  //   } catch (error) {
  //     console.error('Error in handleSubmitAll:', error);
  //   }
  // };

  return (
    <>
      <Helmet>
        <title> WatchIt | Studio</title>
      </Helmet>

      <BlankView>
        <ComingSoonView
          deadline={'03/30/2025 21:30'}
          showDeadline={true}
          content={
            "The Studio is evolving! Soon, you'll generate new content and enhance your creations with AI-driven tools for metadata, images, subtitles, voiceovers, and security checks. Stay tuned!"
          }
        />
      </BlankView>

      {/*<Header>*/}
      {/*  <HeaderContent title="Studio" />*/}
      {/*</Header>*/}

      {/*<Grid container spacing={2} style={{ height: 'calc(100vh - 5rem)', width: '100%', padding: '2rem 1.5rem 2rem 2rem' }}>*/}
      {/*  <Grid item xs={8} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>*/}
      {/*    <Grid container spacing={2} style={{ flexGrow: 1 }}>*/}
      {/*      <Grid item xs={4}>*/}
      {/*        <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem', borderRadius: '10px' }} variant="rectangular" width="100%" />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={4}>*/}
      {/*        <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem', borderRadius: '10px' }} variant="rectangular" width="100%" />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={4}>*/}
      {/*        <Skeleton sx={{ bgcolor: '#2B2D31', height: '9rem', borderRadius: '10px' }} variant="rectangular" width="100%" />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={6}>*/}
      {/*        <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 31rem)', borderRadius: '10px' }} variant="rectangular" width="100%" />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={6}>*/}
      {/*        <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 31rem)', borderRadius: '10px' }} variant="rectangular" width="100%" />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={4}>*/}
      {/*        <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem', borderRadius: '10px' }} variant="rectangular" width="100%" />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={4}>*/}
      {/*        <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem', borderRadius: '10px' }} variant="rectangular" width="100%" />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={4}>*/}
      {/*        <Skeleton sx={{ bgcolor: '#2B2D31', height: '16rem', borderRadius: '10px' }} variant="rectangular" width="100%" />*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}

      {/*  <Grid item xs={4} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>*/}
      {/*    <Grid container spacing={2} style={{ flexGrow: 1 }}>*/}
      {/*      <Grid item xs={12}>*/}
      {/*        <Box sx={{ height: '9rem' }}>*/}
      {/*          <Box sx={{ width: '100%', height: '100%', padding: '25px 15px', display: 'flex', flexDirection: 'column', borderRadius: '10px', background: 'black', justifyContent: 'center', alignItems: 'center' }}>*/}
      {/*            <Box sx={{ textAlign: 'center', fontWeight: 'bold' }}>*/}
      {/*              Do you want other people to see your movies?*/}
      {/*            </Box>*/}
      {/*            <Box>*/}
      {/*              <Button*/}
      {/*                variant='contained' onClick={handleOpen}*/}
      {/*                sx={{ mt: 3, color: '#FFFFFF', background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)' }}*/}
      {/*              >*/}
      {/*                Upload Movie*/}
      {/*              </Button>*/}
      {/*            </Box>*/}
      {/*          </Box>*/}
      {/*        </Box>*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12}>*/}
      {/*        <Skeleton sx={{ bgcolor: '#2B2D31', height: 'calc(100vh - 14rem)', borderRadius: '10px' }} variant="rectangular" width="100%" />*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*</Grid>*/}

      {/*<Modal open={open} onClose={handleClose}>*/}
      {/*  <Box*/}
      {/*    sx={{*/}
      {/*      position: 'absolute',*/}
      {/*      top: '50%',*/}
      {/*      left: '50%',*/}
      {/*      transform: 'translate(-50%, -50%)',*/}
      {/*      width: 400,*/}
      {/*      bgcolor: '#2B2D31',*/}
      {/*      borderRadius: '10px',*/}
      {/*      boxShadow: 24,*/}
      {/*      p: 4,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Typography*/}
      {/*      variant="h6"*/}
      {/*      component="h2"*/}
      {/*      sx={{ mb: 2, color: '#fff' }}*/}
      {/*    >*/}
      {/*      Upload movies*/}
      {/*    </Typography>*/}
      {/*    <Button*/}
      {/*      variant="contained"*/}
      {/*      sx={{ mt: 3 }}*/}
      {/*      onClick={handleSubmitAll}*/}
      {/*    >*/}
      {/*      Upload*/}
      {/*    </Button>*/}
      {/*  </Box>*/}
      {/*</Modal>*/}
    </>
  );
}
