// import { Skeleton, Grid, Box, Button, Modal } from '@mui/material';
// import { Helmet } from 'react-helmet-async';
// import { useState } from 'react';
// import { useCreatePost } from '@lens-protocol/react-web';
// import { video, MetadataAttributeType, AnyMedia } from '@lens-protocol/metadata';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import { useAuth } from '../../hooks/use-auth';
// import uuidv4 from '../../utils/uuidv4';
//
// // Objeto hardcoded con los datos
// const hardcodedMetadata = {
//   genres: ['Action', 'Adventure'],
//   releaseDate: '2024-09-15',
//   duration: '120 min',
//   language: 'English',
//   country: 'USA',
//   rating: 'PG-13',
//   format: 'HD',
//   studioName: 'Studio XYZ',
//   budget: '$150 million',
//   director: 'John Doe',
//   writer: 'Jane Smith',
//   producers: ['Producer A', 'Producer B'],
//   editor: 'Editor C',
//   creators: ['Creator 1', 'Creator 2'],
//   media: [
//     { item: 'Qm12345', type: 'video/mp4', altTag: 'Movie Poster' },
//     { item: 'Qm67890', type: 'video/mp4', altTag: 'Trailer' }
//   ],
//   title: 'Amazing Movie',
//   synopsis: 'An exciting adventure of heroes and villains.'
// };
//
// // ----------------------------------------------------------------------
//
// export default function OverviewFilePage() {
//   const [open, setOpen] = useState(false);
//   const { selectedProfile: activeProfile } = useAuth(); // Obtener el perfil activo
//
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//
//   const { execute: createPost } = useCreatePost();
//
//   const handleSubmit = async () => {
//     try {
//       if (!activeProfile) {
//         console.error('No active profile found');
//         return;
//       }
//
//       console.log('submit');
//       console.log(hardcodedMetadata);
//
//       // Prepara los atributos
//       const attributes = [
//         { traitType: 'Genres', value: hardcodedMetadata.genres.join(', ') },
//         { traitType: 'Release Date', value: hardcodedMetadata.releaseDate },
//         { traitType: 'Duration', value: hardcodedMetadata.duration },
//         { traitType: 'Language', value: hardcodedMetadata.language },
//         { traitType: 'Country', value: hardcodedMetadata.country },
//         { traitType: 'Rating', value: hardcodedMetadata.rating },
//         { traitType: 'Format', value: hardcodedMetadata.format },
//         { traitType: 'Studio Name', value: hardcodedMetadata.studioName },
//         { traitType: 'Budget', value: hardcodedMetadata.budget },
//         { traitType: 'Director', value: hardcodedMetadata.director },
//         { traitType: 'Writer', value: hardcodedMetadata.writer },
//         { traitType: 'Producers', value: hardcodedMetadata.producers.join(', ') },
//         { traitType: 'Editor', value: hardcodedMetadata.editor },
//         { traitType: 'Creators', value: hardcodedMetadata.creators.join(', ') },
//       ];
//
//       console.log('attributes');
//       console.log(attributes);
//
//       // Prepara los medios
//       const mediaItems: AnyMedia[] = hardcodedMetadata.media.map((mediaItem: any) => ({
//         item: `ipfs://${mediaItem.item}` as any,
//         type: mediaItem.type as any,
//         altTag: mediaItem.altTag as any,
//       }));
//
//       console.log('media');
//       console.log(mediaItems);
//
//       // Crear el objeto de metadatos usando el helper 'video'
//       const metadata = video({
//         id: uuidv4(),
//         title: hardcodedMetadata.title,
//         content: hardcodedMetadata.synopsis,
//         video: mediaItems[mediaItems.length - 2] as any,
//         locale: 'en',
//         attributes: attributes.map((attr) => ({
//           type: MetadataAttributeType.STRING,
//           key: attr.traitType,
//           value: attr.value,
//         })),
//         attachments: mediaItems,
//         appId: 'watchit',
//       });
//
//       console.log('metadata');
//       console.log(metadata);
//
//       // Simulación de convertir metadata a string, ya que no estamos subiendo a IPFS
//       const metadataUri = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
//
//       console.log('metadata string');
//       console.log(metadataUri);
//
//       // Crear el post en Lens
//       const result = await createPost({
//         metadata: metadataUri, // Se pasa como string el URI simulado
//         sponsored: false,
//       });
//
//       console.log('result');
//       console.log(result);
//
//       if (result.isFailure()) {
//         console.error('Error creating post', result.error);
//       } else {
//         console.log('Post created successfully:', result.value);
//
//         const awaiter = await result?.value?.waitForCompletion();
//
//         console.log('awaiter');
//         console.log(awaiter);
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
//         <title> Dashboard: File</title>
//       </Helmet>
//
//       <Grid container spacing={2} style={{ height: 'calc(100vh - 5rem)', width: '100%', padding: '2rem 1.5rem 2rem 2rem' }}>
//         {/* Contenido del dashboard */}
//         <Grid item xs={4}>
//           <Box sx={{ textAlign: 'center', fontWeight: 'bold' }}>
//             Do you want other people to see your movies?
//           </Box>
//           <Button
//             variant='contained' onClick={handleOpen}
//             sx={{ mt: 3, color: '#FFFFFF', background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)' }}
//           >
//             Upload Movie
//           </Button>
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
//           <Typography variant="h6" component="h2" sx={{ mb: 2, color: '#fff' }}>
//             Hardcoded Metadata
//           </Typography>
//           <Button
//             variant="contained"
//             sx={{ mt: 3 }}
//             onClick={handleSubmit}
//           >
//             Submit
//           </Button>
//         </Box>
//       </Modal>
//     </>
//   );
// }


