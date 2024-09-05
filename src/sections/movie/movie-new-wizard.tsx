import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MovieInformationForm from './movie-new-wizard-information';
import MediaAssetsForm from './movie-new-wizard-assets';
import DistributionForm from './movie-new-wizard-distribution';
import ReviewFinalizeForm from './movie-new-wizard-summary';
import MovieNewWizardSteps from './movie-new-wizard-steps';
import { useSettingsContext } from '../../components/settings';

const steps = ['Movie Information', 'Media Assets & Technical Details', 'Distribution & Rights'];

export default function MovieNewWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
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
    setFormData((prevData) => ({ ...prevData, ...data }));
    handleNext();
  };

  const handleFinalSubmit = () => {
    console.log('Final Data:', formData);
    // Aquí envías los datos finales
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 5,  mt: 5 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Add new movie
      </Typography>

      <Grid container justifyContent="flex-start">
        <Grid xs={12} md={12}>
          <MovieNewWizardSteps activeStep={activeStep} steps={steps} goToStep={goToStep} />
        </Grid>
      </Grid>

      {activeStep === 0 && <MovieInformationForm onSubmit={handleFormSubmit} data={formData} />}
      {activeStep === 1 && <MediaAssetsForm onSubmit={handleFormSubmit} onBack={handleBack} data={formData} />}
      {activeStep === 2 && <DistributionForm onSubmit={handleFormSubmit} onBack={handleBack} data={formData} />}
      {activeStep === 3 && <ReviewFinalizeForm onSubmit={handleFinalSubmit} onBack={handleBack} data={formData} />}
    </Container>
  );
}
