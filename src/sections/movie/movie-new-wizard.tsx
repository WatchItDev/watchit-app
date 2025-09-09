import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import MovieInformationForm from './movie-new-wizard-information';
import MediaAssetsForm from './movie-new-wizard-assets';
import DistributionForm from './movie-new-wizard-distribution';
import MovieNewWizardSteps from './movie-new-wizard-steps';
import { useSettingsContext } from '../../components/settings';

const steps = ['Movie Information', 'Media Assets & Technical Details', 'Distribution & Rights'];

export default function MovieNewWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const settings = useSettingsContext();

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

  const handleFinalSubmit = async () => {
    try {
      console.log('Final Data:', formData);
      alert('Movie data successfully submitted!');
    } catch (error) {
      console.error('Error submitting movie:', error);
      alert('Failed to submit movie data');
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 5,  mt: 5 }}>

      <Grid container justifyContent="flex-start">
        <Grid xs={12} md={12}>
          <MovieNewWizardSteps activeStep={activeStep} steps={steps} goToStep={goToStep} />
        </Grid>
      </Grid>

      {activeStep === 0 && <MovieInformationForm onSubmit={handleFormSubmit} data={formData} />}
      {activeStep === 1 && <MediaAssetsForm onSubmit={handleFormSubmit} onBack={handleBack} data={formData} />}
      {activeStep === 2 && <DistributionForm onSubmit={handleFormSubmit} onBack={handleBack} data={formData} />}
    </Container>
  );
}