import { Skeleton, Grid, Box, Button, Modal } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useCreatePost } from '@lens-protocol/react-web';
import { video, MetadataAttributeType, AnyMedia } from '@lens-protocol/metadata';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { create } from 'ipfs-http-client';
import { useAuth } from '../../hooks/use-auth';
import uuidv4 from '../../utils/uuidv4';

// Configuración del cliente IPFS
const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });

// Función para subir los metadatos a IPFS
const uploadToIpfs = async (metadata: any) => {
  const { cid } = await ipfs.add(JSON.stringify(metadata));
  return `ipfs://${cid}`;
};

// Función para obtener datos desde IPFS usando el hash
const fetchFromIpfs = async (hash: string) => {
  const response = await fetch(`http://localhost:8080/ipfs/${hash}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

// ----------------------------------------------------------------------

export default function OverviewFilePage() {
  const [open, setOpen] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');
  const { selectedProfile: activeProfile } = useAuth(); // Obtener el perfil activo

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { execute: createPost } = useCreatePost();

  const handleSubmit = async () => {
    try {
      if (!activeProfile) {
        console.error('No active profile found');
        return;
      }

      console.log('submit')
      console.log(ipfsHash)

      // Paso 1: Obtener los metadatos desde IPFS usando el hash proporcionado
      const metadataInput = await fetchFromIpfs(ipfsHash);

      console.log('ipfs content')
      console.log(metadataInput)

      // Prepara los atributos
      const attributes = [
        { traitType: 'Genres', value: metadataInput.genres.join(', ') },
        { traitType: 'Release Date', value: metadataInput.releaseDate },
        { traitType: 'Duration', value: metadataInput.duration },
        { traitType: 'Language', value: metadataInput.language },
        { traitType: 'Country', value: metadataInput.country },
        { traitType: 'Rating', value: metadataInput.rating },
        { traitType: 'Format', value: metadataInput.format },
        { traitType: 'Studio Name', value: metadataInput.studioName },
        { traitType: 'Budget', value: metadataInput.budget },
        { traitType: 'Director', value: metadataInput.director },
        { traitType: 'Writer', value: metadataInput.writer },
        { traitType: 'Producers', value: metadataInput.producers.join(', ') },
        { traitType: 'Editor', value: metadataInput.editor },
        { traitType: 'Creators', value: metadataInput.creators.join(', ') },
      ];

      console.log('attributes')
      console.log(attributes)

      // Prepara los medios
      const mediaItems: AnyMedia[] = metadataInput.media.map((mediaItem: any) => ({
        item: `ipfs://${mediaItem.item}`,
        type: mediaItem.type as any,
        altTag: mediaItem.altTag as string,
      }));

      console.log('media')
      console.log(mediaItems)

      // Crear el objeto de metadatos usando el helper 'video'
      const metadata = video({
        id: uuidv4(),
        title: metadataInput.title,
        content: metadataInput.synopsis,
        video: mediaItems[mediaItems.length -2] as any,
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
      console.log(metadata)

      // Subir los metadatos a IPFS
      const metadataUri = await uploadToIpfs(metadata);

      console.log('metadata cid')
      console.log(metadataUri)

      // Crear el post en Lens
      const result = await createPost({
        metadata: metadataUri,
        sponsored: false,
      });

      console.log('result')
      console.log(result)

      if (result.isFailure()) {
        console.error('Error creating post', result.error);
      } else {
        console.log('Post created successfully:', result.value);

        const awaiter = await result.value.waitForCompletion()

        console.log('awaiter')
        console.log(awaiter)

        handleClose(); // Cierra el modal
        setIpfsHash(''); // Reinicia el input
      }
    } catch (error) {
      console.error('Error submitting to Lens:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: File</title>
      </Helmet>

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
          <TextField
            fullWidth
            label="IPFS Hash"
            variant="outlined"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            sx={{
              input: { color: '#fff' },
              label: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
            }}
          />
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
            disabled={!ipfsHash} // Deshabilitar el botón si el input está vacío
          >
            Enviar
          </Button>
        </Box>
      </Modal>
    </>
  );
}
