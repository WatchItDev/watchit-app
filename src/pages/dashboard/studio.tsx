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
// // @ts-ignore
// import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
// import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
// import Header from '@src/layouts/dashboard/header.tsx';
// import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
// import { verifyIpfsData } from '@src/utils/ipfs.ts';
import ComingSoonView from '@src/sections/coming-soon/view.tsx';
import BlankView from '@src/sections/blank/view.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// const hashes = [
//   "f0155122018174e2a7079e266bab70f870249dfa50de77bfcd1263a29a7290c9bedad1ba8",
//   "f01551220b56b4833e0d9329c7d537638d2637edb708fef507f38b4655e29809d87e1995b",
//   "f0155122015d682b28898978fa6dd47eb7a9a2cd2d78a30e7a0acbf571e8168c360cb0b92",
//   "f015512207a2907ea5c70af2c9ff9b052cb5daefc0e11b665282a16fc2db5dede02a79f6e",
//   "f015512201e8464aa98c40972dc425a83fc195f540990cf76aef52b2904fb168265270e6d",
//   "f015512208af124036cdaefe4f35b21a711ea7cf0e6c09c55fa3efd675e52a422315510ef",
//   "f015512206dbd9148b1c159ee683ce8cf2c962a5ddcb6ab7277fe78be19e955fcd0d2f9c2",
//   "f01551220b67f42a603570d5d0561c3322ceb5d71e5103fcdae7534c5d483de9a46865d87",
//   "f015512207e2c2d391dc615b91c5c690bfc4d541bd8a35faedc382b53c9d4de1e067d2c15",
//   "f015512204bcb7b84da07b7a2b8166bf1102fe4555d819364c0d08cf482b56332b762c4e2",
//   "f01551220c6fefd7d77ac2685c1115cac5382546df6f123bcf2bda59180a7950dbffc1bf1",
//   "f01551220fde28e80c0f19ff9a6427bf73018c110894f5e51de3bc9cf1839c3fd7c9489b0",
//   "f015512200f140406ed582d0582026849656f2703b4494343a18389d73558017df86127a7",
//   "f0155122059dddd205ec73c90510eb0d75d40e14cd9cfed565a43cf6f2051aef24cdc006b",
//   "f01551220c69efd3f75aca1fc69797aea1010a7561df899e7d7ad607623b5b0fa5ac0b67a",
//   "f0155122099b26b58e4124649fdf7f9c3148ea3b269b5d0ebb296f313cbed60d69f6115af",
//   "f015512209104b331db20592e00e26d5cb52f6462ee3a091fea64552d0593ee556f15f243",
//   "f015512208238a1f461b478242306bd7ca8015d2b3f54855a29cfb77d0b2f435a8a64f9c1",
//   "f0155122036875f8a3877274020ba1128e7a985fec35d10c9bf7e4cdf4c83cc0fcf2bcc57",
//   "f01551220afff57d83b228ff9f20b8038a42735112ea2850f7982991b8e086293293edcf0",
//   "f01551220bd11ec24ead942df0c75d22dbf84ea64ef1fabccb766dc504b1496c72652443a",
//   "f015512207ab25a1ada816dad9e239ce24a220047e8e1f4b8e093214db1708a0b042d938b",
//   "f01551220619d0e2cfc668425f384659a77352aff3944fac9744a3dff08de666107ba0306",
//   "f015512206811b048daec7a3aee71ceb640bc7cd999545b3909fa88abb3a3ea40a5f7c3f0",
//   "f01551220043c25888364b2b97b0ce5d93023a3713ae398618b575313d539bee6a11f0f23",
//   "f015512207fa97606410713211db6c80a044b0516725106b2c88292af1c246d5c7d53ce53",
//   "f0155122076a473da4d5ed2d3d37603c64f19b9c31804fa49ddc2967f92f2cf8ab96e99bc",
//   "f015512207243aa6579e5ee80b3b0f8c5d6a816bf0cd1200b8c1b5a106dd2801f4959d5ce",
//   "f0155122055ddb2cfd1f7f7c4679edcb65dc183a5e01adcdedc4f1e298f3bd95295b91338",
//   "f015512207f6735ccc96c7392f59ec5bc7dee9ea9fe71b22200ca88cefa34b5aa99466bbe",
//   "f01551220ea95ac3fcf67acb02ce24506a87a3c732d8dea7877ac98d5b51cdf4ea2fed69c",
//   "f01551220a366105090038403a32ad4deb53c11efde198f8e7dea8bbee00201af9f415eb1",
//   "f01551220f4b60ff0941575eb060e6c01c2933e81a9f57cb7c90eba24adb54bf9035f455e",
//   "f01551220e9e1c879d970aa8f8e5d3c499117b488111eb0fae360e2cfe29740dd9e6055a8",
//   "f0155122029806b42c1e6d2bed0b5a87d9b53ced5067f08719e5584f339389c955a816170"
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
    <OgMetaTags
      title="Watchit: Studio (COMING SOON)"
      description="Explore our evolving Studio! Soon, you’ll generate fresh content and enhance your projects with AI-driven metadata, images, subtitles, voiceovers, and security checks."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/studio/`}
    >
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
    </OgMetaTags>
  );
}
