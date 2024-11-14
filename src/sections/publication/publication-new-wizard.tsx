import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
// import Header from '@src/layouts/dashboard/header';
import { useCreatePost } from '@lens-protocol/react-web';
// import { MetadataAttributeType } from '@lens-protocol/metadata';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import MovieInformationForm from './publication-new-wizard-information';
import MediaAssetsForm from './publication-new-wizard-assets';
import DistributionForm from './publication-new-wizard-distribution';
// import ReviewFinalizeForm from './movie-new-wizard-summary';
import PublicationNewWizardSteps from './publication-new-wizard-steps.tsx';
import { useSettingsContext } from '../../components/settings';
import { useAuth } from '../../hooks/use-auth';


const steps = ['Movie Information', 'Media Assets & Technical Details', 'Distribution & Rights'];

export default function PublicationNewWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const settings = useSettingsContext();
  const { selectedProfile: activeProfile } = useAuth();
  const { execute: createPost } = useCreatePost();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const goToStep = (step: number) => {
    setActiveStep(step);
  };

  const handleFormSubmit = (data: any) => {
    setFormData((prevData: any) => ({ ...prevData, ...data }));
    if (activeStep === steps.length - 1) {
      handleFinalSubmit();
    } else {
      handleNext();
    }
  };

  const uploadFileToIpfs = async (file: File) => {
    const helia = await createHelia();
    const fs = unixfs(helia);

    // Convertir ArrayBuffer a Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Subir archivo a IPFS
    const cid = await fs.addBytes(uint8Array);

    console.log('file ipfs')
    console.log(cid)
    console.log(cid?.toString?.())

    // Retornar la URI de IPFS
    return `ipfs://${cid?.toString?.()}`;
  };

  const submitMoviePost = async () => {
    if (!activeProfile) {
      console.error('No active profile found');
      return;
    }

    // Crear y subir los metadatos a IPFS
    const metadataUri = await createAndUploadMovieMetadata();

    // Crear la publicación en Lens
    const result = await createPost({
      metadata: metadataUri,
      sponsored: false
    });

    if (result.isFailure()) {
      console.error('Error creating post', result.error);
    } else {
      console.log('Post created successfully:', result.value);
    }
  };

  const createAndUploadMovieMetadata = async () => {
    const fileUploads: any = {};

    // Identificar y subir archivos a IPFS
    await Promise.all(
      Object.keys(formData).map(async (key) => {
        const value = formData[key];
        if (value instanceof File) {
          const fileUri = await uploadFileToIpfs(value);
          fileUploads[key] = fileUri;
        }
      })
    );

    console.log('file uploads')

    // Construir metadatos con los hashes de los archivos en IPFS
    const metadata = {
      title: formData.title,
      description: formData.description,
      genre: formData.genre,
      releaseDate: formData.releaseDate,
      duration: formData.duration,
      language: formData.language,
      country: formData.country,
      rating: formData.rating,
      format: formData.format,
      studioName: formData.studioName,
      filmingLocation: formData.filmingLocation,
      budget: formData.budget,
      filmingStart: formData.filmingStart,
      filmingEnd: formData.filmingEnd,
      director: formData.director,
      writer: formData.writer,
      producers: formData.producers,
      editor: formData.editor,
      soundEngineer: formData.soundEngineer,
      vfxSupervisor: formData.vfxSupervisor,
      leadActor: formData.leadActor,
      supportingActor: formData.supportingActor,
      supportingActress: formData.supportingActress,
      media: [
        {
          item: fileUploads.verticalPoster || '',
          type: 'image/jpeg',
          altTag: 'Vertical Poster',
        },
        {
          item: fileUploads.horizontalPoster || '',
          type: 'image/jpeg',
          altTag: 'Horizontal Poster',
        },
        {
          item: fileUploads.wallpaper || '',
          type: 'image/jpeg',
          altTag: 'Wallpaper',
        },
        {
          item: fileUploads.trailer || '',
          type: 'video/mp4',
          altTag: 'Movie Trailer',
        },
        {
          item: fileUploads.fullMovie || '',
          type: 'video/mp4',
          altTag: 'Full Movie',
        },
        {
          item: fileUploads.subtitles || '',
          type: 'text/vtt',
          altTag: 'Subtitles',
        },
      ],
      videoFormat: formData.videoFormat,
      resolution: formData.resolution,
      bitrate: formData.bitrate,
      codec: formData.codec,
      audioFormat: formData.audioFormat,
      audioChannels: formData.audioChannels,
      audioBitrate: formData.audioBitrate,
      subtitleFormat: formData.subtitleFormat,
      subtitleLanguage: formData.subtitleLanguage,
      termsOfServiceURL: formData.termsOfServiceURL,
      copyrightRegistrationNumber: formData.copyrightRegistrationNumber,
      copyrightHolder: formData.copyrightHolder,
      territory: formData.territory,
      licenseType: formData.licenseType,
      distribution: formData.distribution,
      creators: formData.creators,
      licenseDuration: formData.licenseDuration,
    };

    // Subir los metadatos a IPFS
    const metadataUri = await uploadFileToIpfs(new File([JSON.stringify(metadata)], 'metadata.json', { type: 'application/json' }));

    return metadataUri; // Devolver la URI de los metadatos
  };

  const handleFinalSubmit = async () => {
    try {
      console.log('Final Data:', formData);
      await submitMoviePost(); // Crear y enviar la publicación a Lens
      alert('Movie data successfully submitted to Lens!');
    } catch (error) {
      console.error('Error submitting movie to Lens:', error);
      alert('Failed to submit movie data to Lens');
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 5,  mt: 5 }}>

      <Grid container justifyContent="flex-start">
        <Grid xs={12} md={12}>
          <PublicationNewWizardSteps activeStep={activeStep} steps={steps} goToStep={goToStep} />
        </Grid>
      </Grid>

      {activeStep === 0 && <MovieInformationForm onSubmit={handleFormSubmit} data={formData} />}
      {activeStep === 1 && <MediaAssetsForm onSubmit={handleFormSubmit} onBack={handleBack} data={formData} />}
      {activeStep === 2 && <DistributionForm onSubmit={handleFormSubmit} onBack={handleBack} data={formData} />}
    </Container>
  );
}
