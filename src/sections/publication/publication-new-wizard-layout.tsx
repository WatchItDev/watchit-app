import { type FC, type PropsWithChildren } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import PublicationNewWizardSummaryControl from './publication-new-wizard-summary-control.tsx'

interface MovieWizardContentLayoutProps {
  data: any;
  showNext?: boolean;
  disableNext?: boolean;
  showBack?: boolean;
  nextText?: string;
  onNext?: () => void;
  onBack?: () => void;
}

const PublicationWizardContentLayout: FC<PropsWithChildren<MovieWizardContentLayoutProps>> = ({
  children,
  data,
  showNext,
  disableNext = false,
  showBack,
  nextText = 'Continue',
  onNext,
  onBack,
}) => (
  <Grid container spacing={3} sx={{ margin: '0 !important', width: '100% !important' }}>
    <Grid xs={12} md={8} sx={{ pr: 2 }}>
      <Card sx={{ backgroundColor: '#2B2D31' }}>{children}</Card>
    </Grid>

    <Grid xs={12} md={4} sx={{ pl: 2 }}>
      <Box sx={{ position: 'sticky', top: '75px' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {showBack ? (
            <Button fullWidth size="large" variant="outlined" onClick={onBack}>
              Back
            </Button>
          ) : undefined}
          {showNext ? (
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={onNext}
              disabled={disableNext}
            >
              {nextText}
            </LoadingButton>
          ) : undefined}
        </Box>
        <PublicationNewWizardSummaryControl data={data} />
      </Box>
    </Grid>
  </Grid>
)

export default PublicationWizardContentLayout
