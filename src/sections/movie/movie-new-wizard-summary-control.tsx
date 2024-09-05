// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// utils
import { fCurrency } from 'src/utils/format-number';
import { IconCheck } from '@tabler/icons-react';
import Scrollbar from '../../components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  data: any
};

export default function MovieNewWizardSummaryControl({ data }: Props) {
  const renderSection = (title: any, items: any) => {
    const filteredItems = items.filter((item : any) => item.value);

    if (filteredItems.length === 0) {
      return null;
    }

    return (
      <Section title={title}>
        {filteredItems.map((item: any, index: number) => (
          <InfoItem key={index} label={item.label} value={item.value} />
        ))}
      </Section>
    );
  };

  function formatDate(date: any) {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  const basicInfoItems = [
    { label: 'Title', value: data?.title },
    { label: 'Description', value: data?.description },
    { label: 'Genre', value: data?.genre?.join?.(', ') },
    { label: 'Release Date', value: formatDate(data?.releaseDate) },
    { label: 'Duration', value: data?.duration ? `${data?.duration} minutes` : null },
    { label: 'Language', value: data?.language },
    { label: 'Country', value: data?.country },
    { label: 'Rating', value: data?.rating },
    { label: 'Format', value: data?.format },
    { label: 'Studio Name', value: data?.studioName },
    { label: 'Filming Location', value: data?.filmingLocation },
    { label: 'Budget', value: fCurrency(data?.budget) },
    { label: 'Filming Start', value: formatDate(data?.filmingStart) },
    { label: 'Filming End', value: formatDate(data?.filmingEnd) },
    { label: 'Director', value: data?.director },
    { label: 'Writer', value: data?.writer },
    { label: 'Producers', value: data?.producers },
    { label: 'Editor', value: data?.editor },
    { label: 'Sound Engineer', value: data?.soundEngineer },
    { label: 'VFX Supervisor', value: data?.vfxSupervisor },
    { label: 'Lead Actor', value: data?.leadActor },
    { label: 'Supporting Actor', value: data?.supportingActor },
    { label: 'Supporting Actress', value: data?.supportingActress }
  ];

  const mediaAssetsItems = [
    { label: 'Vertical Poster', value: data?.verticalPoster && <IconCheck color="success" style={{ stroke: '#22C55E' }} /> },
    { label: 'Horizontal Poster', value: data?.horizontalPoster && <IconCheck color="success" style={{ stroke: '#22C55E' }} /> },
    { label: 'Wallpaper', value: data?.wallpaper && <IconCheck color="success" style={{ stroke: '#22C55E' }} /> },
    { label: 'Trailer', value: data?.trailer && <IconCheck color="success" style={{ stroke: '#22C55E' }} /> },
    { label: 'Full Movie', value: data?.fullMovie && <IconCheck color="success" style={{ stroke: '#22C55E' }} /> },
    { label: 'Video URI', value: data?.videoURI && <IconCheck color="success" style={{ stroke: '#22C55E' }} />  },
    { label: 'Video Format', value: data?.videoFormat },
    { label: 'Resolution', value: data?.resolution },
    { label: 'Bitrate', value: data?.bitrate ? `${data?.bitrate} kbps` : null },
    { label: 'Codec', value: data?.codec },
    { label: 'Audio URI', value: data?.audioURI && <IconCheck color="success" style={{ stroke: '#22C55E' }} />  },
    { label: 'Audio Format', value: data?.audioFormat },
    { label: 'Audio Channels', value: data?.audioChannels },
    { label: 'Audio Bitrate', value: data?.audioBitrate ? `${data?.audioBitrate} kbps` : null },
    { label: 'Subtitle URI', value: data?.subtitleURI && <IconCheck color="success" style={{ stroke: '#22C55E' }} />  },
    { label: 'Subtitle Format', value: data?.subtitleFormat },
    { label: 'Subtitle Language', value: data?.subtitleLanguage }
  ];

  const distributionItems = [
    { label: 'License Type', value: data?.licenseType },
    { label: 'Territory', value: data?.territory },
    { label: 'License Duration', value: data?.licenseDuration?.toString?.() },
    { label: 'Copyright Holder', value: data?.copyrightHolder },
    { label: 'Copyright Registration Number', value: data?.copyrightRegistrationNumber },
    { label: 'Terms of Service URL', value: data?.termsOfServiceURL && <IconCheck color="success" style={{ stroke: '#22C55E' }} /> }
  ];

  const hasCreators = data?.creators && data?.creators.length > 0;
  const hasDistribution = data?.distribution && data?.distribution.length > 0;

  return (
    <Card sx={{ mt: 3, backgroundColor: '#2B2D31' }}>
      <CardHeader title="Movie Summary" />
      <CardContent>
        <Scrollbar sx={{ maxHeight: '75vh' }}>
          <Stack spacing={2}>
            {renderSection('Basic Information', basicInfoItems)}
            {basicInfoItems.some(item => item.value) && <Divider sx={{ borderStyle: 'dashed' }} />}
            {renderSection('Media Assets', mediaAssetsItems)}
            {mediaAssetsItems.some(item => item.value) && <Divider sx={{ borderStyle: 'dashed' }} />}
            {renderSection('Distribution', distributionItems)}
            {distributionItems.some(item => item.value) && <Divider sx={{ borderStyle: 'dashed' }} />}
            {hasCreators && (
              <Section title="Creators">
                <ul>
                  {data?.creators.map((creator: any, index: number) => (
                    <li key={index}>
                      <InfoItem label="Role" value={creator.role} />
                      <InfoItem label="Name" value={creator.name} />
                      <InfoItem label="Wallet Address" value={creator.walletAddress} />
                      <InfoItem label="Revenue Share" value={`${creator.revenueShare}%`} />
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {hasDistribution && (
              <Section title="Distribution">
                <ul>
                  {data?.distribution.map((dist: any, index: number) => (
                    <li key={index}>
                      <InfoItem label="Type" value={dist.type} />
                      <InfoItem label="Currency" value={dist.currency} />
                      <InfoItem label="Price" value={fCurrency(dist.price)} />
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {!basicInfoItems.some(item => item.value) &&
              !mediaAssetsItems.some(item => item.value) &&
              !distributionItems.some(item => item.value) &&
              !hasCreators &&
              !hasDistribution && (
                <Typography variant="h6" color="text.secondary">
                  No information available.
                </Typography>
              )}
          </Stack>
        </Scrollbar>
      </CardContent>
    </Card>
  );
}

// Componente para cada sección
function Section({ title, children }: any) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Stack spacing={1}>
        {children}
      </Stack>
    </Box>
  );
}

// Componente para cada ítem de información
function InfoItem({ label, value }: any) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="subtitle2">
        {value}
      </Typography>
    </Stack>
  );
}

// // @mui
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Divider from '@mui/material/Divider';
// import CardHeader from '@mui/material/CardHeader';
// import Typography from '@mui/material/Typography';
// import CardContent from '@mui/material/CardContent';
// // utils
// import { fCurrency } from 'src/utils/format-number';
// import Scrollbar from '../../components/scrollbar';
//
// // ----------------------------------------------------------------------
//
// type Props = {
//   data: any
// };
//
// export default function MovieNewWizardSummaryControl({ data }: Props) {
//   const {
//     title,
//     description,
//     genre,
//     releaseDate,
//     duration,
//     language,
//     country,
//     rating,
//     format,
//     studioName,
//     filmingLocation,
//     budget,
//     filmingStart,
//     filmingEnd,
//     director,
//     writer,
//     producers,
//     editor,
//     soundEngineer,
//     vfxSupervisor,
//     leadActor,
//     supportingActor,
//     supportingActress,
//     verticalPoster,
//     horizontalPoster,
//     wallpaper,
//     trailer,
//     fullMovie,
//     videoURI,
//     videoFormat,
//     resolution,
//     bitrate,
//     codec,
//     audioURI,
//     audioFormat,
//     audioChannels,
//     audioBitrate,
//     subtitleURI,
//     subtitleFormat,
//     subtitleLanguage,
//     creators,
//     distribution,
//     licenseType,
//     territory,
//     licenseDuration,
//     copyrightHolder,
//     copyrightRegistrationNumber,
//     termsOfServiceURL
//   } = data;
//
//   console.log('data')
//   console.log(data)
//
//   return (
//     <Card sx={{ mt: 3, backgroundColor: '#2B2D31' }}>
//       <CardHeader title="Movie Summary" />
//       <CardContent>
//         <Scrollbar sx={{ maxHeight: '75vh' }}>
//           <Stack spacing={2}>
//             <Section title="Basic Information">
//               {title && (
//                 <InfoItem label="Title" value={title} />
//               )}
//               {description && (
//                 <InfoItem label="Description" value={description} />
//               )}
//               {genre && (
//                 <InfoItem label="Genre" value={genre?.join?.(', ')} />
//               )}
//               {releaseDate && (
//                 <InfoItem label="Release Date" value={releaseDate?.toString?.()} />
//               )}
//               {duration && (
//                 <InfoItem label="Duration" value={`${duration} minutes`} />
//               )}
//               {language && (
//                 <InfoItem label="Language" value={language} />
//               )}
//               <InfoItem label="Country" value={country} />
//               <InfoItem label="Rating" value={rating} />
//               <InfoItem label="Format" value={format} />
//               <InfoItem label="Studio Name" value={studioName} />
//               <InfoItem label="Filming Location" value={filmingLocation} />
//               <InfoItem label="Budget" value={fCurrency(budget)} />
//               <InfoItem label="Filming Start" value={filmingStart?.toString?.()} />
//               <InfoItem label="Filming End" value={filmingEnd?.toString?.()} />
//               <InfoItem label="Director" value={director} />
//               <InfoItem label="Writer" value={writer} />
//               <InfoItem label="Producers" value={producers} />
//               <InfoItem label="Editor" value={editor} />
//               <InfoItem label="Sound Engineer" value={soundEngineer} />
//               <InfoItem label="VFX Supervisor" value={vfxSupervisor} />
//               <InfoItem label="Lead Actor" value={leadActor} />
//               <InfoItem label="Supporting Actor" value={supportingActor} />
//               <InfoItem label="Supporting Actress" value={supportingActress} />
//             </Section>
//
//             <Divider sx={{ borderStyle: 'dashed' }} />
//
//             <Section title="Media Assets">
//               {verticalPoster && (
//                 <InfoItem label="Vertical Poster" value={<img src={verticalPoster} alt="Vertical Poster" style={{ maxWidth: '200px' }} />} />
//               )}
//               {horizontalPoster && (
//                 <InfoItem label="Horizontal Poster" value={<img src={horizontalPoster} alt="Horizontal Poster" style={{ maxWidth: '200px' }} />} />
//               )}
//               {wallpaper && (
//                 <InfoItem label="Wallpaper" value={<img src={wallpaper} alt="Wallpaper" style={{ maxWidth: '200px' }} />} />
//               )}
//               {trailer && (
//                 <InfoItem label="Trailer" value={<a href={trailer} target="_blank" rel="noopener noreferrer">View Trailer</a>} />
//               )}
//               {fullMovie && (
//                 <InfoItem label="Full Movie" value={<a href={fullMovie} target="_blank" rel="noopener noreferrer">View Full Movie</a>} />
//               )}
//               <InfoItem label="Video URI" value={videoURI} />
//               <InfoItem label="Video Format" value={videoFormat} />
//               <InfoItem label="Resolution" value={resolution} />
//               <InfoItem label="Bitrate" value={`${bitrate} kbps`} />
//               <InfoItem label="Codec" value={codec} />
//               <InfoItem label="Audio URI" value={audioURI} />
//               <InfoItem label="Audio Format" value={audioFormat} />
//               <InfoItem label="Audio Channels" value={audioChannels} />
//               <InfoItem label="Audio Bitrate" value={`${audioBitrate} kbps`} />
//               <InfoItem label="Subtitle URI" value={subtitleURI} />
//               <InfoItem label="Subtitle Format" value={subtitleFormat} />
//               <InfoItem label="Subtitle Language" value={subtitleLanguage} />
//             </Section>
//
//             <Divider sx={{ borderStyle: 'dashed' }} />
//
//             <Section title="Distribution">
//               <InfoItem label="License Type" value={licenseType} />
//               <InfoItem label="Territory" value={territory} />
//               <InfoItem label="License Duration" value={licenseDuration?.toString?.()} />
//               <InfoItem label="Copyright Holder" value={copyrightHolder} />
//               <InfoItem label="Copyright Registration Number" value={copyrightRegistrationNumber} />
//               <InfoItem label="Terms of Service URL" value={<a href={termsOfServiceURL} target="_blank" rel="noopener noreferrer">View Terms</a>} />
//               <Typography variant="h6">Creators:</Typography>
//               <ul>
//                 {creators && creators.map((creator: any, index: any) => (
//                   <li key={index}>
//                     <InfoItem label="Role" value={creator.role} />
//                     <InfoItem label="Name" value={creator.name} />
//                     <InfoItem label="Wallet Address" value={creator.walletAddress} />
//                     <InfoItem label="Revenue Share" value={`${creator.revenueShare}%`} />
//                   </li>
//                 ))}
//               </ul>
//               <Typography variant="h6">Distribution:</Typography>
//               <ul>
//                 {distribution && distribution.map((dist: any, index: any) => (
//                   <li key={index}>
//                     <InfoItem label="Type" value={dist.type} />
//                     <InfoItem label="Currency" value={dist.currency} />
//                     <InfoItem label="Price" value={fCurrency(dist.price)} />
//                   </li>
//                 ))}
//               </ul>
//             </Section>
//           </Stack>
//         </Scrollbar>
//       </CardContent>
//     </Card>
//   );
// }
//
// // Componente para cada sección
// function Section({ title, children }: any) {
//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>
//         {title}
//       </Typography>
//       <Stack spacing={1}>
//         {children}
//       </Stack>
//     </Box>
//   );
// }
//
// // Componente para cada ítem de información
// function InfoItem({ label, value }: any) {
//   return (
//     <Stack direction="row" justifyContent="space-between">
//       <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//         {label}
//       </Typography>
//       <Typography variant="subtitle2">
//         {value}
//       </Typography>
//     </Stack>
//   );
// }


// // @mui
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Divider from '@mui/material/Divider';
// import CardHeader from '@mui/material/CardHeader';
// import Typography from '@mui/material/Typography';
// import CardContent from '@mui/material/CardContent';
// // utils
// import { fCurrency } from 'src/utils/format-number';
// import Scrollbar from '../../components/scrollbar';
//
// // ----------------------------------------------------------------------
//
// type Props = {
//   data: any
// };
//
// export default function MovieNewWizardSummaryControl({ data }: Props) {
//   return (
//     <Card sx={{ mt: 3, backgroundColor: '#2B2D31' }}>
//       <CardHeader
//         title="Movie Summary"
//       />
//       <CardContent>
//         <Scrollbar sx={{ maxHeight: '75vh' }}>
//           <Stack spacing={2}>
//             <Stack direction="row" justifyContent="space-between">
//               <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                 Sub Total
//               </Typography>
//               <Typography variant="subtitle2">{fCurrency(10)}</Typography>
//             </Stack>
//
//             <Divider sx={{ borderStyle: 'dashed' }} />
//
//             <Stack direction="row" justifyContent="space-between">
//               <Typography variant="subtitle1">Total</Typography>
//               <Box sx={{ textAlign: 'right' }}>
//                 <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
//                   {fCurrency(10)}
//                 </Typography>
//                 <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
//                   (VAT included if applicable)
//                 </Typography>
//               </Box>
//             </Stack>
//           </Stack>
//         </Scrollbar>
//       </CardContent>
//     </Card>
//   );
// }
