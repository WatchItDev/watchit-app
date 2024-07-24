// @mui
import Masonry from '@mui/lab/Masonry';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
//
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

const COLORS = ['inherit', 'primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

type CircularProps = {
  progress: number;
};

export default function ProgressCircular({ progress }: CircularProps) {
  const renderLabel = (text: string) => (
    <Typography variant="overline" component="div" sx={{ color: 'text.secondary', mb: 1 }}>
      {text}
    </Typography>
  );

  return (
    <Masonry columns={{ xs: 1, md: 3 }} spacing={3}>
      <div>
        {renderLabel('Indeterminate')}
        <ComponentBlock sx={{ bgcolor: 'background.paper', borderRadius: 1.5 }}>
          {COLORS.map((color) => (
            <CircularProgress key={color} color={color} />
          ))}
        </ComponentBlock>
      </div>

      <div>
        {renderLabel('Determinate')}
        <ComponentBlock sx={{ bgcolor: 'background.paper', borderRadius: 1.5 }}>
          <CircularProgress color="info" />
          <CircularProgress color="info" variant="determinate" value={25} />
          <CircularProgress color="info" variant="determinate" value={50} />
          <CircularProgress color="info" variant="determinate" value={75} />
          <CircularProgress color="info" variant="determinate" value={100} />
          <CircularProgress color="info" variant="determinate" value={progress} />
        </ComponentBlock>
      </div>

      <div>
        {renderLabel('Sizes')}
        <ComponentBlock sx={{ bgcolor: 'background.paper', borderRadius: 1.5 }}>
          <CircularProgress size={48} color="info" />
          <CircularProgress color="info" />
          <CircularProgress size={32} color="info" />
          <CircularProgress size={24} color="info" />
        </ComponentBlock>
      </div>
    </Masonry>
  );
}
